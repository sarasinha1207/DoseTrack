"""
Sample Prescriptions and Medical Bills for DoseGuard AI Family Edition.
These samples allow the user and judges to test the AI prescription parser instantly,
even without real paper bills or physical prescriptions on hand.
"""

SAMPLE_PRESCRIPTIONS = {
    "mom_thyroid": {
        "title": "👩 Mom's Prescription — Thyroid & Bone Health",
        "description": "Dr. Sharma's Endocrine & Wellness Clinic (Prescription Note)",
        "source_type": "Doctor's Prescription Note",
        "raw_text": """
DR. SHARMA'S ENDOCRINE & WELLNESS CLINIC
Patient: Mrs. Sunita (Age: 54)
Date: 12-OCT-2026
Diagnosis: Hypothyroidism, Mild Osteopenia

Rx:
1. Levothyroxine Sodium 50 mcg
   - Sig: 1 tablet daily every morning on an EMPTY stomach with a glass of water.
   - Note: Wait at least 45-60 minutes before having tea, coffee, or breakfast.

2. Shelcal 500 (Calcium + Vitamin D3)
   - Sig: 1 tablet daily in the afternoon, strictly AFTER lunch.
   - Note: Do NOT take at the same time as thyroid tablet (keep at least 4-hour gap).

3. Multivitamin + Omega 3
   - Sig: 1 capsule daily with dinner at night.

Next review: 3 months with repeat TSH & Serum Calcium.
        """.strip(),
        "parsed_items": [
            {
                "name": "Levothyroxine Sodium",
                "dosage": "50 mcg",
                "timing": "Morning",
                "food_instruction": "Empty stomach (45 mins before breakfast or tea)",
                "purpose": "Thyroid hormone balance",
                "caution": "Keep 4 hours apart from calcium supplements"
            },
            {
                "name": "Shelcal 500 (Calcium + D3)",
                "dosage": "500 mg",
                "timing": "Afternoon",
                "food_instruction": "After lunch with water",
                "purpose": "Bone density & joint support",
                "caution": "Do not take with morning thyroid pill"
            },
            {
                "name": "Multivitamin + Omega 3",
                "dosage": "1 Capsule",
                "timing": "Night",
                "food_instruction": "With dinner",
                "purpose": "General vitality & heart health",
                "caution": "Take with a light meal for best absorption"
            }
        ]
    },
    "dad_cardio": {
        "title": "👨 Dad's Pharmacy Bill & Prescription — Cardio & Diabetes",
        "description": "Apollo Health Pharmacy Receipt #49281",
        "source_type": "Pharmacy Cash Bill & Discharge Summary",
        "raw_text": """
APOLLO PHARMACY & HEALTHCARE
Tax Invoice / Receipt: #APH-2026-98124
Customer: Mr. Rajesh (Age: 59)
Doctor: Dr. K. Mehta (Cardiology)

Items Billed:
1. TELMIKIND-40 (Telmisartan 40mg) - Qty: 30 Tablets
   Usage: 1 Tab in the MORNING after light breakfast for Blood Pressure.

2. GLYCOMET-SR 500mg (Metformin Hydrochloride Extended Release) - Qty: 60 Tablets
   Usage: 1 Tab TWICE daily with meals (1 Morning with Breakfast, 1 Night with Dinner).

3. ATORVA 10mg (Atorvastatin) - Qty: 30 Tablets
   Usage: 1 Tab at BEDTIME / NIGHT for cholesterol management.
   Caution: Avoid grapefruit or grapefruit juice.

Total Paid: $42.50 | Pharmacist: Verified & Dispensed
        """.strip(),
        "parsed_items": [
            {
                "name": "Telmikind-40 (Telmisartan)",
                "dosage": "40 mg",
                "timing": "Morning",
                "food_instruction": "After light breakfast",
                "purpose": "Blood pressure management",
                "caution": "Check BP regularly; do not skip"
            },
            {
                "name": "Glycomet-SR (Metformin)",
                "dosage": "500 mg",
                "timing": "Morning",
                "food_instruction": "With breakfast",
                "purpose": "Blood sugar regulation",
                "caution": "Take with meal to avoid stomach upset"
            },
            {
                "name": "Glycomet-SR (Metformin)",
                "dosage": "500 mg",
                "timing": "Night",
                "food_instruction": "With dinner",
                "purpose": "Blood sugar regulation",
                "caution": "Take with meal to avoid stomach upset"
            },
            {
                "name": "Atorva (Atorvastatin)",
                "dosage": "10 mg",
                "timing": "Night",
                "food_instruction": "At bedtime with water",
                "purpose": "Cholesterol & lipid control",
                "caution": "Avoid grapefruit products"
            }
        ]
    },
    "grandpa_care": {
        "title": "👴 Grandpa's Care Routine — Arthritis & Eye Health",
        "description": "Senior Geriatric Care Consultation Summary",
        "source_type": "Geriatric Specialist Advice Sheet",
        "raw_text": """
DR. VERMA'S SENIOR CARE & GERIATRIC WELLNESS
Patient: Grandpa Ramesh (Age: 82)
Caregiver: Family Assist

Daily Medication Protocol:
1. Amlodipine 5mg
   - Time: MORNING 8:00 AM after breakfast.
   - Purpose: Blood pressure control.

2. Glucosamine Sulfate 750mg + Chondroitin
   - Time: AFTERNOON 1:30 PM with warm water after lunch.
   - Purpose: Knee joint flexibility and pain relief.

3. Tears Naturale Lubricant Eye Drops
   - Time: 3 times a day (Morning, Afternoon, Night).
   - Instructions: 1 drop in each eye to prevent dryness and cataract irritation.

4. Melatonin 3mg (Low dose)
   - Time: NIGHT 30 minutes before sleep.
   - Purpose: Regulate sleep cycle.
        """.strip(),
        "parsed_items": [
            {
                "name": "Amlodipine",
                "dosage": "5 mg",
                "timing": "Morning",
                "food_instruction": "After breakfast with water",
                "purpose": "Blood pressure control",
                "caution": "Assist grandpa with standing up slowly"
            },
            {
                "name": "Glucosamine + Chondroitin",
                "dosage": "750 mg",
                "timing": "Afternoon",
                "food_instruction": "After lunch with warm water",
                "purpose": "Knee joint relief & mobility",
                "caution": "Take consistently with food"
            },
            {
                "name": "Tears Naturale Eye Drops",
                "dosage": "1 drop each eye",
                "timing": "Morning",
                "food_instruction": "External use (Eyes)",
                "purpose": "Prevent dry eyes & irritation",
                "caution": "Ensure clean hands before administering"
            },
            {
                "name": "Tears Naturale Eye Drops",
                "dosage": "1 drop each eye",
                "timing": "Night",
                "food_instruction": "External use (Eyes)",
                "purpose": "Prevent dry eyes & irritation",
                "caution": "Administer 10 mins before bed"
            },
            {
                "name": "Melatonin",
                "dosage": "3 mg",
                "timing": "Night",
                "food_instruction": "30 mins before sleep with warm milk or water",
                "purpose": "Gentle sleep aid",
                "caution": "Dim bedroom lights after taking"
            }
        ]
    }
}
