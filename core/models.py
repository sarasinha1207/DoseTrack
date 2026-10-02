"""
Family Data Layer for DoseGuard AI.
Persists profiles, medication regimens, and daily confirmation logs in a local JSON vault.
Strictly free of emojis. Clean professional medical data structure.
"""

import json
import os
from datetime import datetime, date
from typing import Dict, List, Any, Optional

DATA_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "family_health_vault.json")

DEFAULT_FAMILY_DATA = {
    "profiles": [
        {
            "id": "mother",
            "name": "Sunita",
            "role": "Mother",
            "initials": "MO",
            "age": 54,
            "badge_color": "#0284c7",
            "notes": "Primary Hypothyroidism and mild Osteopenia. Maintain 4-hour gap between thyroid medication and calcium.",
            "medications": [
                {
                    "id": "med_mo_1",
                    "name": "Levothyroxine Sodium",
                    "dosage": "50 mcg",
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
            "name": "Rajesh",
            "role": "Father",
            "initials": "FA",
            "age": 59,
            "badge_color": "#2563eb",
            "notes": "Essential Hypertension and Type 2 Diabetes. Routine blood pressure and fasting glucose monitoring required.",
            "medications": [
                {
                    "id": "med_fa_1",
                    "name": "Telmisartan",
                    "dosage": "40 mg",
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
            "name": "Ramesh",
            "role": "Grandfather",
            "initials": "GF",
            "age": 82,
            "badge_color": "#0d9488",
            "notes": "Geriatric care protocol. Requires clear schedule, assistance with ambulation, and warm fluids with doses.",
            "medications": [
                {
                    "id": "med_gf_1",
                    "name": "Amlodipine Besylate",
                    "dosage": "5 mg",
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
            "name": "Kamla",
            "role": "Grandmother",
            "initials": "GM",
            "age": 78,
            "badge_color": "#d97706",
            "notes": "Peripheral joint stiffness and vitamin deficiency. Prefers mid-morning doses.",
            "medications": [
                {
                    "id": "med_gm_1",
                    "name": "Cholecalciferol + Calcium",
                    "dosage": "500 mg",
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
                    "timing": "Afternoon",
                    "food_instruction": "After midday lunch with water",
                    "purpose": "Neuropathy and Nerve Health",
                    "caution": "Take following food intake",
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
            except Exception as exc:
                print(f"Error loading vault, falling back to default structure: {exc}")
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

    def add_profile(self, name: str, role: str, age: int = 60, notes: str = "") -> Dict[str, Any]:
        profile_id = role.lower().replace(" ", "_") + "_" + str(int(datetime.now().timestamp()))
        initials = (role[:2] if len(role) >= 2 else "FM").upper()
        new_profile = {
            "id": profile_id,
            "name": name,
            "role": role,
            "initials": initials,
            "age": age,
            "badge_color": "#0284c7",
            "notes": notes,
            "medications": [],
            "logs": {}
        }
        self.data["profiles"].append(new_profile)
        self.save()
        return new_profile

    def get_today_str(self) -> str:
        return date.today().isoformat()

    def mark_taken(self, profile_id: str, med_id: str, taken_by: str = "Family Caregiver") -> bool:
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

        med_id = f"med_{profile_id}_{int(datetime.now().timestamp())}_{len(profile.get('medications', []))}"
        med_entry = {
            "id": med_id,
            "name": med_data.get("name", "Prescribed Item"),
            "dosage": med_data.get("dosage", "1 Unit"),
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

    def get_family_caregiver_summary(self) -> List[Dict[str, Any]]:
        summary = []
        for p in self.get_profiles():
            adh = self.calculate_today_adherence(p["id"])
            summary.append({
                "id": p["id"],
                "name": p["name"],
                "role": p["role"],
                "initials": p.get("initials", p["role"][:2].upper()),
                "total": adh["total"],
                "taken": adh["taken"],
                "percentage": adh["percentage"],
                "status": "Completed" if adh["taken"] == adh["total"] and adh["total"] > 0 else (
                    f"{adh['taken']}/{adh['total']} Taken" if adh["total"] > 0 else "No Medications"
                )
            })
        return summary
