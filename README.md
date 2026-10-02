# DoseGuard AI - Family Medication Protocol & Caregiver Verification Platform
Built for Parents and Grandparents.
Powered by Local Open-Source Clinical Intelligence. Zero Cloud Health Telemetry.

Submission for the Hacktoberfest Weekend Challenge: Build for a Friend or Loved One.

---

## 1. Clinical Context and Motivation: Why This Was Built

For aging parents and grandparents, managing chronic multi-drug regimens is a frequent source of severe anxiety and adverse medical events:

1. Ambiguity of Administration: Loved ones regularly struggle with the uncertainty of whether a morning dose was ingested or merely contemplated. This leads to either dangerous omission (precipitating clinical relapse) or accidental double-dosing of cardiovascular agents, hypoglycemics, or thyroid hormones.
2. Contradictory Timing Rules: Regimens often involve strict physiological intervals. For instance, levothyroxine must be administered in a fasting state 45 to 60 minutes prior to food or caffeine, while calcium formulations must be taken post-meal and separated by at least 4 full hours to prevent binding and malabsorption.
3. Caregiver Uncertainty: Children and family caregivers living in separate rooms or residences often experience persistent anxiety, resorting to daily verification calls: "Did you take your blood pressure medication today?"
4. Cognitive Friction of Existing Tools: Commercial mobile applications often require complex registration, 15-field data entry forms, subscription paywalls, and persistent cloud tracking.

DoseGuard AI was engineered specifically for family members (Mother, Father, Grandparents) to provide an accessible, high-contrast, one-click verification system coupled with local AI prescription parsing and clinical guidance.

---

## 2. Core Technical Architecture

The platform is built using a lightweight, performant stack without heavy frontend frameworks or cloud dependencies:

- Backend: Python 3 with FastAPI and Uvicorn. Lightweight, asynchronous REST API.
- Frontend: Semantic HTML5, CSS3 with responsive custom design system, and Vanilla JavaScript (ES6+).
- Local Data Layer: Persistent JSON vault maintaining profiles, active prescriptions, and daily verification timestamps.
- Clinical AI Engine: Local deterministic entity extractor and safety triage model executing directly on device CPU. Zero cloud API dependencies.

### Directory Structure
```
Challenge-1/
├── main.py                     # FastAPI application entrypoint and REST endpoints
├── core/
│   ├── __init__.py
│   ├── models.py               # Local health vault persistence and adherence logic
│   ├── ai_engine.py            # Local open-source clinical entity extractor and Q&A engine
│   └── sample_data.py          # Pre-configured clinical prescriptions and pharmacy invoices
├── static/
│   ├── css/
│   │   └── styles.css          # Design system, accessible cards, and responsive layout
│   └── js/
│       ├── api.js              # Asynchronous HTTP client layer
│       └── app.js              # State controller, DOM handlers, and modal managers
├── templates/
│   └── index.html              # Accessible single-page web interface with SVG indicators
├── requirements.txt            # Minimal Python dependencies
├── Procfile                    # Render process specification
├── render.yaml                 # Render infrastructure-as-code deployment manifest
├── README.md                   # Comprehensive technical documentation
└── SUBMISSION_DRAFT.md         # Prefilled Dev.to Hacktoberfest submission document
```

---

## 3. Key Functional Modules

### 3.1. One-Click Intake Verification ("Did They Take It?")
- Organized by discrete clinical time blocks: Morning, Afternoon, Evening, and Night.
- Accessible, high-contrast action triggers designed for senior vision.
- Single-click confirmation records an exact timestamp (e.g., "Confirmed taken at 08:35 AM by Family Caregiver"), definitively resolving double-dose uncertainty.
- Real-time adherence ratio and visual progress indicator.

### 3.2. Prescription and Pharmacy Bill Ingestion
- Ingestion of outpatient doctor slips, discharge notes, and pharmacy cash receipts.
- Entity extraction parses drug name, strength/dosage, daily timing, dietary conditions (fasting vs. fed state), and physiological precautions.
- Pre-Configured Test Scenarios: Immediate demonstration without paper documents:
  - Mother: Endocrine consultation script (Levothyroxine, Calcium + D3, Omega-3).
  - Father: Cardiology and glycemic dispensing invoice (Telmisartan, Metformin ER, Atorvastatin).
  - Grandfather: Geriatric routine (Amlodipine, Glucosamine, Lubricant eye drops, Melatonin).

### 3.3. Grounded Clinical Companion
- Deterministic medical triage for common elder medication scenarios:
  - Missed Dose Protocol: Enforces the critical clinical rule that double doses must never be ingested to compensate for an omitted tablet.
  - Dietary Interactions: Alerts against irreversible CYP3A4 inhibition by grapefruit juice when taking statins or calcium channel blockers.
  - Interval Rules: Enforces the 4-hour spacing requirement between multivalent cations (calcium/iron) and thyroid hormone absorption.

### 3.4. Caregiver Oversight Hub
- Consolidated family dashboard displaying daily adherence percentages across all profiles.
- Automated daily message generator creating clear, caring SMS or messaging updates tailored to remaining doses.
- One-click export of complete clinical records in JSON format for physician review.

---

## 4. Why Open Innovation Matters

In health technologies and family care, open-source architecture represents a fundamental ethical necessity rather than merely an implementation detail:

### 4.1. Absolute Health Privacy and Zero Telemetry
Prescription regimens disclose intimate physiological conditions, including cardiovascular disease, psychiatric therapies, neurological decline, and metabolic illness. Forwarding parent health records to closed commercial cloud endpoints exposes private family data to server-side retention, corporate logging, model training, and potential commercial profiling.
DoseGuard executes all data persistence and clinical parsing 100% locally on the host device. Zero patient data is ever transmitted across external cloud boundaries.

### 4.2. Offline Continuity of Care
Elderly family members in rural communities or suburban environments frequently encounter unstable internet access. Cloud-dependent healthcare tools fail when network connectivity drops. DoseGuard's open-source architecture operates uninterrupted without requiring an active internet connection.

### 4.3. Universal Access Without Paywalls
Commercial health applications routinely gate multi-profile management, interaction warnings, and caregiver sharing behind recurring monthly subscriptions. Open innovation ensures that essential adherence tools remain accessible to every family at zero software cost.

---

## 5. Local Setup and Deployment

### 5.1. Local Execution
1. Clone repository:
   ```bash
   git clone https://github.com/your-username/doseguard-ai.git
   cd doseguard-ai
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Launch application server:
   ```bash
   python main.py
   ```
4. Access via browser at:
   `http://localhost:8000`

### 5.2. Deployment to Render
The repository includes pre-configured `Procfile` and `render.yaml` manifests.

1. Push your repository to GitHub.
2. Sign in to Render (https://render.com).
3. Select "New +" -> "Web Service" and link your GitHub repository.
4. Configure settings:
   - Environment: Python
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Click "Deploy Web Service".
