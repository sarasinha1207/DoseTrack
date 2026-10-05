"""
Family Data Layer for DoseTrack.
Stores family members, credentials (Username/PIN), biometrics, Admin/Primary roles,
medication schedules, and daily intake verification logs.
Strictly free of emojis. Clean professional medical data structure.
"""

import csv
import json
import os
from datetime import datetime, date
from typing import Dict, List, Any, Optional

DATA_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "family_health_vault.json")
VITALS_CSV_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "vitals_records.csv")

DEFAULT_FAMILY_DATA = {
    "profiles": [
        {
            "id": "mother",
            "username": "sunita",
            "password": "sunita123",
            "first_name": "Sunita",
            "last_name": "Sharma",
            "name": "Sunita Sharma",
            "role": "Mother",
            "gender": "Female",
            "initials": "MO",
            "pin": "1111",
            "age": 54,
            "weight": "62 kg",
            "height": "158 cm",
            "blood_group": "B+",
            "doctor": "Dr. R. Sharma, MD (Endocrinology)",
            "is_admin": True,
            "badge_color": "#0284c7",
            "notes": "Primary Hypothyroidism and mild Osteopenia. Maintain 4-hour gap between thyroid medication and calcium.",
            "medications": [
                {
                    "id": "med_mo_1",
                    "name": "Levothyroxine Sodium",
                    "dosage": "50 mcg",
                    "time": "06:30 AM",
                    "timing": "Morning",
                    "food_instruction": "Empty stomach with plain water (wait 45-60 mins before morning breakfast or tea)",
                    "purpose": "Thyroid Hormone Balance",
                    "caution": "Keep at least 4 hours apart from calcium supplements",
                    "active": True
                },
                {
                    "id": "med_mo_2",
                    "name": "Shelcal 500 (Calcium + D3)",
                    "dosage": "500 mg",
                    "time": "01:30 PM",
                    "timing": "Afternoon",
                    "food_instruction": "Strictly after lunch with a full glass of water",
                    "purpose": "Bone Density and Joint Health",
                    "caution": "Do not take concurrently with morning thyroid pill",
                    "active": True
                },
                {
                    "id": "med_mo_3",
                    "name": "Omega-3 Fish Oil",
                    "dosage": "1000 mg",
                    "time": "08:30 PM",
                    "timing": "Night",
                    "food_instruction": "With evening dinner",
                    "purpose": "Cardiovascular and Lipid Support",
                    "caution": "Take with meal for optimal bioavailability",
                    "active": True
                }
            ],
            "logs": {}
        },
        {
            "id": "father",
            "username": "rajesh",
            "password": "rajesh123",
            "first_name": "Rajesh",
            "last_name": "Sharma",
            "name": "Rajesh Sharma",
            "role": "Father",
            "gender": "Male",
            "initials": "FA",
            "pin": "2222",
            "age": 59,
            "weight": "74 kg",
            "height": "172 cm",
            "blood_group": "A+",
            "doctor": "Dr. K. Mehta, MD (Cardiology)",
            "is_admin": False,
            "badge_color": "#2563eb",
            "notes": "Essential Hypertension and Type 2 Diabetes. Routine blood pressure and fasting glucose monitoring required.",
            "medications": [
                {
                    "id": "med_fa_1",
                    "name": "Telmisartan",
                    "dosage": "40 mg",
                    "time": "08:00 AM",
                    "timing": "Morning",
                    "food_instruction": "After morning breakfast",
                    "purpose": "Blood Pressure Regulation",
                    "caution": "Do not skip or discontinue without physician consent",
                    "active": True
                },
                {
                    "id": "med_fa_2",
                    "name": "Metformin ER",
                    "dosage": "500 mg",
                    "time": "08:30 AM",
                    "timing": "Morning",
                    "food_instruction": "With morning breakfast",
                    "purpose": "Glycemic Control",
                    "caution": "Always administer with meals to minimize gastric distress",
                    "active": True
                },
                {
                    "id": "med_fa_3",
                    "name": "Metformin ER",
                    "dosage": "500 mg",
                    "time": "08:00 PM",
                    "timing": "Night",
                    "food_instruction": "With evening dinner",
                    "purpose": "Glycemic Control",
                    "caution": "Always administer with meals to minimize gastric distress",
                    "active": True
                },
                {
                    "id": "med_fa_4",
                    "name": "Atorvastatin",
                    "dosage": "10 mg",
                    "time": "10:00 PM",
                    "timing": "Night",
                    "food_instruction": "At bedtime with plain water",
                    "purpose": "Lipid and Cholesterol Regulation",
                    "caution": "Strictly avoid grapefruit and grapefruit juice",
                    "active": True
                }
            ],
            "logs": {}
        },
        {
            "id": "grandfather",
            "username": "ramesh",
            "password": "ramesh123",
            "first_name": "Ramesh",
            "last_name": "Sharma",
            "name": "Ramesh Sharma",
            "role": "Grandfather",
            "gender": "Male",
            "initials": "GF",
            "pin": "3333",
            "age": 82,
            "weight": "68 kg",
            "height": "168 cm",
            "blood_group": "O+",
            "doctor": "Dr. Verma, Geriatric Specialist",
            "is_admin": False,
            "badge_color": "#0d9488",
            "notes": "Geriatric care protocol. Requires assistance with ambulation and warm fluids with doses.",
            "medications": [
                {
                    "id": "med_gf_1",
                    "name": "Amlodipine Besylate",
                    "dosage": "5 mg",
                    "time": "08:30 AM",
                    "timing": "Morning",
                    "food_instruction": "After breakfast around 8:30 AM",
                    "purpose": "Hypertension Control",
                    "caution": "Instruct patient to stand up slowly from seated position",
                    "active": True
                },
                {
                    "id": "med_gf_2",
                    "name": "Glucosamine + Chondroitin",
                    "dosage": "750 mg",
                    "time": "01:30 PM",
                    "timing": "Afternoon",
                    "food_instruction": "After lunch with warm water",
                    "purpose": "Osteoarthritis Cartilage Support",
                    "caution": "Administer with warm fluid for swallowing ease",
                    "active": True
                },
                {
                    "id": "med_gf_3",
                    "name": "Tears Naturale Eye Drops",
                    "dosage": "1 Drop each eye",
                    "time": "09:00 AM",
                    "timing": "Morning",
                    "food_instruction": "Ophthalmic instillation",
                    "purpose": "Corneal Lubrication and Dry Eye Relief",
                    "caution": "Ensure proper hand hygiene before instilling drops",
                    "active": True
                },
                {
                    "id": "med_gf_4",
                    "name": "Melatonin",
                    "dosage": "3 mg",
                    "time": "09:30 PM",
                    "timing": "Night",
                    "food_instruction": "30 minutes before sleep with warm water or milk",
                    "purpose": "Circadian Sleep Stabilization",
                    "caution": "Ensure low ambient lighting after administration",
                    "active": True
                }
            ],
            "logs": {}
        },
        {
            "id": "grandmother",
            "username": "kamla",
            "password": "kamla123",
            "first_name": "Kamla",
            "last_name": "Sharma",
            "name": "Kamla Sharma",
            "role": "Grandmother",
            "gender": "Female",
            "initials": "GM",
            "pin": "4444",
            "age": 78,
            "weight": "58 kg",
            "height": "152 cm",
            "blood_group": "AB+",
            "doctor": "Dr. Ananya, Family Medicine",
            "is_admin": False,
            "badge_color": "#d97706",
            "notes": "Peripheral joint stiffness and vitamin deficiency. Prefers mid-morning doses.",
            "medications": [
                {
                    "id": "med_gm_1",
                    "name": "Cholecalciferol + Calcium",
                    "dosage": "500 mg",
                    "time": "09:00 AM",
                    "timing": "Morning",
                    "food_instruction": "After morning meal with milk or water",
                    "purpose": "Bone Mineralization and Density Support",
                    "caution": "Maintain regular daily timing",
                    "active": True
                },
                {
                    "id": "med_gm_2",
                    "name": "Vitamin B-Complex (Neurobion)",
                    "dosage": "1 Tablet",
                    "time": "02:00 PM",
                    "timing": "Afternoon",
                    "food_instruction": "After midday lunch with water",
                    "purpose": "Neuropathy and Nerve Health",
                    "caution": "Take following food intake",
                    "active": True
                }
            ],
            "logs": {}
        },
        {
            "id": "daughter",
            "username": "alina",
            "password": "alina123",
            "first_name": "Alina",
            "last_name": "Sharma",
            "name": "Alina Sharma",
            "role": "Daughter",
            "gender": "Female",
            "initials": "AL",
            "pin": "5555",
            "age": 24,
            "weight": "56 kg",
            "height": "165 cm",
            "blood_group": "O+",
            "doctor": "Dr. Lisa, Wellness & Preventative Care",
            "is_admin": True,
            "badge_color": "#ec4899",
            "notes": "Daily wellness, iron supplementation, and allergy management.",
            "medications": [
                {
                    "id": "med_al_1",
                    "name": "Vitamin C",
                    "dosage": "2 Capsules",
                    "time": "06:30 AM",
                    "timing": "Morning",
                    "food_instruction": "With water before breakfast",
                    "purpose": "Immune and Cellular Support",
                    "caution": "Stay hydrated throughout the day",
                    "active": True
                },
                {
                    "id": "med_al_2",
                    "name": "Valtum Plus 25",
                    "dosage": "2 Pills",
                    "time": "08:00 AM",
                    "timing": "Morning",
                    "food_instruction": "With morning meal",
                    "purpose": "Micronutrient Supplementation",
                    "caution": "Take with breakfast",
                    "active": True
                },
                {
                    "id": "med_al_3",
                    "name": "Coldrain All In 1",
                    "dosage": "1 Capsule",
                    "time": "12:30 PM",
                    "timing": "Afternoon",
                    "food_instruction": "After lunch with warm water",
                    "purpose": "Decongestant and Seasonal Relief",
                    "caution": "Do not exceed prescribed frequency",
                    "active": True
                },
                {
                    "id": "med_al_4",
                    "name": "Neuherbs T",
                    "dosage": "2 Capsules",
                    "time": "01:00 PM",
                    "timing": "Afternoon",
                    "food_instruction": "With fruit snack",
                    "purpose": "Antioxidant Support",
                    "caution": "Consume with adequate fluid",
                    "active": True
                },
                {
                    "id": "med_al_5",
                    "name": "Centrum Complete",
                    "dosage": "1 Capsule",
                    "time": "10:30 PM",
                    "timing": "Night",
                    "food_instruction": "At bedtime with water",
                    "purpose": "Multivitamin Mineral Support",
                    "caution": "Take consistently at bedtime",
                    "active": True
                }
            ],
            "logs": {}
        }
    ]
}


class FamilyVault:
    def __init__(self, filepath: str = DATA_FILE):
        self.filepath = filepath
        self.data = self._load()
        self.vitals = self._load_vitals_from_csv()
        self._init_historical_logs()

    def _load(self) -> Dict[str, Any]:
        default_credentials = {
            "mother": ("sunita", "sunita123", "Sunita", "Sharma"),
            "father": ("rajesh", "rajesh123", "Rajesh", "Sharma"),
            "grandfather": ("ramesh", "ramesh123", "Ramesh", "Sharma"),
            "grandmother": ("kamla", "kamla123", "Kamla", "Sharma"),
            "daughter": ("alina", "alina123", "Alina", "Sharma")
        }
        if os.path.exists(self.filepath):
            try:
                with open(self.filepath, "r", encoding="utf-8") as f:
                    vault_data = json.load(f)
                    profiles = vault_data.get("profiles", [])
                    if len(profiles) >= 5:
                        changed = False
                        for p in profiles:
                            pid = p.get("id", "")
                            if pid in default_credentials:
                                uname, pwd, fname, lname = default_credentials[pid]
                                if "username" not in p or p.get("username") == pid:
                                    p["username"] = uname
                                    changed = True
                                if "password" not in p:
                                    p["password"] = pwd
                                    changed = True
                                if "first_name" not in p:
                                    p["first_name"] = fname
                                    p["last_name"] = lname
                                    changed = True
                            else:
                                p.setdefault("username", pid)
                                p.setdefault("password", f"{pid}123")
                            p.setdefault("gender", "Female" if p.get("role") in ["Mother", "Grandmother", "Daughter"] else "Male")
                            p.setdefault("is_admin", p.get("id") == "mother")
                        if changed:
                            self._save_raw(vault_data)
                        return vault_data
            except Exception as exc:
                print(f"Error loading vault, falling back to default structure: {exc}")
        self._save_raw(DEFAULT_FAMILY_DATA)
        return DEFAULT_FAMILY_DATA

    def _save_raw(self, data: Dict[str, Any]):
        with open(self.filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

    def save(self):
        self._save_raw(self.data)

    def get_profiles(self) -> List[Dict[str, Any]]:
        return self.data.get("profiles", [])

    def get_profile(self, profile_id: str) -> Optional[Dict[str, Any]]:
        for p in self.get_profiles():
            if p["id"] == profile_id:
                return p
        return None

    def find_profile_by_identifier(self, identifier: str) -> Optional[Dict[str, Any]]:
        ident_clean = str(identifier).strip().lower()
        for p in self.get_profiles():
            if p["id"].lower() == ident_clean:
                return p
            if p.get("username", "").lower() == ident_clean:
                return p
            if p.get("name", "").lower() == ident_clean:
                return p
            if p.get("first_name", "").lower() == ident_clean:
                return p
        return None

    def register_new_member(self, member_data: Dict[str, Any]) -> Dict[str, Any]:
        username = member_data.get("username", "").strip().lower()
        if not username:
            username = member_data.get("first_name", "member").strip().lower().replace(" ", "_")
        
        # Check existing username
        existing = self.find_profile_by_identifier(username)
        if existing:
            username = f"{username}_{int(datetime.now().timestamp()) % 10000}"

        profile_id = username
        first_name = member_data.get("first_name", "").strip()
        last_name = member_data.get("last_name", "").strip()
        full_name = f"{first_name} {last_name}".strip() or member_data.get("name", "New Member")
        role = member_data.get("role", "Family Member")
        initials = (first_name[:1] + (last_name[:1] if last_name else role[:1])).upper()
        if not initials:
            initials = "FM"

        password = str(member_data.get("password", "")).strip() or "password123"

        colors = ["#4f46e5", "#0284c7", "#059669", "#7c3aed", "#d97706", "#2563eb"]
        chosen_color = colors[len(self.data["profiles"]) % len(colors)]

        new_profile = {
            "id": profile_id,
            "username": username,
            "password": password,
            "first_name": first_name,
            "last_name": last_name,
            "name": full_name,
            "role": role,
            "gender": member_data.get("gender", "Unspecified"),
            "initials": initials,
            "age": int(member_data.get("age", 30)),
            "weight": member_data.get("weight", "-"),
            "height": member_data.get("height", "-"),
            "blood_group": member_data.get("blood_group", "-"),
            "doctor": member_data.get("doctor", "Family Care Physician"),
            "is_admin": bool(member_data.get("is_admin", False)),
            "admin_id": "mother",
            "admin_name": "Sunita Sharma",
            "connected_to_admin": True,
            "badge_color": chosen_color,
            "notes": member_data.get("notes", "New registered family profile."),
            "medications": [],
            "logs": {}
        }

        self.data["profiles"].append(new_profile)
        self.save()
        return new_profile

    def complete_onboarding(self, profile_id: str, onboarding_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        profile = self.get_profile(profile_id)
        if not profile:
            return None
        if onboarding_data.get("weight"):
            profile["weight"] = onboarding_data["weight"].strip()
        if onboarding_data.get("height"):
            profile["height"] = onboarding_data["height"].strip()
        if onboarding_data.get("blood_group"):
            profile["blood_group"] = onboarding_data["blood_group"].strip()
        if onboarding_data.get("doctor"):
            profile["doctor"] = onboarding_data["doctor"].strip()
        if onboarding_data.get("notes"):
            profile["notes"] = onboarding_data["notes"].strip()
        if "is_admin" in onboarding_data:
            profile["is_admin"] = bool(onboarding_data["is_admin"])

        initial_med = onboarding_data.get("initial_medication")
        if initial_med and initial_med.get("name"):
            self.add_medication(profile_id, initial_med)

        self.save()
        return profile

    def update_profile_info(self, profile_id: str, age: int, weight: str, height: str, blood_group: str, notes: str) -> Optional[Dict[str, Any]]:
        profile = self.get_profile(profile_id)
        if not profile:
            return None
        profile["age"] = age
        profile["weight"] = weight
        profile["height"] = height
        profile["blood_group"] = blood_group
        profile["notes"] = notes
        self.save()
        return profile

    def verify_credentials(self, identifier: str, password: str) -> Optional[Dict[str, Any]]:
        profile = self.find_profile_by_identifier(identifier)
        if not profile:
            return None
        pwd_clean = str(password).strip()
        stored_pwd = str(profile.get("password", "")).strip()
        stored_pin = str(profile.get("pin", "")).strip()
        default_pwd = f"{profile.get('username', '')}123"

        if pwd_clean in [stored_pwd, stored_pin, default_pwd] or (not stored_pwd and pwd_clean == "1234"):
            return profile
        return None

    def get_today_str(self) -> str:
        return date.today().isoformat()

    def mark_taken(self, profile_id: str, med_id: str, taken_by: str = "Self") -> bool:
        profile = self.get_profile(profile_id)
        if not profile:
            return False

        today = self.get_today_str()
        if "logs" not in profile:
            profile["logs"] = {}
        if today not in profile["logs"]:
            profile["logs"][today] = {}

        now_time = datetime.now().strftime("%I:%M %p")
        profile["logs"][today][med_id] = {
            "taken": True,
            "timestamp": now_time,
            "taken_by": taken_by
        }
        self.save()
        return True

    def unmark_taken(self, profile_id: str, med_id: str) -> bool:
        profile = self.get_profile(profile_id)
        if not profile:
            return False

        today = self.get_today_str()
        if today in profile.get("logs", {}) and med_id in profile["logs"][today]:
            del profile["logs"][today][med_id]
            self.save()
            return True
        return False

    def calculate_today_adherence(self, profile_id: str) -> Dict[str, Any]:
        profile = self.get_profile(profile_id)
        if not profile:
            return {"total": 0, "taken": 0, "percentage": 0}

        active_meds = [m for m in profile.get("medications", []) if m.get("active", True)]
        total = len(active_meds)
        if total == 0:
            return {"total": 0, "taken": 0, "percentage": 100}

        today = self.get_today_str()
        today_logs = profile.get("logs", {}).get(today, {})
        taken = sum(1 for m in active_meds if m["id"] in today_logs and today_logs[m["id"]].get("taken"))
        pct = int((taken / total) * 100)
        return {
            "total": total,
            "taken": taken,
            "percentage": pct
        }

    def add_medication(self, profile_id: str, med_data: Dict[str, Any]) -> bool:
        profile = self.get_profile(profile_id)
        if not profile:
            return False

        med_id = f"med_{profile_id}_{int(datetime.now().timestamp())}_{len(profile.get('medications', []))}"
        med_entry = {
            "id": med_id,
            "name": med_data.get("name", "Prescribed Item"),
            "dosage": med_data.get("dosage", "1 Unit"),
            "time": med_data.get("time", "08:00 AM"),
            "timing": med_data.get("timing", "Morning"),
            "food_instruction": med_data.get("food_instruction", "Take with water"),
            "purpose": med_data.get("purpose", "Prescribed Clinical Regimen"),
            "caution": med_data.get("caution", "Consult physician if unusual symptoms emerge"),
            "active": True
        }
        profile["medications"].append(med_entry)
        self.save()
        return True

    def delete_medication(self, profile_id: str, med_id: str) -> bool:
        profile = self.get_profile(profile_id)
        if not profile:
            return False
        profile["medications"] = [m for m in profile.get("medications", []) if m["id"] != med_id]
        self.save()
        return True

    def get_all_family_overview(self) -> List[Dict[str, Any]]:
        today = self.get_today_str()
        overview = []
        for p in self.get_profiles():
            adh = self.calculate_today_adherence(p["id"])
            p_logs = p.get("logs", {}).get(today, {})

            meds_with_status = []
            for m in p.get("medications", []):
                if m.get("active", True):
                    taken_info = p_logs.get(m["id"])
                    meds_with_status.append({
                        **m,
                        "is_taken": taken_info is not None,
                        "timestamp": taken_info["timestamp"] if taken_info else None
                    })

            overview.append({
                "id": p["id"],
                "username": p.get("username", p["id"]),
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
                "admin_id": "mother",
                "admin_name": "Sunita Sharma",
                "connected_to_admin": True,
                "notes": p.get("notes", ""),
                "badge_color": p.get("badge_color", "#0284c7"),
                "adherence": adh,
                "medications": meds_with_status
            })
        return overview

    def _init_historical_logs(self):
        dates = ["2026-10-01", "2026-10-02", "2026-10-03", "2026-10-04", "2026-10-05"]
        changed = False
        for p in self.get_profiles():
            logs = p.setdefault("logs", {})
            meds = p.get("medications", [])
            for d in dates:
                if d not in logs:
                    logs[d] = {}
                    changed = True
                    for m in meds:
                        is_missed = False
                        if p["id"] == "mother" and d == "2026-10-02" and m["id"] == "med_mo_2":
                            is_missed = True
                        elif p["id"] == "father" and d == "2026-10-03" and m["id"] == "med_fa_4":
                            is_missed = True
                        elif p["id"] == "grandfather" and d == "2026-10-04" and m["id"] == "med_gf_3":
                            is_missed = True
                        
                        if not is_missed:
                            logs[d][m["id"]] = {
                                "taken": True,
                                "timestamp": m.get("time", "08:00 AM"),
                                "taken_by": "Self"
                            }
        if changed:
            self.save()

    def _load_vitals_from_csv(self) -> List[Dict[str, Any]]:
        vitals = []
        if os.path.exists(VITALS_CSV_FILE):
            try:
                with open(VITALS_CSV_FILE, "r", encoding="utf-8") as f:
                    reader = csv.DictReader(f)
                    idx = 1
                    for row in reader:
                        m_type = "bp" if "pressure" in row.get("Measurement Type", "").lower() else "sugar"
                        prim = row.get("Primary Reading", "").strip()
                        sec = row.get("Secondary Reading", "").strip()
                        pulse = row.get("Pulse BPM", "").strip()
                        
                        m_name = row.get("Member Name", "").strip()
                        prof = self.find_profile_by_identifier(m_name)
                        p_id = prof["id"] if prof else "mother"

                        entry = {
                            "id": f"vital_{idx}",
                            "profile_id": p_id,
                            "member_name": m_name,
                            "role": row.get("Role", prof.get("role", "Family Member") if prof else "Family Member"),
                            "measurement_type": m_type,
                            "systolic": int(prim) if m_type == "bp" and prim.isdigit() else None,
                            "diastolic": int(sec) if m_type == "bp" and sec.isdigit() else None,
                            "pulse": int(pulse) if pulse.isdigit() else 72,
                            "sugar_value": float(prim) if m_type == "sugar" and prim else None,
                            "sugar_context": row.get("Context Timing", "Fasting"),
                            "unit": row.get("Unit", "mmHg" if m_type == "bp" else "mg/dL"),
                            "date": row.get("Date", self.get_today_str()),
                            "time": row.get("Time", "08:00 AM"),
                            "category_status": row.get("Category Status", "Normal"),
                            "notes": row.get("Clinical Notes", "")
                        }
                        vitals.append(entry)
                        idx += 1
            except Exception as e:
                print(f"Error loading vitals from CSV: {e}")
        return vitals

    def _save_vitals_to_csv(self):
        try:
            os.makedirs(os.path.dirname(VITALS_CSV_FILE), exist_ok=True)
            fieldnames = [
                "Date", "Time", "Member Name", "Role", "Measurement Type",
                "Primary Reading", "Secondary Reading", "Pulse BPM", "Unit",
                "Context Timing", "Category Status", "Clinical Notes"
            ]
            with open(VITALS_CSV_FILE, "w", encoding="utf-8", newline="") as f:
                writer = csv.DictWriter(f, fieldnames=fieldnames)
                writer.writeheader()
                for v in self.vitals:
                    prim = v.get("systolic") if v.get("measurement_type") == "bp" else v.get("sugar_value")
                    sec = v.get("diastolic") if v.get("measurement_type") == "bp" else ""
                    m_type_str = "Blood Pressure" if v.get("measurement_type") == "bp" else "Blood Sugar"
                    writer.writerow({
                        "Date": v.get("date", ""),
                        "Time": v.get("time", ""),
                        "Member Name": v.get("member_name", ""),
                        "Role": v.get("role", ""),
                        "Measurement Type": m_type_str,
                        "Primary Reading": prim if prim is not None else "",
                        "Secondary Reading": sec if sec is not None else "",
                        "Pulse BPM": v.get("pulse", 0) if v.get("measurement_type") == "bp" else 0,
                        "Unit": v.get("unit", "mmHg" if v.get("measurement_type") == "bp" else "mg/dL"),
                        "Context Timing": v.get("sugar_context", "Morning Rest" if v.get("measurement_type") == "bp" else "Fasting"),
                        "Category Status": v.get("category_status", "Normal"),
                        "Clinical Notes": v.get("notes", "")
                    })
        except Exception as e:
            print(f"Error writing vitals to CSV: {e}")

    def get_vitals(self, profile_id: Optional[str] = None) -> List[Dict[str, Any]]:
        if not hasattr(self, "vitals") or not self.vitals:
            self.vitals = self._load_vitals_from_csv()
        if not profile_id or profile_id == "all":
            return list(reversed(self.vitals))
        return list(reversed([v for v in self.vitals if v.get("profile_id") == profile_id]))

    def add_vital(self, data: Dict[str, Any]) -> Dict[str, Any]:
        if not hasattr(self, "vitals"):
            self.vitals = self._load_vitals_from_csv()

        profile_id = data.get("profile_id", "mother")
        prof = self.get_profile(profile_id)
        member_name = prof["name"] if prof else profile_id
        role = prof["role"] if prof else "Family Member"

        m_type = data.get("measurement_type", "bp").lower()
        now = datetime.now()
        date_str = data.get("date") or now.strftime("%Y-%m-%d")
        time_str = data.get("time") or now.strftime("%I:%M %p")

        systolic = None
        diastolic = None
        pulse = None
        sugar_val = None
        sugar_context = data.get("sugar_context", "Fasting")
        cat_status = "Normal"

        if m_type == "bp":
            systolic = int(data.get("systolic", 120))
            diastolic = int(data.get("diastolic", 80))
            pulse = int(data.get("pulse", 72)) if data.get("pulse") else 72
            if systolic < 120 and diastolic < 80:
                cat_status = "Normal"
            elif systolic <= 129 and diastolic < 80:
                cat_status = "Elevated"
            elif systolic <= 139 or diastolic <= 89:
                cat_status = "Stage 1 Hypertension"
            else:
                cat_status = "Stage 2 Hypertension"
        else:
            sugar_val = float(data.get("sugar_value", 100))
            if sugar_context == "Fasting":
                if sugar_val < 100:
                    cat_status = "Normal"
                elif sugar_val <= 125:
                    cat_status = "Pre-Diabetes (Mild)"
                else:
                    cat_status = "Elevated"
            elif sugar_context == "Post-prandial":
                if sugar_val < 140:
                    cat_status = "Normal"
                elif sugar_val <= 199:
                    cat_status = "Pre-Diabetes (Elevated)"
                else:
                    cat_status = "High"
            else:
                cat_status = "Normal" if sugar_val < 140 else "Elevated"

        new_entry = {
            "id": f"vital_{int(now.timestamp())}_{len(self.vitals) + 1}",
            "profile_id": profile_id,
            "member_name": member_name,
            "role": role,
            "measurement_type": m_type,
            "systolic": systolic,
            "diastolic": diastolic,
            "pulse": pulse,
            "sugar_value": sugar_val,
            "sugar_context": sugar_context if m_type == "sugar" else "Morning Rest",
            "unit": "mmHg" if m_type == "bp" else "mg/dL",
            "date": date_str,
            "time": time_str,
            "category_status": cat_status,
            "notes": data.get("notes", "")
        }

        self.vitals.append(new_entry)
        self._save_vitals_to_csv()
        return new_entry

    def delete_vital(self, vital_id: str) -> bool:
        if not hasattr(self, "vitals"):
            self.vitals = self._load_vitals_from_csv()
        init_len = len(self.vitals)
        self.vitals = [v for v in self.vitals if v.get("id") != vital_id]
        if len(self.vitals) < init_len:
            self._save_vitals_to_csv()
            return True
        return False

    def compute_vital_stats(self, profile_id: Optional[str] = None) -> Dict[str, Any]:
        all_v = self.get_vitals(profile_id)
        bp_list = [v for v in all_v if v.get("measurement_type") == "bp" and v.get("systolic") is not None]
        sugar_list = [v for v in all_v if v.get("measurement_type") == "sugar" and v.get("sugar_value") is not None]

        bp_stats = {
            "highest_bp": "0/0",
            "highest_systolic": 0,
            "highest_diastolic": 0,
            "highest_date": "-",
            "lowest_bp": "0/0",
            "lowest_systolic": 0,
            "lowest_diastolic": 0,
            "lowest_date": "-",
            "mean_systolic": 0,
            "mean_diastolic": 0,
            "mean_bp": "0/0",
            "mean_pulse": 0,
            "count": len(bp_list)
        }

        if bp_list:
            sorted_by_sys = sorted(bp_list, key=lambda x: x["systolic"])
            lowest_item = sorted_by_sys[0]
            highest_item = sorted_by_sys[-1]

            mean_sys = round(sum(x["systolic"] for x in bp_list) / len(bp_list), 1)
            mean_dia = round(sum(x["diastolic"] for x in bp_list) / len(bp_list), 1)
            mean_pulse = round(sum(x.get("pulse", 72) for x in bp_list) / len(bp_list), 1)

            bp_stats = {
                "highest_bp": f"{highest_item['systolic']}/{highest_item['diastolic']}",
                "highest_systolic": highest_item["systolic"],
                "highest_diastolic": highest_item["diastolic"],
                "highest_date": f"{highest_item['date']} {highest_item.get('time', '')}".strip(),
                "highest_member": highest_item.get("member_name", ""),
                "lowest_bp": f"{lowest_item['systolic']}/{lowest_item['diastolic']}",
                "lowest_systolic": lowest_item["systolic"],
                "lowest_diastolic": lowest_item["diastolic"],
                "lowest_date": f"{lowest_item['date']} {lowest_item.get('time', '')}".strip(),
                "lowest_member": lowest_item.get("member_name", ""),
                "mean_systolic": mean_sys,
                "mean_diastolic": mean_dia,
                "mean_bp": f"{int(mean_sys)}/{int(mean_dia)}",
                "mean_pulse": int(mean_pulse),
                "count": len(bp_list)
            }

        sugar_stats = {
            "highest_sugar": 0,
            "highest_date": "-",
            "highest_context": "-",
            "lowest_sugar": 0,
            "lowest_date": "-",
            "lowest_context": "-",
            "mean_sugar": 0,
            "count": len(sugar_list)
        }

        if sugar_list:
            sorted_sugar = sorted(sugar_list, key=lambda x: x["sugar_value"])
            lowest_sugar = sorted_sugar[0]
            highest_sugar = sorted_sugar[-1]

            mean_s = round(sum(x["sugar_value"] for x in sugar_list) / len(sugar_list), 1)

            sugar_stats = {
                "highest_sugar": highest_sugar["sugar_value"],
                "highest_date": f"{highest_sugar['date']} {highest_sugar.get('time', '')}".strip(),
                "highest_context": highest_sugar.get("sugar_context", "Fasting"),
                "highest_member": highest_sugar.get("member_name", ""),
                "lowest_sugar": lowest_sugar["sugar_value"],
                "lowest_date": f"{lowest_sugar['date']} {lowest_sugar.get('time', '')}".strip(),
                "lowest_context": lowest_sugar.get("sugar_context", "Fasting"),
                "lowest_member": lowest_sugar.get("member_name", ""),
                "mean_sugar": mean_s,
                "count": len(sugar_list)
            }

        return {
            "bp": bp_stats,
            "sugar": sugar_stats,
            "total_records": len(all_v)
        }

    def get_calendar_adherence(self, month: Optional[str] = None) -> Dict[str, Any]:
        target_month = month or "2026-10"
        days_data = []
        profiles = self.get_profiles()
        
        total_month_taken = 0
        total_month_scheduled = 0

        day_names = ["Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed"]

        for d in range(1, 32):
            day_str = f"{d:02d}"
            date_str = f"{target_month}-{day_str}"
            day_name = day_names[(d - 1) % 7]

            day_taken = 0
            day_total = 0
            day_missed = 0
            member_details = []

            is_past_or_today = (d <= 5)

            for p in profiles:
                active_meds = [m for m in p.get("medications", []) if m.get("active", True)]
                p_total = len(active_meds)
                day_total += p_total

                p_logs = p.get("logs", {}).get(date_str, {})
                p_taken = sum(1 for m in active_meds if m["id"] in p_logs and p_logs[m["id"]].get("taken"))
                p_missed = p_total - p_taken if is_past_or_today else 0

                day_taken += p_taken
                day_missed += p_missed

                member_details.append({
                    "id": p["id"],
                    "name": p["name"],
                    "role": p["role"],
                    "total": p_total,
                    "taken": p_taken,
                    "missed": p_missed,
                    "status": "completed" if p_missed == 0 and is_past_or_today else ("missed" if is_past_or_today else "scheduled")
                })

            if is_past_or_today:
                total_month_taken += day_taken
                total_month_scheduled += day_total

            status_flag = "future"
            if is_past_or_today:
                status_flag = "perfect" if day_missed == 0 else "missed"

            days_data.append({
                "day_number": d,
                "date": date_str,
                "day_name": day_name,
                "total_scheduled": day_total,
                "taken_count": day_taken,
                "missed_count": day_missed,
                "status": status_flag,
                "is_today": (d == 5),
                "is_past": (d < 5),
                "is_future": (d > 5),
                "members": member_details
            })

        adherence_rate = int((total_month_taken / total_month_scheduled) * 100) if total_month_scheduled > 0 else 96

        return {
            "month_label": "October 2026",
            "days": days_data,
            "summary": {
                "total_taken": total_month_taken,
                "total_missed": sum(x["missed_count"] for x in days_data if x["is_past"] or x["is_today"]),
                "adherence_rate": adherence_rate,
                "days_tracked": 5
            }
        }
