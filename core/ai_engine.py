"""
Open-Source Clinical AI Engine for DoseTrack.
Performs:
1. Prescription and medical invoice parsing (entity extraction of drug names, dosages, timings, and dietary precautions).
2. Grounded clinical consultation (missed dose triage, interaction checking, and regimen clarification).
Strictly free of emojis. Clean professional medical intelligence.
"""

import re
from typing import List, Dict, Any

CLINICAL_KNOWLEDGE_BASE = {
    "levothyroxine": {
        "class": "Synthetic Thyroid Hormone (T4)",
        "purpose": "Restores physiological thyroid hormone levels for metabolic and systemic regulation.",
        "rules": "Administer once daily on an empty stomach with a full glass of plain water, 45 to 60 minutes before breakfast, tea, or coffee.",
        "interactions": ["Calcium Carbonate (Shelcal)", "Ferrous Sulfate (Iron)", "Antacids containing Aluminum/Magnesium"],
        "interaction_note": "Maintain a minimum 4-hour gap from calcium and iron formulations to avoid binding and malabsorption.",
        "missed_dose": "Take as soon as recalled if prior to midday on an empty stomach. Never double up tablets the following morning."
    },
    "metformin": {
        "class": "Biguanide Antidiabetic Agent",
        "purpose": "Decreases hepatic glucose production and enhances peripheral insulin sensitivity.",
        "rules": "Administer with or immediately following meals to mitigate gastrointestinal side effects.",
        "interactions": ["Ethanol (Alcohol)", "Severe caloric restriction"],
        "interaction_note": "Consuming while skipping meals increases the risk of hypoglycemia and gastrointestinal cramping.",
        "missed_dose": "Administer with the subsequent meal if recalled. If approaching the next scheduled administration, omit the missed dose. Never take a double dose."
    },
    "telmisartan": {
        "class": "Angiotensin II Receptor Blocker (ARB)",
        "purpose": "Promotes vasodilation to reduce elevated vascular resistance and protect renal function.",
        "rules": "Take once daily, consistently at the same hour each morning, with or without food intake.",
        "interactions": ["Potassium-sparing diuretics", "Potassium dietary supplements", "NSAIDs (Ibuprofen)"],
        "interaction_note": "Avoid unsupervised high-potassium salt substitutes due to the potential risk of hyperkalemia.",
        "missed_dose": "Take when remembered unless close to the subsequent scheduled dose. Do not ingest two doses concurrently."
    },
    "atorvastatin": {
        "class": "HMG-CoA Reductase Inhibitor (Statin)",
        "purpose": "Reduces low-density lipoprotein (LDL) cholesterol and stabilizes vascular atheroma.",
        "rules": "Generally administered at bedtime once daily, independent of food intake.",
        "interactions": ["Grapefruit and Grapefruit Juice", "Macrolide Antibiotics"],
        "interaction_note": "Grapefruit inhibits intestinal CYP3A4 enzymes, substantially increasing serum drug concentrations and elevating the risk of myopathy or rhabdomyolysis.",
        "missed_dose": "If omitted at night, take in early morning if remembered, or wait until the next evening. Do not double up."
    },
    "amlodipine": {
        "class": "Dihydropyridine Calcium Channel Blocker",
        "purpose": "Inhibits calcium influx into vascular smooth muscle, reducing systemic blood pressure.",
        "rules": "Take once daily in the morning. Seniors should rise gradually from supine or sitting positions to prevent orthostatic lightheadedness.",
        "interactions": ["Grapefruit juice", "Alcohol"],
        "interaction_note": "Instruct elderly patients to rise gradually from bed or seating to prevent postural hypotension.",
        "missed_dose": "Take as soon as remembered. If within 12 hours of the next dose, omit the missed tablet."
    },
    "calcium": {
        "class": "Mineral Supplement / Bone Substrate",
        "purpose": "Supplements dietary calcium for skeletal density and osteopenia management.",
        "rules": "Administer following a meal (ideally lunch) to facilitate optimal gastrointestinal absorption.",
        "interactions": ["Levothyroxine", "Tetracycline antibiotics", "Bisphosphonates"],
        "interaction_note": "Must be separated from levothyroxine by at least 4 hours.",
        "missed_dose": "Take with the next meal. Supplements allow flexible timing."
    },
    "glucosamine": {
        "class": "Aminosaccharide Cartilage Precursor",
        "purpose": "Supports articular cartilage matrix synthesis and reduces joint stiffness.",
        "rules": "Administer with food and warm liquids for ease of deglutition.",
        "interactions": ["Warfarin / Coumarin anticoagulants"],
        "interaction_note": "Monitor coagulation profiles if co-administered with prescribed anticoagulants.",
        "missed_dose": "Resume with the next scheduled meal."
    }
}


class DoseTrackAIEngine:
    def __init__(self):
        self.engine_version = "DoseTrack Clinical AI v2.4 (Open Clinical Taxonomy)"

    def parse_prescription_text(self, text: str) -> List[Dict[str, Any]]:
        """
        Parses unstructured clinical notes, doctor orders, or pharmacy cash receipts.
        Extracts structured medication objects without requiring external APIs.
        """
        results = []
        lines = [line.strip() for line in text.split("\n") if line.strip()]

        for line in lines:
            line_lower = line.lower()

            if any(header in line_lower for header in [
                "clinic", "hospital", "patient:", "doctor:", "date:",
                "tax invoice", "total billed", "total paid", "receipt:", "invoice number"
            ]):
                continue

            has_dosage = any(unit in line_lower for unit in [
                "mg", "mcg", "ml", "iu", "tablet", "tab", "capsule", "cap", "drop", "softgel"
            ])

            timing = "Morning"
            if "night" in line_lower or "bedtime" in line_lower or "sleep" in line_lower:
                timing = "Night"
            elif "afternoon" in line_lower or "lunch" in line_lower:
                timing = "Afternoon"
            elif "evening" in line_lower or "dinner" in line_lower:
                timing = "Evening"
            elif "morning" in line_lower or "breakfast" in line_lower:
                timing = "Morning"

            food_instruction = "Take with plain water"
            if "empty stomach" in line_lower:
                food_instruction = "On an empty stomach (wait 45-60 minutes before breakfast or tea)"
            elif "after lunch" in line_lower:
                food_instruction = "Strictly after lunch with a full glass of water"
            elif "after breakfast" in line_lower or "with breakfast" in line_lower:
                food_instruction = "With or immediately after morning breakfast"
            elif "with dinner" in line_lower or "after dinner" in line_lower:
                food_instruction = "With or immediately after dinner"
            elif "bedtime" in line_lower or "before sleep" in line_lower:
                food_instruction = "At bedtime with water"
            elif "with food" in line_lower or "with meal" in line_lower or "with meals" in line_lower:
                food_instruction = "Always administer concurrently with meals"

            dose_match = re.search(r"(\d+(?:\.\d+)?\s*(?:mg|mcg|ml|iu|g|tablets?|capsules?|drops?|softgels?))", line, re.IGNORECASE)
            dosage = dose_match.group(1) if dose_match else "1 Unit"

            if has_dosage or any(token in line_lower for token in ["rx:", "sig:", "usage:", "1.", "2.", "3.", "4."]):
                clean_name = line
                clean_name = re.sub(r"^(?:Rx:|\d+[\.\)\-]?)\s*", "", clean_name, flags=re.IGNORECASE)
                clean_name = re.sub(r"-\s*Quantity:.*$", "", clean_name, flags=re.IGNORECASE)
                clean_name = re.sub(r"-\s*Qty:.*$", "", clean_name, flags=re.IGNORECASE)
                clean_name = re.sub(r"\s*\(?(?:Usage|Sig|Instructions?|Schedule):.*$", "", clean_name, flags=re.IGNORECASE)
                clean_name = clean_name.strip()

                if len(clean_name) > 3:
                    purpose = "Prescribed Clinical Regimen"
                    caution = "Follow prescribed dosage and report adverse reactions to physician"

                    for drug_key, info in CLINICAL_KNOWLEDGE_BASE.items():
                        if drug_key in clean_name.lower():
                            purpose = info["purpose"]
                            caution = info.get("interaction_note", info["rules"])
                            break

                    results.append({
                        "name": clean_name[:50],
                        "dosage": dosage,
                        "timing": timing,
                        "food_instruction": food_instruction,
                        "purpose": purpose,
                        "caution": caution
                    })

        if not results:
            results.append({
                "name": "General Prescribed Medication",
                "dosage": "1 Unit",
                "timing": "Morning",
                "food_instruction": "Take with water after food",
                "purpose": "Physician Prescribed Regimen",
                "caution": "Verify instructions with dispensing pharmacist"
            })

        return results

    def answer_family_question(self, question: str, profile_name: str, medications: List[Dict[str, Any]]) -> str:
        """
        Answers family medication questions using grounded clinical protocols.
        Ensures safety principles (never double-dosing, dietary interactions).
        """
        q_lower = question.lower()
        med_names = [m.get("name", "") for m in medications]
        med_summary = ", ".join(med_names) if med_names else "no active medications on record"

        if "miss" in q_lower or "forgot" in q_lower or "skip" in q_lower:
            return (
                f"Clinical Protocol for Missed Dose ({profile_name}):\n\n"
                f"1. Critical Safety Rule: Never administer a double dose to compensate for an omitted tablet. "
                f"Doubling doses of antihypertensive or hypoglycemic agents can precipitate sudden hypotension or severe hypoglycemia.\n\n"
                f"2. Time Threshold: If the missed dose is identified within 2 to 4 hours of the designated time, "
                f"administer it with appropriate food or fluid as prescribed.\n\n"
                f"3. Proximity to Next Dose: If the timeframe is within 4 to 6 hours of the subsequent scheduled dose, "
                f"omit the missed dose entirely and resume the standard schedule.\n\n"
                f"4. Profile Context: {profile_name} is currently prescribed: {med_summary}. "
                f"If persistent dizziness, tremors, or disorientation occur, contact your physician immediately."
            )

        if "grapefruit" in q_lower:
            return (
                f"Dietary Interaction Advisory - Grapefruit:\n\n"
                f"Grapefruit and related citrus contain furanocoumarins that irreversibly inhibit intestinal cytochrome P450 3A4 (CYP3A4) enzymes. "
                f"This markedly elevates the bioavailability of drugs metabolized by this pathway.\n\n"
                f"Specific Risk: If {profile_name} takes HMG-CoA reductase inhibitors (such as Atorvastatin) or calcium channel blockers (such as Amlodipine), "
                f"grapefruit consumption can cause toxic drug accumulation, leading to severe myopathy, elevated liver enzymes, or acute hypotension.\n\n"
                f"Recommendation: Completely exclude grapefruit and grapefruit juices from the patient's diet."
            )

        if "calcium" in q_lower and "thyroid" in q_lower:
            return (
                f"Pharmacological Interaction Advisory - Calcium and Levothyroxine:\n\n"
                f"Calcium carbonate and calcium citrate form insoluble chelates with levothyroxine in the gastrointestinal lumen, "
                f"drastically diminishing thyroid hormone absorption.\n\n"
                f"Clinical Directive: Enforce an interval of at least 4 full hours between the morning thyroid dose and any calcium supplementation."
            )

        if "empty stomach" in q_lower or "before food" in q_lower:
            return (
                f"Administration Guidelines - Fasting vs Fed State for {profile_name}:\n\n"
                f"- Thyroid Formulations (Levothyroxine): Must be taken fasting with plain water at least 45 to 60 minutes before any food, tea, or milk.\n"
                f"- Antidiabetics (Metformin): Must be taken with or immediately following meals to minimize gastrointestinal distress and maintain steady gastric transit.\n"
                f"- Antihypertensives (Telmisartan, Amlodipine): Can be taken with light breakfast to support routine consistency."
            )

        if "tonight" in q_lower or "night" in q_lower or "evening" in q_lower:
            night_meds = [m for m in medications if m.get("timing") in ["Night", "Evening"]]
            if night_meds:
                items = "\n".join([f"- {m['name']} ({m.get('dosage', '1 Unit')}) | Instruction: {m.get('food_instruction', 'Take with water')}" for m in night_meds])
                return f"Evening / Night Regimen for {profile_name}:\n\n{items}\n\nClinical Note: Ensure patient consumes adequate water and avoids blue-light screens post-administration."
            else:
                return f"Evening / Night Regimen for {profile_name}:\n\nNo medications are currently scheduled for the evening or night hours."

        if "morning" in q_lower:
            morn_meds = [m for m in medications if m.get("timing") == "Morning"]
            if morn_meds:
                items = "\n".join([f"- {m['name']} ({m.get('dosage', '1 Unit')}) | Instruction: {m.get('food_instruction', 'Take with water')}" for m in morn_meds])
                return f"Morning Regimen for {profile_name}:\n\n{items}"
            else:
                return f"Morning Regimen for {profile_name}:\n\nNo medications are scheduled for the morning period."

        for drug_key, info in CLINICAL_KNOWLEDGE_BASE.items():
            if drug_key in q_lower:
                return (
                    f"Clinical Summary for {info['class']} ({drug_key.title()}):\n\n"
                    f"- Therapeutic Purpose: {info['purpose']}\n"
                    f"- Administration Guidelines: {info['rules']}\n"
                    f"- Recognized Interactions: {', '.join(info['interactions'])}\n"
                    f"- Safety Caution: {info['interaction_note']}\n"
                    f"- Missed Dose Directive: {info['missed_dose']}"
                )

        return (
            f"Caregiver Advisory for {profile_name}:\n\n"
            f"Currently overseeing {len(medications)} active prescription items: {med_summary}.\n\n"
            f"- Administration Discipline: Ensure consistency in administration hours relative to meal times.\n"
            f"- Hydration: Ensure elderly family members ingest at least 150ml of room-temperature water with each solid oral dose.\n"
            f"- Regulatory Disclaimer: DoseTrack operates on local deterministic clinical intelligence. For acute physiological symptoms or dosage adjustments, consult the attending physician."
        )
