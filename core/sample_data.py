"""
Sample Prescriptions and Pharmacy Invoices for DoseGuard AI.
Provides realistic clinical records for immediate demonstration without physical documents.
Zero emojis used throughout.
"""

SAMPLE_PRESCRIPTIONS = {
    "mom_thyroid": {
        "id": "mom_thyroid",
        "title": "Mother - Clinical Prescription for Thyroid and Bone Care",
        "subtitle": "Apex Endocrine Consultation Summary",
        "patient": "Sunita (Mother, Age 54)",
        "source_type": "Outpatient Prescription Slip",
        "raw_text": """
APEX ENDOCRINE & METABOLIC CARE CENTER
Patient: Sunita (Age: 54)
Consultant: Dr. R. Sharma, MD (Endocrinology)
Date: 12-October-2026
Diagnosis: Primary Hypothyroidism, Osteopenia

Prescribed Regimen:
1. Levothyroxine Sodium 50 mcg
   - Usage: 1 tablet daily every morning on an EMPTY stomach with plain water.
   - Clinical Instruction: Wait at least 45 to 60 minutes before morning tea, coffee, or breakfast.

2. Shelcal 500 (Calcium Carbonate 500mg + Vitamin D3 250 IU)
   - Usage: 1 tablet daily in the afternoon, strictly AFTER lunch.
   - Clinical Instruction: Maintain a minimum 4-hour interval from morning thyroid hormone.

3. Omega-3 Fish Oil 1000 mg
   - Usage: 1 softgel daily with dinner at night.

Next Review: 90 days with repeat serum TSH and Calcium levels.
        """.strip(),
        "parsed_items": [
            {
                "name": "Levothyroxine Sodium",
                "dosage": "50 mcg",
                "timing": "Morning",
                "food_instruction": "Empty stomach with plain water (wait 45-60 mins before breakfast or tea)",
                "purpose": "Thyroid Hormone Balance",
                "caution": "Keep at least 4 hours apart from calcium supplements"
            },
            {
                "name": "Shelcal 500 (Calcium + D3)",
                "dosage": "500 mg",
                "timing": "Afternoon",
                "food_instruction": "After lunch with a full glass of water",
                "purpose": "Bone Density and Joint Health",
                "caution": "Do not take at the same time as thyroid tablet"
            },
            {
                "name": "Omega-3 Fish Oil",
                "dosage": "1000 mg",
                "timing": "Night",
                "food_instruction": "With dinner meal",
                "purpose": "Cardiovascular and Lipid Support",
                "caution": "Take with meal for optimal absorption"
            }
        ]
    },
    "dad_cardio": {
        "id": "dad_cardio",
        "title": "Father - Pharmacy Bill and Cardiovascular Protocol",
        "subtitle": "Metro Health Pharmacy Receipt #89421",
        "patient": "Rajesh (Father, Age 59)",
        "source_type": "Pharmacy Dispensing Invoice",
        "raw_text": """
METRO HEALTH PHARMACEUTICALS & DISPENSARY
Invoice Number: MHP-2026-89421
Customer Name: Rajesh (Age: 59)
Attending Physician: Dr. K. Mehta (Cardiology)

Dispensed Medications:
1. Telmisartan 40 mg (Telma-40) - Quantity: 30 Tablets
   Usage: 1 tablet daily in the morning following breakfast for blood pressure regulation.

2. Metformin Hydrochloride Extended Release 500 mg (Glycomet-SR) - Quantity: 60 Tablets
   Usage: 1 tablet twice daily with meals (1 tablet with breakfast, 1 tablet with dinner).

3. Atorvastatin 10 mg (Atorva-10) - Quantity: 30 Tablets
   Usage: 1 tablet at night before bedtime for lipid management.
   Safety Precaution: Avoid consumption of grapefruit or grapefruit juice.

Total Billed: $38.75 | Dispensing Pharmacist: Certified
        """.strip(),
        "parsed_items": [
            {
                "name": "Telmisartan",
                "dosage": "40 mg",
                "timing": "Morning",
                "food_instruction": "After morning breakfast",
                "purpose": "Blood Pressure Regulation",
                "caution": "Do not discontinue abruptly; monitor blood pressure weekly"
            },
            {
                "name": "Metformin ER",
                "dosage": "500 mg",
                "timing": "Morning",
                "food_instruction": "With morning meal",
                "purpose": "Glycemic Control",
                "caution": "Always take with food to minimize gastric discomfort"
            },
            {
                "name": "Metformin ER",
                "dosage": "500 mg",
                "timing": "Night",
                "food_instruction": "With evening dinner",
                "purpose": "Glycemic Control",
                "caution": "Always take with food to minimize gastric discomfort"
            },
            {
                "name": "Atorvastatin",
                "dosage": "10 mg",
                "timing": "Night",
                "food_instruction": "At bedtime with water",
                "purpose": "Lipid and Cholesterol Regulation",
                "caution": "Strictly avoid grapefruit products during treatment"
            }
        ]
    },
    "grandpa_care": {
        "id": "grandpa_care",
        "title": "Grandfather - Geriatric Routine and Mobility Protocol",
        "subtitle": "Senior Healthcare Assessment Record",
        "patient": "Ramesh (Grandfather, Age 82)",
        "source_type": "Geriatric Specialist Care Plan",
        "raw_text": """
GERIATRIC WELLNESS & REHABILITATION CENTER
Patient: Ramesh (Age: 82)
Primary Caregiver: Family
Review Date: 05-October-2026

Daily Medication Protocol:
1. Amlodipine Besylate 5 mg
   - Schedule: Morning 8:30 AM after light breakfast.
   - Purpose: Hypertension control.

2. Glucosamine Sulfate 750 mg with Chondroitin
   - Schedule: Afternoon 1:30 PM with warm water after lunch.
   - Purpose: Osteoarthritis joint mobility.

3. Tears Naturale Lubricant Eye Drops
   - Schedule: Morning and Night (1 drop in each eye).
   - Purpose: Relieve dry eye syndrome and post-cataract irritation.

4. Melatonin 3 mg (Low Dose)
   - Schedule: Night 30 minutes before retiring to bed with warm beverage.
   - Purpose: Sleep-wake cycle stabilization.
        """.strip(),
        "parsed_items": [
            {
                "name": "Amlodipine Besylate",
                "dosage": "5 mg",
                "timing": "Morning",
                "food_instruction": "After light breakfast around 8:30 AM",
                "purpose": "Hypertension Control",
                "caution": "Assist patient with rising slowly to prevent postural dizziness"
            },
            {
                "name": "Glucosamine + Chondroitin",
                "dosage": "750 mg",
                "timing": "Afternoon",
                "food_instruction": "After lunch with warm water",
                "purpose": "Joint Mobility and Cartilage Support",
                "caution": "Ensure adequate fluid intake during administration"
            },
            {
                "name": "Tears Naturale Eye Drops",
                "dosage": "1 Drop each eye",
                "timing": "Morning",
                "food_instruction": "Ophthalmic instillation",
                "purpose": "Corneal Lubrication and Dry Eye Relief",
                "caution": "Wash hands thoroughly before instilling drops"
            },
            {
                "name": "Tears Naturale Eye Drops",
                "dosage": "1 Drop each eye",
                "timing": "Night",
                "food_instruction": "Ophthalmic instillation",
                "purpose": "Corneal Lubrication and Dry Eye Relief",
                "caution": "Instill 15 minutes prior to sleep"
            },
            {
                "name": "Melatonin",
                "dosage": "3 mg",
                "timing": "Night",
                "food_instruction": "30 minutes before sleep with warm water or milk",
                "purpose": "Sleep Architecture Stabilization",
                "caution": "Maintain a quiet, dim sleep environment after administration"
            }
        ]
    }
}
