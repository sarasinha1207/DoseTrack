"""
Family Data Models and Persistence for DoseGuard AI.
Stores all profiles, medication schedules, and daily intake logs locally in JSON.
100% private, zero cloud telemetry.
"""

import json
import os
from datetime import datetime, date
from typing import Dict, List, Any, Optional

DATA_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "family_health_vault.json")

DEFAULT_FAMILY_DATA = {
    "profiles": [
        {
            "id": "mom",
            "name": "Mom (Sunita)",
            "role": "Mother",
            "avatar": "👩",
            "age": 54,
            "badge_color": "#FF758C",
            "notes": "Hypothyroidism & Mild Osteopenia. Keep thyroid and calcium 4 hrs apart.",
            "medications": [
                {
                    "id": "mom_med_1",
                    "name": "Levothyroxine Sodium",
                    "dosage": "50 mcg",
                    "timing": "Morning",
                    "food_instruction": "Empty stomach with water (wait 45 mins before tea/breakfast)",
                    "purpose": "Thyroid hormone support",
                    "caution": "Do not take at the same time as calcium",
                    "active": True
                },
                {
                    "id": "mom_med_2",
                    "name": "Shelcal 500 (Calcium + D3)",
                    "dosage": "500 mg",
                    "timing": "Afternoon",
                    "food_instruction": "After lunch with a full glass of water",
                    "purpose": "Bone density & joint support",
                    "caution": "Do not skip lunch when taking",
                    "active": True
                },
                {
                    "id": "mom_med_3",
                    "name": "Multivitamin + Omega 3",
                    "dosage": "1 Capsule",
                    "timing": "Night",
                    "food_instruction": "With or right after dinner",
                    "purpose": "General vitality & heart health",
                    "caution": "Take with warm water",
                    "active": True
                }
            ],
            "logs": {}
        },
        {
            "id": "dad",
            "name": "Dad (Rajesh)",
            "role": "Father",
            "avatar": "👨",
            "age": 59,
            "badge_color": "#4E73DF",
            "notes": "Blood pressure and borderline blood sugar. Monitor BP weekly.",
            "medications": [
                {
                    "id": "dad_med_1",
                    "name": "Telmikind-40 (Telmisartan)",
                    "dosage": "40 mg",
                    "timing": "Morning",
                    "food_instruction": "After morning breakfast",
                    "purpose": "Blood pressure control",
                    "caution": "Do not skip even if feeling healthy",
                    "active": True
                },
                {
                    "id": "dad_med_2",
                    "name": "Glycomet-SR (Metformin)",
                    "dosage": "500 mg",
                    "timing": "Morning",
                    "food_instruction": "With breakfast",
                    "purpose": "Blood sugar regulation",
                    "caution": "Always take with food",
                    "active": True
                },
                {
                    "id": "dad_med_3",
                    "name": "Glycomet-SR (Metformin)",
                    "dosage": "500 mg",
                    "timing": "Night",
                    "food_instruction": "With dinner",
                    "purpose": "Blood sugar regulation",
                    "caution": "Always take with food",
                    "active": True
                },
                {
                    "id": "dad_med_4",
                    "name": "Atorva (Atorvastatin)",
                    "dosage": "10 mg",
                    "timing": "Night",
                    "food_instruction": "Bedtime with water",
                    "purpose": "Cholesterol & lipid control",
                    "caution": "Avoid grapefruit or grapefruit juice",
                    "active": True
                }
            ],
            "logs": {}
        },
        {
            "id": "grandpa",
            "name": "Grandpa (Ramesh)",
            "role": "Grandfather",
            "avatar": "👴",
            "age": 82,
            "badge_color": "#1CC88A",
            "notes": "Gentle assistance required. Needs large font reminders & warm water.",
            "medications": [
                {
                    "id": "grandpa_med_1",
                    "name": "Amlodipine",
                    "dosage": "5 mg",
                    "timing": "Morning",
                    "food_instruction": "After breakfast around 8:30 AM",
                    "purpose": "Gentle blood pressure control",
                    "caution": "Help grandpa stand up slowly",
                    "active": True
                },
                {
                    "id": "grandpa_med_2",
                    "name": "Glucosamine Joint Support",
                    "dosage": "750 mg",
                    "timing": "Afternoon",
                    "food_instruction": "After lunch with warm water",
                    "purpose": "Knee flexibility & pain relief",
                    "caution": "Give with easy-to-swallow warm drink",
                    "active": True
                },
                {
                    "id": "grandpa_med_3",
                    "name": "Tears Naturale Eye Drops",
                    "dosage": "1 drop each eye",
                    "timing": "Night",
                    "food_instruction": "Directly into eyes before sleep",
                    "purpose": "Soothe cataract dryness & irritation",
                    "caution": "Clean hands before administering",
                    "active": True
                },
                {
                    "id": "grandpa_med_4",
                    "name": "Melatonin (Low Dose)",
                    "dosage": "3 mg",
                    "timing": "Night",
                    "food_instruction": "30 mins before sleep with warm milk",
                    "purpose": "Restful sleep cycle",
                    "caution": "Ensure dim bedroom lights",
                    "active": True
                }
            ],
            "logs": {}
        },
        {
            "id": "grandma",
            "name": "Grandma (Kamla)",
            "role": "Grandmother",
            "avatar": "👵",
            "age": 78,
            "badge_color": "#F6C23E",
            "notes": "Arthritis and digestive care. Prefers natural herbal teas alongside meds.",
            "medications": [
                {
                    "id": "grandma_med_1",
                    "name": "Vitamin D3 + Calcium Cholecalciferol",
                    "dosage": "60,000 IU (Weekly) / Daily 500mg",
                    "timing": "Morning",
                    "food_instruction": "After breakfast with milk",
                    "purpose": "Bone strength & back support",
                    "caution": "Take regularly with morning meal",
                    "active": True
                },
                {
                    "id": "grandma_med_2",
                    "name": "Neurobion Forte (B-Complex)",
                    "dosage": "1 Tablet",
                    "timing": "Afternoon",
                    "food_instruction": "After lunch with warm water",
                    "purpose": "Nerve health & tingling relief",
                    "caution": "Drink plenty of water",
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

    def _load(self) -> Dict[str, Any]:
        if os.path.exists(self.filepath):
            try:
                with open(self.filepath, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception as e:
                print(f"Error loading vault, resetting to defaults: {e}")
                return DEFAULT_FAMILY_DATA
        else:
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

    def add_profile(self, name: str, role: str, avatar: str = "👤", age: int = 60, notes: str = "") -> Dict[str, Any]:
        new_id = role.lower().replace(" ", "_") + "_" + str(int(datetime.now().timestamp()))
        new_profile = {
            "id": new_id,
            "name": f"{role} ({name})",
            "role": role,
            "avatar": avatar,
            "age": age,
            "badge_color": "#36B9CC",
            "notes": notes,
            "medications": [],
            "logs": {}
        }
        self.data["profiles"].append(new_profile)
        self.save()
        return new_profile

    def get_today_str(self) -> str:
        return date.today().isoformat()

    def mark_taken(self, profile_id: str, med_id: str, taken_by: str = "Caregiver") -> bool:
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

    def is_med_taken_today(self, profile_id: str, med_id: str) -> Optional[Dict[str, Any]]:
        profile = self.get_profile(profile_id)
        if not profile:
            return None
        today = self.get_today_str()
        today_logs = profile.get("logs", {}).get(today, {})
        return today_logs.get(med_id, None)

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
        
        med_id = f"{profile_id}_med_{int(datetime.now().timestamp())}_{len(profile.get('medications', []))}"
        med_entry = {
            "id": med_id,
            "name": med_data.get("name", "Unknown Medicine"),
            "dosage": med_data.get("dosage", "As prescribed"),
            "timing": med_data.get("timing", "Morning"),
            "food_instruction": med_data.get("food_instruction", "With water"),
            "purpose": med_data.get("purpose", "Prescribed treatment"),
            "caution": med_data.get("caution", "Consult doctor if unusual symptoms occur"),
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

    def get_family_caregiver_summary(self) -> List[Dict[str, Any]]:
        summary = []
        for p in self.get_profiles():
            adh = self.calculate_today_adherence(p["id"])
            summary.append({
                "id": p["id"],
                "name": p["name"],
                "role": p["role"],
                "avatar": p["avatar"],
                "total": adh["total"],
                "taken": adh["taken"],
                "percentage": adh["percentage"],
                "status": "All Done ✅" if adh["taken"] == adh["total"] and adh["total"] > 0 else (
                    f"{adh['taken']}/{adh['total']} Taken" if adh["total"] > 0 else "No Meds"
                )
            })
        return summary
