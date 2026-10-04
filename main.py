"""
DoseGuard AI - FastAPI Application Server
Provides RESTful API and serves the professional web interface.
Features public landing, PIN authentication, personal member dashboards with biometric profiles,
family-wide medication transparency, and audio alarms with math puzzle verification.
Ready for deployment on Render.
Strictly free of emojis.
"""

import os
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, HTTPException, UploadFile, File, Form, status
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
import uvicorn

from core.models import FamilyVault
from core.ai_engine import DoseGuardAIEngine
from core.sample_data import SAMPLE_PRESCRIPTIONS

app = FastAPI(
    title="DoseGuard AI API",
    description="Privacy-focused family medication management platform",
    version="3.1.0"
)

vault = FamilyVault()
ai_engine = DoseGuardAIEngine()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static")
TEMPLATES_DIR = os.path.join(BASE_DIR, "templates")

os.makedirs(STATIC_DIR, exist_ok=True)
os.makedirs(os.path.join(STATIC_DIR, "css"), exist_ok=True)
os.makedirs(os.path.join(STATIC_DIR, "js"), exist_ok=True)
os.makedirs(TEMPLATES_DIR, exist_ok=True)

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


# Pydantic Schemas
class LoginRequest(BaseModel):
    username: str
    password: str


class RegisterRequest(BaseModel):
    first_name: str
    last_name: str
    gender: str
    age: int
    username: str
    password: str


class OnboardingRequest(BaseModel):
    profile_id: str
    weight: Optional[str] = "-"
    height: Optional[str] = "-"
    blood_group: Optional[str] = "-"
    doctor: Optional[str] = "Family Care Physician"
    notes: Optional[str] = ""
    is_admin: Optional[bool] = False
    initial_med_name: Optional[str] = None
    initial_med_dosage: Optional[str] = None
    initial_med_time: Optional[str] = None
    initial_med_timing: Optional[str] = "Morning"
    initial_med_food: Optional[str] = None
    initial_med_purpose: Optional[str] = None
    initial_med_caution: Optional[str] = None


class UpdateProfileRequest(BaseModel):
    profile_id: str
    age: int
    weight: str
    height: str
    blood_group: str
    notes: str


class MarkTakenRequest(BaseModel):
    profile_id: str
    med_id: str
    taken_by: Optional[str] = "Self"


class UnmarkTakenRequest(BaseModel):
    profile_id: str
    med_id: str


class AddMedicationRequest(BaseModel):
    profile_id: str
    name: str
    dosage: str
    time: Optional[str] = "08:00 AM"
    timing: str = "Morning"
    food_instruction: str = "Take with water"
    purpose: str = "Prescribed Regimen"
    caution: str = "Follow physician instructions"


class ParseTextRequest(BaseModel):
    text: str
    sample_key: Optional[str] = None


class BatchAddMedicationsRequest(BaseModel):
    profile_id: str
    medications: List[Dict[str, Any]]


class ChatRequest(BaseModel):
    profile_id: str
    question: str


# Page Routes
@app.get("/")
def get_index():
    index_path = os.path.join(TEMPLATES_DIR, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return JSONResponse({"status": "healthy", "service": "DoseGuard AI"})


@app.get("/about")
def get_about():
    about_path = os.path.join(TEMPLATES_DIR, "about.html")
    if os.path.exists(about_path):
        return FileResponse(about_path)
    return FileResponse(os.path.join(TEMPLATES_DIR, "index.html"))


@app.get("/login")
def get_login():
    login_path = os.path.join(TEMPLATES_DIR, "login.html")
    if os.path.exists(login_path):
        return FileResponse(login_path)
    return FileResponse(os.path.join(TEMPLATES_DIR, "index.html"))


@app.get("/dashboard")
def get_dashboard():
    dash_folder_index = os.path.join(TEMPLATES_DIR, "dashboard", "index.html")
    if os.path.exists(dash_folder_index):
        return FileResponse(dash_folder_index)
    dash_path = os.path.join(TEMPLATES_DIR, "dashboard.html")
    if os.path.exists(dash_path):
        return FileResponse(dash_path)
    return FileResponse(os.path.join(TEMPLATES_DIR, "index.html"))


@app.get("/health")
def healthcheck():
    return {"status": "healthy", "engine": ai_engine.engine_version}


# Authentication (Username & Password)
@app.post("/api/auth/login")
def login_with_password(req: LoginRequest):
    profile = vault.verify_credentials(req.username, req.password)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password. Please verify your credentials."
        )

    adherence = vault.calculate_today_adherence(profile["id"])
    safe_profile = {k: v for k, v in profile.items() if k not in ["password", "pin"]}
    return {
        "status": "success",
        "profile": safe_profile,
        "adherence": adherence
    }


@app.post("/api/auth/register")
def register_member(req: RegisterRequest):
    clean_username = req.username.strip().lower()
    if not clean_username:
        raise HTTPException(status_code=400, detail="Username is required.")

    existing = vault.find_profile_by_identifier(clean_username)
    if existing:
        raise HTTPException(
            status_code=400,
            detail=f"Username '{clean_username}' is already in use. Please select a unique username."
        )

    clean_first = req.first_name.strip()
    clean_last = req.last_name.strip()
    if not clean_first:
        raise HTTPException(status_code=400, detail="First name is required.")
    if not clean_last:
        raise HTTPException(status_code=400, detail="Second name (last name) is required.")

    clean_pwd = req.password.strip()
    if not clean_pwd or len(clean_pwd) < 4:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 4 characters."
        )

    member_data = {
        "first_name": clean_first,
        "last_name": clean_last,
        "username": clean_username,
        "gender": req.gender.strip() or "Unspecified",
        "age": int(req.age or 30),
        "password": clean_pwd
    }

    new_profile = vault.register_new_member(member_data)
    safe_profile = {k: v for k, v in new_profile.items() if k not in ["password", "pin"]}
    adherence = vault.calculate_today_adherence(new_profile["id"])

    return {
        "status": "success",
        "profile": safe_profile,
        "adherence": adherence
    }


@app.post("/api/profiles/complete-onboarding")
def complete_onboarding(req: OnboardingRequest):
    init_med = None
    if req.initial_med_name and req.initial_med_name.strip():
        init_med = {
            "name": req.initial_med_name.strip(),
            "dosage": req.initial_med_dosage.strip() if req.initial_med_dosage else "1 Unit",
            "time": req.initial_med_time.strip() if req.initial_med_time else "08:00 AM",
            "timing": req.initial_med_timing or "Morning",
            "food_instruction": req.initial_med_food.strip() if req.initial_med_food else "Take with water",
            "purpose": req.initial_med_purpose.strip() if req.initial_med_purpose else "Prescribed Regimen",
            "caution": req.initial_med_caution.strip() if req.initial_med_caution else "Follow physician guidance"
        }

    onboarding_data = {
        "weight": req.weight,
        "height": req.height,
        "blood_group": req.blood_group,
        "doctor": req.doctor,
        "notes": req.notes,
        "is_admin": req.is_admin,
        "initial_medication": init_med
    }

    updated_profile = vault.complete_onboarding(req.profile_id, onboarding_data)
    if not updated_profile:
        raise HTTPException(status_code=404, detail="Member profile not found.")

    safe_profile = {k: v for k, v in updated_profile.items() if k not in ["password", "pin"]}
    adherence = vault.calculate_today_adherence(updated_profile["id"])

    return {
        "status": "success",
        "profile": safe_profile,
        "adherence": adherence
    }


# Family Profiles & Biometrics
@app.get("/api/profiles")
def get_profiles_list():
    profiles = vault.get_profiles()
    safe_list = []
    for p in profiles:
        name_parts = p["name"].split()
        first = p.get("first_name", name_parts[0] if len(name_parts) > 0 else p["name"])
        last = p.get("last_name", name_parts[1] if len(name_parts) > 1 else "")
        safe_list.append({
            "id": p["id"],
            "username": p.get("username", p["id"]),
            "first_name": first,
            "last_name": last,
            "name": p["name"],
            "role": p["role"],
            "gender": p.get("gender", "Unspecified"),
            "initials": p.get("initials", p["role"][:2].upper()),
            "age": p.get("age", 50),
            "weight": p.get("weight", "60 kg"),
            "height": p.get("height", "165 cm"),
            "blood_group": p.get("blood_group", "O+"),
            "doctor": p.get("doctor", "Family Care Physician"),
            "is_admin": p.get("is_admin", False),
            "badge_color": p.get("badge_color", "#0284c7"),
            "med_count": len([m for m in p.get("medications", []) if m.get("active", True)])
        })
    return {"profiles": safe_list}


@app.get("/api/profiles/{profile_id}")
def get_profile_detail(profile_id: str):
    profile = vault.get_profile(profile_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    adherence = vault.calculate_today_adherence(profile_id)
    safe_profile = {k: v for k, v in profile.items() if k != "pin"}
    return {
        "profile": safe_profile,
        "adherence": adherence
    }


@app.post("/api/profiles/update")
def update_profile(req: UpdateProfileRequest):
    updated = vault.update_profile_info(
        req.profile_id,
        req.age,
        req.weight,
        req.height,
        req.blood_group,
        req.notes
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Profile not found")
    safe_profile = {k: v for k, v in updated.items() if k != "pin"}
    return {"status": "success", "profile": safe_profile}


@app.get("/api/family/all-medications")
def get_all_family_medications():
    overview = vault.get_all_family_overview()
    return {
        "family_overview": overview,
        "today": vault.get_today_str()
    }


# Medication CRUD
@app.post("/api/medications/mark-taken")
def mark_medication_taken(req: MarkTakenRequest):
    success = vault.mark_taken(req.profile_id, req.med_id, req.taken_by)
    if not success:
        raise HTTPException(status_code=400, detail="Could not record medication status")
    adherence = vault.calculate_today_adherence(req.profile_id)
    return {"status": "success", "adherence": adherence}


@app.post("/api/medications/unmark-taken")
def unmark_medication_taken(req: UnmarkTakenRequest):
    success = vault.unmark_taken(req.profile_id, req.med_id)
    if not success:
        raise HTTPException(status_code=400, detail="Could not revert medication status")
    adherence = vault.calculate_today_adherence(req.profile_id)
    return {"status": "success", "adherence": adherence}


@app.post("/api/medications/add")
def add_single_medication(req: AddMedicationRequest):
    success = vault.add_medication(req.profile_id, {
        "name": req.name,
        "dosage": req.dosage,
        "time": req.time,
        "timing": req.timing,
        "food_instruction": req.food_instruction,
        "purpose": req.purpose,
        "caution": req.caution
    })
    if not success:
        raise HTTPException(status_code=400, detail="Failed to add medication")
    return {"status": "success"}


@app.delete("/api/medications/{profile_id}/{med_id}")
def delete_single_medication(profile_id: str, med_id: str):
    success = vault.delete_medication(profile_id, med_id)
    if not success:
        raise HTTPException(status_code=400, detail="Failed to delete medication")
    return {"status": "success"}


@app.post("/api/medications/batch-add")
def batch_add_medications(req: BatchAddMedicationsRequest):
    for med in req.medications:
        vault.add_medication(req.profile_id, med)
    return {"status": "success", "count": len(req.medications)}


# AI Prescription & Invoice Ingestion
@app.get("/api/samples")
def get_sample_prescriptions():
    return SAMPLE_PRESCRIPTIONS


@app.post("/api/prescription/parse")
def parse_prescription(req: ParseTextRequest):
    if req.sample_key and req.sample_key in SAMPLE_PRESCRIPTIONS:
        sample = SAMPLE_PRESCRIPTIONS[req.sample_key]
        return {
            "source": sample["title"],
            "medications": sample["parsed_items"]
        }

    parsed = ai_engine.parse_prescription_text(req.text)
    return {
        "source": "Custom Input Document",
        "medications": parsed
    }


# Health Companion
@app.post("/api/chat/ask")
def ask_clinical_companion(req: ChatRequest):
    profile = vault.get_profile(req.profile_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    answer = ai_engine.answer_family_question(
        question=req.question,
        profile_name=f"{profile['role']} ({profile['name']})",
        medications=profile.get("medications", [])
    )
    return {
        "profile_id": req.profile_id,
        "answer": answer
    }


@app.get("/api/export")
def export_health_vault():
    return vault.data


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
