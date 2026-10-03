# DoseGuard AI - Family Medication Protocol & Caregiver Verification Platform
Built for Parents, Grandparents, and Family Caregivers.
Powered by Local Open-Source Clinical Intelligence. Zero Cloud Health Telemetry.

Submission for the Hacktoberfest Weekend Challenge: Build for a Friend or Loved One.

---

## 1. Clinical Motivation & Real-World Problem

For families with aging parents, grandparents, and multiple dependents, managing multi-drug regimens is a frequent source of severe anxiety and preventable adverse medical events:

1. Ambiguity of Administration: Loved ones regularly struggle with the uncertainty of whether a morning dose was ingested or merely contemplated. This leads to either dangerous omission (precipitating clinical relapse) or accidental double-dosing of cardiovascular agents, hypoglycemics, or thyroid hormones.
2. Contradictory Timing Rules: Regimens often involve strict physiological intervals. For instance, levothyroxine must be administered in a fasting state 45 to 60 minutes prior to food or caffeine, while calcium formulations must be taken post-meal and separated by at least 4 full hours to prevent binding and malabsorption.
3. Caregiver Uncertainty: Children and family caregivers living in separate rooms or residences often experience persistent anxiety, resorting to daily verification calls: "Did you take your blood pressure medication today?"
4. Alarm Fatigue: Traditional alarm apps are reflexively snoozed or dismissed without the patient actually waking up or ingesting their prescribed dose.

DoseGuard AI was engineered specifically for a 5-member family (Mother, Father, Grandfather, Grandmother, Daughter) to provide individual PIN-secured dashboards, full biometric profiles, cross-family medication transparency, and an interactive audio alarm requiring two math puzzles to stop.

---

## 2. Platform Structure & Architecture

The application is structured into two interconnected environments:

### 2.1. The Public Website
- Global Navigation: Brand identity, navigation anchors (Features, How It Works, Family Care, Sign In), and a quick "Demo Login" action.
- Hero Section: Highlighting the core mission ("We take care of your regular medication") with clear calls to action.
- Feature Overview: Highlighting the 5-member family network, individual PIN access, cross-care transparency, and cognitive alarm verification.
- How It Works: A 4-step walkthrough explaining authentication, personal timelines, family check-in, and math challenge dismissal.
- Caregiver Story: Real-world narrative on eliminating missed-dose and double-dosing panic.
- Interactive Login & Demo Section:
  - Account Sign-In Form (Standard family login).
  - PIN Sign-In (Select profile, enter 4-digit number PIN on keypad).
  - 1-Click Instant Demo Launchers for all 5 family members (Mother, Father, Grandfather, Grandmother, Daughter).
- Global Footer: Comprehensive footer with navigation anchors, privacy assurances, and copyright.

### 2.2. The Authenticated Member Dashboard
- Profile Biometrics Card: Displays member Name, Role, Age, Weight, Height, Blood Group, Attending Physician, and Care Notes, with an "Edit Profile" modal.
- Log Out Controls: Prominently located in the top navigation bar and directly within the profile information card.
- Greeting Banner & Calendar Ribbon: Dynamic calendar strip (`M T W T F S S`) with the current day highlighted.
- Daily Medication Timeline: Detailed dose cards with exact administration times (e.g. 06:30 AM, 08:00 AM, 12:30 PM, 10:30 PM), dosage, food instructions, safety cautions, and "Mark Taken" / "Delete" actions.
- All Family Members' Medications ("All in One Page"): Complete cross-visibility into all 5 members' medicines, schedules, and daily intake statuses.
- Audio Alarm with 2 Math Puzzles: Synthesized clinical alarm sound via the Web Audio API that requires correctly solving two dynamic math challenges before silencing.
- Local Clinical Health Companion: Deterministic guidance on missed dose triage, food interactions (grapefruit/statins), and spacing rules (calcium/thyroid).

---

## 3. Directory Layout

```
Challenge-1/
├── main.py                     # FastAPI application entrypoint and REST endpoints
├── core/
│   ├── __init__.py
│   ├── models.py               # Local JSON vault, biometrics, PIN auth, and adherence logic
│   ├── ai_engine.py            # Local open-source clinical entity extractor and Q&A engine
│   └── sample_data.py          # Pre-configured clinical prescriptions and pharmacy invoices
├── static/
│   ├── css/
│   │   └── styles.css          # Design system, accessible cards, and responsive layout
│   └── js/
│       ├── api.js              # Asynchronous HTTP client layer
│       └── app.js              # State controller, PIN keypad, Web Audio alarm, & math puzzles
├── templates/
│   └── index.html              # Public website, PIN demo login, and member dashboards
├── requirements.txt            # Minimal Python dependencies (fastapi, uvicorn)
├── Procfile                    # Render process specification
├── render.yaml                 # Render infrastructure-as-code deployment manifest
├── .gitignore                  # Git repository hygiene
├── README.md                   # Comprehensive technical documentation
└── SUBMISSION_DRAFT.md         # Prefilled Dev.to Hacktoberfest submission document
```

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
