# DoseGuard AI - Family Medication Protocol & Caregiver Verification Platform
Built for Parents, Grandparents, and Family Caregivers.
Powered by Local Open-Source Clinical Intelligence. Zero Cloud Health Telemetry.

Submission for the Hacktoberfest Weekend Challenge: Build for a Friend or Loved One.

---

## 1. Clinical Context and Motivation: Why This Was Built

For families with aging parents, grandparents, and busy members, managing chronic multi-drug regimens is a frequent source of severe anxiety and adverse medical events:

1. Ambiguity of Administration: Loved ones regularly struggle with the uncertainty of whether a morning dose was ingested or merely contemplated. This leads to either dangerous omission (precipitating clinical relapse) or accidental double-dosing of cardiovascular agents, hypoglycemics, or thyroid hormones.
2. Contradictory Timing Rules: Regimens often involve strict physiological intervals. For instance, levothyroxine must be administered in a fasting state 45 to 60 minutes prior to food or caffeine, while calcium formulations must be taken post-meal and separated by at least 4 full hours to prevent binding and malabsorption.
3. Caregiver Uncertainty: Children and family caregivers living in separate rooms or residences often experience persistent anxiety, resorting to daily verification calls: "Did you take your blood pressure medication today?"
4. Alarm Fatigue: Traditional alarm apps are reflexively snoozed or dismissed without the patient actually getting out of bed or ingesting their prescribed dose.

DoseGuard AI was engineered specifically for a 5-member family (Mother, Father, Grandfather, Grandmother, Daughter) to provide individual PIN-secured dashboards, cross-family medication transparency, and an interactive audio alarm requiring two math puzzles to stop.

---

## 2. Core Technical Architecture

The platform is built using a lightweight, performant stack without heavy frontend frameworks or cloud dependencies:

- Backend: Python 3 with FastAPI and Uvicorn. Lightweight, asynchronous REST API.
- Frontend: Semantic HTML5, CSS3 with responsive custom design system, and Vanilla JavaScript (ES6+).
- Audio System: Web Audio API synthesis generating non-blocking clinical alarm tones without external media files.
- Local Data Layer: Persistent JSON vault maintaining profiles, credentials, active prescriptions, and daily verification timestamps.
- Clinical AI Engine: Local deterministic entity extractor and safety triage model executing directly on device CPU. Zero cloud API dependencies.

### Directory Structure
```
Challenge-1/
├── main.py                     # FastAPI application entrypoint and REST endpoints
├── core/
│   ├── __init__.py
│   ├── models.py               # Local health vault persistence, PIN auth, and adherence logic
│   ├── ai_engine.py            # Local open-source clinical entity extractor and Q&A engine
│   └── sample_data.py          # Pre-configured clinical prescriptions and pharmacy invoices
├── static/
│   ├── css/
│   │   └── styles.css          # Design system, accessible cards, and responsive layout
│   └── js/
│       ├── api.js              # Asynchronous HTTP client layer
│       └── app.js              # State controller, PIN keypad, alarm audio, and math puzzles
├── templates/
│   └── index.html              # Public landing, PIN login, and member dashboards
├── requirements.txt            # Minimal Python dependencies
├── Procfile                    # Render process specification
├── render.yaml                 # Render infrastructure-as-code deployment manifest
├── README.md                   # Comprehensive technical documentation
└── SUBMISSION_DRAFT.md         # Prefilled Dev.to Hacktoberfest submission document
```

---

## 3. Key Functional Modules

### 3.1. Public Website & Number PIN Login
- Welcoming landing view presenting platform capabilities ("We take care of your regular medication").
- Individual 4-digit number PIN authentication for each family member:
  - Mother (Sunita): PIN `1111`
  - Father (Rajesh): PIN `2222`
  - Grandfather (Ramesh): PIN `3333`
  - Grandmother (Kamla): PIN `4444`
  - Daughter (Alina): PIN `5555`
- Onscreen numeric keypad supporting tactile touch and keyboard input.

### 3.2. Personal Member Dashboard
- Greeting card with member name and calendar day ribbon (M T W T F S S with active date pill).
- Personal timeline listing scheduled doses with exact administration times (e.g. 06:30 AM, 08:00 AM, 12:30 PM, 10:30 PM).
- Single-click verification logging exact timestamps (e.g. "Confirmed taken at 08:35 AM").
- Member controls to add new medicines or remove obsolete prescriptions.

### 3.3. Family-Wide Medication Transparency ("All Members on One Page")
- Dedicated cross-family dashboard allowing any member to inspect the medications, timing, and today's status across all 5 family members.
- Enables adult children to monitor if elderly parents took their medication, or verify what pills grandparents need at night.

### 3.4. Alarm with Math Puzzle Verification to Stop
- Active reminder system with synthesized clinical alarm sound via Web Audio API.
- The alarm modal forces mental alertness by requiring the user to accurately solve two dynamic math puzzles (e.g., 2-digit addition and multiplication) before the sound can be silenced.
- Prevents absent-minded dismissal while half-asleep.

### 3.5. Grounded Clinical Health Companion
- Deterministic medical triage for common elder medication scenarios:
  - Missed Dose Protocol: Enforces the clinical rule that double doses must never be ingested.
  - Dietary Interactions: Alerts against irreversible CYP3A4 inhibition by grapefruit juice when taking statins or calcium channel blockers.
  - Interval Rules: Enforces the 4-hour spacing requirement between multivalent cations (calcium/iron) and thyroid hormone.

---

## 4. Why Open Innovation Matters

In health technologies and family care, open-source architecture represents a fundamental ethical necessity:

1. Absolute Health Privacy: Prescription regimens disclose intimate physiological conditions. Forwarding family health records to closed cloud APIs exposes sensitive data to server-side retention, corporate logging, model training, and commercial tracking. DoseGuard executes all data persistence and clinical parsing 100% locally on the host device.
2. Offline Continuity of Care: Elderly family members in rural communities or suburban environments frequently encounter unstable internet access. DoseGuard operates uninterrupted without requiring an active internet connection.
3. Universal Access Without Paywalls: Commercial health applications routinely gate multi-profile management, interaction warnings, and caregiver sharing behind recurring monthly subscriptions. Open innovation ensures that essential adherence tools remain accessible to every family at zero software cost.

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
