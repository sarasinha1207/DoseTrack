# DoseGuard AI - Family Medication Protocol & Caregiver Verification Platform
Built for Parents, Grandparents, and Family Caregivers.
Powered by Local Open-Source Clinical Intelligence. Zero Cloud Health Telemetry.

Submission for the Hacktoberfest Weekend Challenge: Build for a Friend or Loved One.

---

## 1. Clinical Motivation & Real-World Problem

For families managing multi-generational medication regimens, chronic health adherence presents daily cognitive friction:

1. Ambiguity of Administration: Loved ones regularly struggle with the uncertainty of whether a morning dose was ingested or merely contemplated. This leads to either dangerous omission (precipitating clinical relapse) or accidental double-dosing of cardiovascular agents, hypoglycemics, or thyroid hormones.
2. Contradictory Timing Rules: Regimens often involve strict physiological intervals. For instance, levothyroxine must be administered in a fasting state 45 to 60 minutes prior to food or caffeine, while calcium formulations must be taken post-meal and separated by at least 4 full hours to prevent binding and malabsorption.
3. Caregiver Uncertainty: Children and family caregivers living in separate rooms or residences often experience persistent anxiety, resorting to daily verification calls: "Did you take your blood pressure medication today?"
4. Alarm Fatigue: Traditional alarm apps are reflexively snoozed or dismissed without the patient actually waking up or ingesting their prescribed dose.

DoseGuard AI was engineered specifically for families (Mother Sunita, Father Rajesh, Grandfather Ramesh, Grandmother Kamla, Daughter Alina, and custom members) with full-width headers and footers, a dedicated Login & Registration portal (strictly Username and Password, zero PIN interface), a comprehensive About & Research page, a stationary 100vh sidebar dashboard, cross-family transparency with primary caregiver admin oversight, dashboard top-header notification and profile popovers with biometrics and logout, and an interactive audio alarm requiring two math puzzles to silence.

---

## 2. Platform Structure & Key Features

### 2.1. Maximum Width Edge-to-Edge System Headers & Footers
- Full-Width System Header: Spans edge-to-edge (100% viewport width) across all pages (Home, About, Login, and Dashboard). Features DoseGuard AI emblem, responsive navigation links, and quick portal access.
- Full-Width Multi-Column System Footer: Spans edge-to-edge (100% viewport width) across all pages. Features clinical overview, comprehensive navigation links, clinical safety standards, deployment specifications, and clinical disclaimers.

### 2.2. Modular Code Architecture & Professional Folder Structure
Each page is cleanly decoupled into dedicated HTML template and JavaScript controller files:
- Homepage: `templates/index.html` + `static/js/home.js`
- About Page: `templates/about.html` + `static/js/about.js`
- Login & Registration Page: `templates/login.html` + `static/js/login.js`
- Authenticated Dashboard: `templates/dashboard.html` + `static/js/dashboard.js`
- Shared Audio & Math Verification Module: `static/js/alarm.js`
- Shared RESTful API Client: `static/js/api.js`
- Shared Clinical Design System: `static/css/styles.css`

### 2.3. Completely PIN-Free Authentication (Username & Password)
- Existing Member Sign In:
  - Requires Username and Password only.
  - Zero numeric PINs or tactile keypads.
  - Includes 1-click quick demo buttons for testing all family personas (Sunita, Rajesh, Ramesh, Kamla, Alina) with automatic credential autofill.
- Streamlined 6-Field Registration:
  - Form asks strictly for: First Name, Second Name (Last Name), Gender, Age, Username, and Password.
- Automatic Post-Registration Onboarding Modal:
  - Immediately upon completing registration, the user is redirected to the dashboard where the onboarding modal automatically displays.
  - Collects secondary clinical details: Biometrics (Weight, Height, Blood Group), Primary Physician, Clinical Notes/Allergies, Primary Family Admin designation, and Initial Medication details.

### 2.4. Authenticated Dashboard with Stationary Sidebar & Top Header Popovers
- Stationary 100vh Sidebar:
  - Fixed at screen height (`height: 100vh; position: sticky; top: 0;`).
  - Does NOT scroll away when navigating or scrolling through medication schedules.
  - Contains navigation for My Daily Schedule, All Family Medications, Add Family Member, Biometric Profile, Clinical Guidance, and Help & FAQ.
  - Sidebar footer provides member overview and quick logout.
- Full-Width Dashboard Top Header:
  - Breadcrumb and dynamic view title.
  - "Simulate Alarm" button for instant testing of Web Audio alert and math challenge.
  - Notification Icon Button with count badge: clicking opens a floating popover holder displaying upcoming and unread medication reminders.
  - Profile Icon Button with user avatar: clicking opens a floating profile popover card showing Full Name, @username, Role badge, Primary Admin status, Biometrics summary (Age, Gender, Weight, Height, Blood Group), Physician, Clinical Notes, and a prominent Logout button.

### 2.5. Dual-Puzzle Arithmetic Cognitive Verification Alarm
- Audio synthesis via browser Web Audio API (sine-wave harmonic alert, zero external audio dependencies).
- When a reminder triggers, the user must solve two distinct arithmetic problems (one addition, one multiplication) before the alarm can be silenced.
- Verification confirms prefrontal cognitive alertness and ensures the patient is conscious and attentive before taking medication.

---

## 3. Directory Layout

```
Challenge-1/
├── main.py                     # FastAPI application entrypoint and REST endpoints
├── core/
│   ├── __init__.py
│   ├── models.py               # Local JSON vault, biometrics, credentials, and adherence logic
│   ├── ai_engine.py            # Local open-source clinical entity extractor and Q&A engine
│   └── sample_data.py          # Pre-configured clinical prescriptions and pharmacy invoices
├── static/
│   ├── css/
│   │   └── styles.css          # Design system, full-width headers/footers, popovers, and 100vh sidebar
│   └── js/
│       ├── api.js              # Asynchronous HTTP client layer
│       ├── alarm.js            # Web Audio chime synthesis and 2-puzzle math challenge system
│       ├── home.js             # Public homepage controller and collapsible FAQs
│       ├── about.js            # About page controller and collapsible FAQs
│       ├── login.js            # PIN-free username/pwd authentication and 6-field registration
│       └── dashboard/          # Modular dashboard JavaScript controllers
│           ├── dashboard.js    # Master dashboard lifecycle and header popovers coordinator
│           ├── schedule.js     # Daily schedule rendering, intake verification, and adherence
│           ├── family.js       # Cross-family medication transparency grid
│           ├── add_member.js   # Add connected family member form controller
│           ├── profile.js      # Biometric profile display and update controller
│           ├── clinical.js     # Prescription AI text parser and regimen import
│           └── help.js         # In-dashboard collapsible FAQ accordion controller
├── templates/
│   ├── index.html              # Public homepage with full-width header/footer
│   ├── about.html              # Dedicated about page with full-width header/footer
│   ├── login.html              # Dedicated login/register page with full-width header/footer
│   ├── dashboard.html          # Authenticated dashboard fallback template
│   └── dashboard/              # Modular dashboard page components
│       ├── index.html          # Master dashboard layout with stationary 100vh sidebar
│       ├── schedule.html       # Daily schedule component
│       ├── family.html         # All family medications component
│       ├── add_member.html     # Add family member component
│       ├── profile.html        # Biometric profile component
│       ├── clinical.html       # Clinical guidance and prescription parser component
│       └── help.html           # In-dashboard Help & FAQ component
├── family_health_vault.json    # Local JSON data store for family profiles and adherence logs
├── Procfile                    # Render web service start command (uvicorn main:app)
├── render.yaml                 # Render Infrastructure as Code configuration
├── requirements.txt            # Python dependencies (fastapi, uvicorn, pydantic)
├── README.md                   # Complete architectural documentation
└── SUBMISSION_DRAFT.md         # Submission essay detailing clinical design and open innovation
```

---

## 4. Local Execution & Testing

### 4.1. Requirements
- Python 3.9+
- Modern Web Browser (Chrome, Firefox, Safari, Edge)

### 4.2. Installation & Running
```bash
# Install dependencies
pip install -r requirements.txt

# Start the DoseGuard AI server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Access the application in your browser:
- Homepage: `http://localhost:8000/`
- About Page: `http://localhost:8000/about`
- Sign In & Registration: `http://localhost:8000/login`
- Authenticated Dashboard: `http://localhost:8000/dashboard`

### 4.3. Pre-Configured Demo Accounts (Username & Password)
- Mother: `sunita` / `sunita123` (Admin)
- Father: `rajesh` / `rajesh123`
- Grandfather: `ramesh` / `ramesh123`
- Grandmother: `kamla` / `kamla123`
- Daughter: `alina` / `alina123` (Admin)

---

## 5. Deployment on Render

This project is fully prepared for one-click deployment on Render:
1. `Procfile`:
   ```
   web: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
2. `render.yaml`:
   ```yaml
   services:
     - type: web
       name: doseguard-ai
       runtime: python
       buildCommand: pip install -r requirements.txt
       startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
       envVars:
         - key: PYTHON_VERSION
           value: 3.11.0
   ```

---

## 6. Strict Compliance Checklist
- Strictly zero emojis in code, HTML, CSS, JavaScript, Python, or documentation.
- Pure Python (FastAPI) backend with Semantic HTML, CSS, and Vanilla JavaScript.
- Full-width header and footer on all pages.
- Zero PIN interface in login; pure Username & Password.
- Streamlined 6-field registration followed by post-registration clinical onboarding.
- Stationary 100vh sidebar that does not scroll away.
- Dashboard top header with notification popover and profile card with biometrics & logout.
- Two arithmetic math puzzles required to silence the medication alarm.
