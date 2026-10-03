"""
Family Data Layer for DoseGuard AI.
Stores 5 family members, personal PIN credentials, medication schedules, and daily intake logs.
Enables personal member dashboards and family-wide cross-visibility.
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
            "pin": "1111",
            "age": 54,
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
            "name": "Rajesh",
            "role": "Father",
            "initials": "FA",
            "pin": "2222",
            "age": 59,
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
            "name": "Ramesh",
            "role": "Grandfather",
            "initials": "GF",
            "pin": "3333",
            "age": 82,
            "badge_color": "#0d9488",
            "notes": "Geriatric care protocol. Requires clear schedule, assistance with ambulation, and warm fluids with doses.",
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
            "name": "Kamla",
            "role": "Grandmother",
            "initials": "GM",
            "pin": "4444",
            "age": 78,
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
            "name": "Alina",
            "role": "Daughter",
            "initials": "AL",
            "pin": "5555",
            "age": 24,
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

    def _load(self) -> Dict[str, Any]:
        if os.path.exists(self.filepath):
            try:
                with open(self.filepath, "r", encoding="utf-8") as f:
                    vault_data = json.load(f)
                    # Verify 5 members exist
                    profiles = vault_data.get("profiles", [])
                    if len(profiles) >= 5:
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

    def verify_pin(self, profile_id: str, pin: str) -> bool:
        profile = self.get_profile(profile_id)
        if not profile:
            return False
        stored_pin = str(profile.get("pin", "1234")).strip()
        return stored_pin == str(pin).strip()

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
        """
        Returns full overview of all 5 family members, their active medications,
        cautions, and today's status for the cross-family transparency page.
        """
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
                "name": p["name"],
                "role": p["role"],
                "initials": p.get("initials", p["role"][:2].upper()),
                "age": p.get("age", 50),
                "notes": p.get("notes", ""),
                "badge_color": p.get("badge_color", "#0284c7"),
                "adherence": adh,
                "medications": meds_with_status
            })
        return overview
