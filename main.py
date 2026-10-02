"""
DoseGuard AI - FastAPI Application Server
Provides RESTful API and serves the professional web interface.
Ready for deployment on Render.
Strictly free of emojis.
"""

import os
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
import uvicorn

from core.models import FamilyVault
from core.ai_engine import DoseGuardAIEngine
from core.sample_data import SAMPLE_PRESCRIPTIONS

# Initialize FastAPI App
app = FastAPI(
    title="DoseGuard AI API",
    description="Privacy-focused family medication management platform",
    version="2.4.0"
)

# Initialize Core Services
vault = FamilyVault()
ai_engine = DoseGuardAIEngine()

# Static directories
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static")
TEMPLATES_DIR = os.path.join(BASE_DIR, "templates")

# Mount Static Files
os.makedirs(STATIC_DIR, exist_ok=True)
os.makedirs(os.path.join(STATIC_DIR, "css"), exist_ok=True)
os.makedirs(os.path.join(STATIC_DIR, "js"), exist_ok=True)
os.makedirs(TEMPLATES_DIR, exist_ok=True)

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


# Pydantic Request Models
class MarkTakenRequest(BaseModel):
    profile_id: str
    med_id: str
    taken_by: Optional[str] = "Family Caregiver"


class UnmarkTakenRequest(BaseModel):
    profile_id: str
    med_id: str


class AddMedicationRequest(BaseModel):
    profile_id: str
    name: str
    dosage: str
    timing: str
    food_instruction: str
    purpose: str
    caution: str


class AddProfileRequest(BaseModel):
    name: str
    role: str
    age: int = 60
    notes: str = ""


class ParseTextRequest(BaseModel):
    text: str
    sample_key: Optional[str] = None


class BatchAddMedicationsRequest(BaseModel):
    profile_id: str
    medications: List[Dict[str, Any]]


class ChatRequest(BaseModel):
    profile_id: str
    question: str


# Root and Health Routes
@app.get("/")
def get_index():
    index_path = os.path.join(TEMPLATES_DIR, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return JSONResponse({"status": "healthy", "service": "DoseGuard AI"})


@app.get("/health")
def healthcheck():
    return {"status": "healthy", "engine": ai_engine.engine_version}


# API Endpoints
@app.get("/api/profiles")
def get_all_profiles():
    profiles = vault.get_profiles()
    summary = vault.get_family_caregiver_summary()
    return {
        "profiles": profiles,
        "caregiver_summary": summary,
        "today": vault.get_today_str()
    }


@app.get("/api/profiles/{profile_id}")
def get_profile_detail(profile_id: str):
    profile = vault.get_profile(profile_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    adherence = vault.calculate_today_adherence(profile_id)
    return {
        "profile": profile,
        "adherence": adherence
    }


@app.post("/api/profiles")
def create_profile(req: AddProfileRequest):
    new_profile = vault.add_profile(req.name, req.role, req.age, req.notes)
    return {"status": "success", "profile": new_profile}


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


@app.post("/api/prescription/upload")
async def upload_prescription_document(file: UploadFile = File(...)):
    # Simulates OCR ingestion for image documents
    filename = file.filename or "uploaded_document"
    contents = await file.read()
    demo_script = """
APEX CLINICAL OUTPATIENT SUMMARY
Patient: Uploaded Record
Prescribed Items:
1. Pantoprazole 40 mg - 1 tablet morning on an empty stomach.
2. Paracetamol 650 mg - 1 tablet afternoon following meals for joint discomfort.
3. Cetirizine 10 mg - 1 tablet night at bedtime.
    """.strip()
    parsed = ai_engine.parse_prescription_text(demo_script)
    return {
        "source": f"Scanned File: {filename} ({len(contents)} bytes)",
        "raw_text": demo_script,
        "medications": parsed
    }


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


# Application Entrypoint
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
