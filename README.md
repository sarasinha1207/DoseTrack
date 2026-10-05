# DoseTrack - Clinical Family Medication Safety & Adherence Platform
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

DoseTrack was engineered specifically for families (Mother Sunita, Father Rajesh, Grandfather Ramesh, Grandmother Kamla, Daughter Alina, and custom members) with full-width headers and footers, a dedicated Login & Registration portal (strictly Username and Password, zero PIN interface), a comprehensive About & Research page, a stationary 100vh sidebar dashboard, cross-family transparency with primary caregiver admin oversight, dashboard top-header notification and profile popovers with biometrics and logout, vitals tracking (BP & Sugar with CSV export), and an interactive audio alarm requiring two math puzzles to silence.

---

## 2. Platform Structure & Key Features

### 2.1. Maximum Width Edge-to-Edge System Headers & Footers
- Full-Width System Header: Spans edge-to-edge (100% viewport width) across all pages (Home, About, Login, and Dashboard). Features DoseTrack emblem, responsive navigation links, and quick portal access.
- Full-Width Multi-Column System Footer: Spans edge-to-edge (100% viewport width) across all pages. Features clinical overview, comprehensive navigation links, clinical safety standards, deployment specifications, and clinical disclaimers. Resilient flexbox layout ensures the footer sticks to the bottom across all browser zoom levels (50% to 200%).

### 2.2. Modular Code Architecture & Professional Folder Structure
Each page is cleanly decoupled into dedicated HTML template and JavaScript controller files:
- Homepage: `templates/index.html` + `static/js/home.js`
- About Page: `templates/about.html` + `static/js/about.js`
- Login & Registration Page: `templates/login.html` + `static/js/login.js`
- Authenticated Dashboard: `templates/dashboard/index.html` (synced to `templates/dashboard.html`)
- Modular Dashboard Pages:
  - `templates/dashboard/schedule.html` + `static/js/dashboard/schedule.js`
  - `templates/dashboard/family.html` + `static/js/dashboard/family.js`
  - `templates/dashboard/add_medication.html` + `static/js/dashboard/add_medication.js`
  - `templates/dashboard/vitals.html` + `static/js/dashboard/vitals.js`
  - `templates/dashboard/add_member.html` + `static/js/dashboard/add_member.js`
  - `templates/dashboard/profile.html` + `static/js/dashboard/profile.js`
  - `templates/dashboard/help.html` + `static/js/dashboard/help.js`
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
  - Fixed at screen height (`height: 100vh; height: 100dvh;`).
  - Does NOT scroll away when navigating or scrolling through medication schedules.
  - Prominent DoseTrack logo (56px) and active member badge immediately following the brand block.
  - Navigation links for My Daily Schedule, All Family Medications, Add Medication, Vitals: BP & Sugar, Add Family Member, Biometric Profile, and Help & FAQ.
  - Sidebar footer provides quick logout.
- Full-Width Dashboard Top Header:
  - Breadcrumb and dynamic view title.
  - "Simulate Alarm" button for instant testing of Web Audio alert and math challenge.
  - Notification Icon Button with count badge: clicking opens a floating popover holder displaying upcoming and unread medication reminders.
  - Profile Icon Button with user avatar: clicking opens a floating profile popover card showing Full Name, @username, Role badge, Primary Admin status, Biometrics summary (Age, Gender, Weight, Height, Blood Group), Physician, Clinical Notes, and a prominent Logout button.

### 2.5. Dual-Puzzle Arithmetic Cognitive Verification Alarm
- Audio synthesis via browser Web Audio API (sine-wave harmonic alert, zero external audio dependencies).
- When a reminder triggers, the user must solve two distinct arithmetic problems (one addition, one multiplication) before the alarm can be silenced.
- Verification confirms prefrontal cognitive alertness and ensures the patient is conscious and attentive before taking medication.

### 2.6. Health Vitals Tracking & Statistical Analytics
- Records Blood Pressure (Systolic / Diastolic in mmHg) and Blood Sugar (Fasting / Post-Prandial in mg/dL).
- Statistical metrics computed on the fly: Mean systolic, mean diastolic, mean blood sugar, maximum and minimum recorded values with physiological status badges.
- Visual trend chart with hover tooltips and dynamic color zones.
- 1-click CSV Export (`/api/vitals/export-csv`) formatted with timestamp, member name, and clinical readings.

---

## 3. Directory Layout

```
Challenge-1/
├── main.py                     # FastAPI application entrypoint and REST endpoints
├── core/
│   ├── __init__.py
│   ├── models.py               # Local JSON vault, biometrics, credentials, and adherence logic
│   ├── ai_engine.py            # Local clinical entity extractor and Q&A engine
│   └── sample_data.py          # Pre-configured clinical prescriptions and pharmacy records
├── data/
│   ├── vitals_records.csv      # CSV database for blood pressure and sugar readings
│   └── medication_adherence_sample.csv # Adherence logs
├── static/
│   ├── css/
│   │   └── styles.css          # Design system, sticky footers, hover animations, 100vh sidebar
│   ├── images/
│   │   └── logo.png            # DoseTrack shield and pill emblem
│   └── js/
│       ├── api.js              # Asynchronous HTTP client layer
│       ├── alarm.js            # Web Audio chime synthesis and 2-puzzle math challenge system
│       ├── home.js             # Public homepage controller and collapsible FAQs
│       ├── about.js            # About page controller and collapsible FAQs
│       ├── login.js            # PIN-free username/pwd authentication and registration
│       └── dashboard/          # Modular dashboard JavaScript controllers
│           ├── dashboard.js    # Master dashboard lifecycle and header popovers coordinator
│           ├── schedule.js     # Daily schedule rendering and intake verification
│           ├── family.js       # Cross-family medication roster table with filter pills
│           ├── add_medication.js # Dedicated Add Medication view and form handler
│           ├── vitals.js       # BP & Sugar logging, statistics, SVG graph, and CSV export
│           ├── add_member.js   # Add connected family member form controller
│           ├── profile.js      # Biometric profile display and update controller
│           └── help.js         # In-dashboard collapsible FAQ accordion controller
├── templates/
│   ├── index.html              # Public homepage with interactive hero, stats, elder circle
│   ├── about.html              # Dedicated about page with clinical mission & research
│   ├── login.html              # Dedicated login/register page with quick demo buttons
│   ├── dashboard.html          # Authenticated dashboard fallback template
│   └── dashboard/              # Modular dashboard page components
│       ├── index.html          # Master dashboard layout with stationary 100vh sidebar
│       ├── schedule.html       # Daily schedule component
│       ├── family.html         # All family medications roster component
│       ├── add_medication.html # Add medication form component
│       ├── vitals.html         # Vitals logging and graphs component
│       ├── add_member.html     # Add family member component
│       ├── profile.html        # Biometric profile component
│       └── help.html           # In-dashboard Help & FAQ component
├── family_health_vault.json    # Local JSON data store for family profiles and adherence logs
├── Procfile                    # Render web service start command (uvicorn main:app)
├── render.yaml                 # Render Infrastructure as Code configuration
├── requirements.txt            # Python dependencies (fastapi, uvicorn, pydantic, etc.)
├── .gitignore                  # Git exclusions for environments, caches, and logs
└── README.md                   # Complete architectural and deployment documentation
```

---

## 4. Local Execution & Testing

### 4.1. Requirements
- Python 3.9 or higher
- Modern Web Browser (Chrome, Firefox, Safari, Edge)

### 4.2. Installation & Running
```bash
# Clone the repository
git clone https://github.com/your-username/dosetrack.git
cd dosetrack

# Create and activate a virtual environment (optional but recommended)
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the DoseTrack server
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

Access the application in your browser:
- Homepage: `http://localhost:8000/`
- About Page: `http://localhost:8000/about`
- Sign In & Registration: `http://localhost:8000/login`
- Authenticated Dashboard: `http://localhost:8000/dashboard`

### 4.3. Pre-Configured Demo Accounts (Username & Password)
- Mother: `sunita` / `sunita123` (Primary Admin)
- Father: `rajesh` / `rajesh123`
- Grandfather: `ramesh` / `ramesh123`
- Grandmother: `kamla` / `kamla123`
- Daughter: `alina` / `alina123` (Admin)

---

## 5. Step-by-Step Guide: Deploying to Render.com

DoseTrack is configured for deployment on Render as a Python Web Service. Follow these steps:

### Step 5.1: Push Your Code to GitHub
1. Initialize a git repository (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit of DoseTrack application"
   ```
2. Create a new repository on GitHub (e.g. `dosetrack`).
3. Link and push your local branch:
   ```bash
   git remote add origin https://github.com/<your-github-username>/dosetrack.git
   git branch -M main
   git push -u origin main
   ```

### Step 5.2: Create a New Web Service on Render
1. Sign up or log in at [Render.com](https://render.com/).
2. On your Render Dashboard, click **New +** and select **Web Service**.
3. Choose **Build and deploy from a Git repository** and connect your GitHub account.
4. Select your `dosetrack` repository.

### Step 5.3: Configure the Web Service Settings
Fill in the following fields in the Render configuration screen:
- **Name**: `dosetrack` (or any unique name you prefer)
- **Region**: Choose the region closest to you (e.g. Oregon, Frankfurt, Singapore)
- **Branch**: `main`
- **Root Directory**: Leave blank (root of repository)
- **Runtime**: `Python 3`
- **Build Command**:
  ```bash
  pip install -r requirements.txt
  ```
- **Start Command**:
  ```bash
  uvicorn main:app --host 0.0.0.0 --port $PORT
  ```
- **Instance Type**: Select **Free** (or Starter/Standard)

### Step 5.4: Set Environment Variables
Under the **Environment Variables** section on the same page, add:
- Key: `PYTHON_VERSION`
- Value: `3.11.9`

*(Note: Render automatically injects the `$PORT` environment variable at runtime. Uvicorn binds to `0.0.0.0:$PORT` as defined in your start command).*

### Step 5.5: Deploy and Verify
1. Click **Create Web Service** at the bottom of the page.
2. Render will initiate the build process:
   - Clones your repository
   - Installs dependencies from `requirements.txt`
   - Executes the start command
3. Once the build completes, the status will show **Live**.
4. Click on your assigned URL (e.g., `https://dosetrack.onrender.com`) to open the live application!

### Step 5.6: Optional Infrastructure as Code (Blueprint)
Alternatively, if you prefer automated blueprint deployment:
1. In Render, select **Blueprints** > **New Blueprint Instance**.
2. Select your repository. Render will automatically read `render.yaml` from your root folder and provision the service with all settings pre-configured.

---

## 6. Strict Clinical & Technical Standards Checklist
- Strictly zero emojis across code, templates, styling, scripts, and documentation.
- Pure Python (FastAPI) backend with Semantic HTML5, CSS3, and Vanilla JavaScript.
- Edge-to-edge full-width system header and footer on all views.
- Sticky footer across all display scaling and zoom levels (50% to 200%).
- 100% PIN-free authentication with username and password only.
- Stationary 100vh sidebar that remains fixed during scrolling.
- Real-time Web Audio alarm with mandatory 2-step arithmetic alertness check.
- Complete cross-family visibility connected through Primary Admin Sunita Sharma.
- Health vitals logging with automated statistical analytics and CSV export.
