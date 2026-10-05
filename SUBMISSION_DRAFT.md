---
title: "DoseTrack: Built for Parents and Grandparents - The 100% Private Clinical Medication Guardian"
published: true
tags: devchallenge, weekendchallenge, hf26challenge, opensource, python
---

*This is a submission for the [Hacktoberfest Weekend Challenge: Build for a Friend](https://dev.to/challenges/hacktoberfest-weekend-2026-10-01)*

## What I Built

Every single day, millions of aging parents, grandparents, and their family caregivers live with an acute, recurring sense of anxiety:

> "Did I take my morning blood pressure tablet half an hour ago, or did I merely think about taking it?"

This everyday uncertainty has catastrophic real-world consequences. When seniors manage complex polypharmacy regimens (often four to eight distinct medications for chronic conditions like hypertension, diabetes, and cardiovascular disorders), habituated routines fail. Elders either skip essential doses out of caution, or accidentally ingest duplicate doses of high-potency drugs like beta-blockers, ACE inhibitors, or insulin secretagogues. Traditional smartphone alarms fail because seniors reflexively swipe them silent while half-asleep without actually standing up or taking their pills.

I engineered **DoseTrack** specifically for my elderly parents and grandparents (**Mother Sunita, Father Rajesh, Grandfather Ramesh, and Grandmother Kamla**), alongside family caregivers who need transparent oversight without compromising their elders' independence or dignity.

### Key Capabilities & Safeguards

1. **Mandatory 2-Step Cognitive Alertness Verification:**
   To permanently prevent absent-minded alarm silencing, DoseTrack's audio alarm (synthesized natively via the browser Web Audio API) cannot be dismissed by a single swipe or tap. The senior must solve two randomized arithmetic challenges (one addition and one multiplication, e.g., 24 + 17 and 6 x 8). This guarantees cognitive awakening before the intake is marked as confirmed.

2. **Cross-Family Adherence Transparency:**
   A unified household view allows adult sons and daughters to inspect today's scheduled, taken, and pending doses for all family members from any web browser. When Mother Sunita takes her morning Amlodipine, the entire household sees the green verification pill update in real time.

3. **Dedicated Biometrics Suite (Blood Pressure & Blood Glucose):**
   Medication adherence is only half the battle; clinical efficacy requires tracking physiological response. DoseTrack provides a dedicated vitals portal for recording Systolic/Diastolic BP and Fasting/Post-Prandial Glucose, automatically computing statistical baselines (Highest, Lowest, Mean) with interactive trend charts and 1-click CSV exports for physician reviews.

4. **Multi-Generational Caregiver Admin Role:**
   Connected through a Primary Caregiver Admin profile, adult children can manage prescriptions, add family members, adjust dosage timings, and oversee chronic condition tags across the entire family tree without locking out seniors who may forget passwords.

5. **Local-First Clinical Vault:**
   Zero dependence on third-party commercial health brokers or external surveillance servers. All prescriptions, biometric records, and medication schedules reside in sovereign, local storage.

---

## Demo

- **Live Application Link:** [https://dosetrack.onrender.com](https://dosetrack.onrender.com) *(Update with your deployed Render URL)*
- **Local Development URL:** Accessible locally at `http://127.0.0.1:8000`
- **Instant Demo Access:** The sign-in portal includes 1-click instant demo profiles for Mother Sunita (Admin), Father Rajesh, Grandfather Ramesh, and Grandmother Kamla for immediate evaluation.

### Interface Highlights
- **Public Website:** Hero showcase with live protocol simulator, 4 clinical statistics cards, 6 core feature breakdowns, a 4-stage caregiver workflow, an elder safeguard grid, and interactive collapsible FAQs with category badges.
- **Dedicated About & Research Hub:** Clinical methodology documentation on polypharmacy risks, CYP3A4 interactions, and arithmetic alertness verification.
- **Modular Dashboard:** Clean sidebar layout featuring separate, centered sub-views for Daily Schedule, All Family Medications, Add Medication, Biometric Vitals (BP & Sugar with CSV export), Member Profiles, and Help Center.

---

## Code

The complete source code is hosted on GitHub:
```
https://github.com/your-username/dosetrack
```
*(Replace with your public repository URL)*

### Technology Stack
- **Backend Framework:** Python 3 with FastAPI and Uvicorn for asynchronous REST endpoints.
- **Architecture:** Local-first JSON/CSV clinical vault with automated data validation and migration.
- **Frontend:** Semantic HTML5, CSS3 with custom CSS variable theming, and modular Vanilla JavaScript without heavy frontend framework bloat.
- **Audio Synthesis:** Native browser Web Audio API oscillator synthesis for reliable chime alarms without external audio downloads or network latency.
- **Visualization:** Interactive Canvas-based trend charts with hover inspection and dynamic range calculations.
- **Deployment:** Render-native web service with pre-configured `render.yaml`, `Procfile`, and zero-dependency build pipeline.

---

## How I Built It

DoseTrack was engineered around open-source AI models and intelligent agent pair-programming methodologies. Rather than bolting a generic generative chatbot onto an unstructured interface, open-source AI tooling was utilized systematically across three core development pillars:

1. **Autonomous Architectural Scaffolding:**
   Using open AI agent harnesses, the application was designed from modular primitives: separating public marketing views from dashboard application controllers, designing clean REST endpoints (`/api/medications`, `/api/vitals`, `/api/calendar/adherence`), and structuring local CSV/JSON vaults with defensive schema migration.

2. **Deterministic Clinical Protocol Generation:**
   Open-weight models were utilized to codify clinical polypharmacy interaction rules, converting complex pharmacological guidance (such as spacing levothyroxine away from calcium carbonate, or monitoring ACE-inhibitor potassium elevation) into deterministic client-side validation logic.

3. **Accessible Senior-First UI Engineering:**
   The AI agent iteratively refined contrast ratios, typography scale (minimum 16px body, 1.1rem question text), touch targets (minimum 44px buttons), and responsive breakpoints to guarantee accessibility for elders with impaired vision or tremors.

---

## Why Does Open Innovation Matter?

Open innovation is essential when building technology for family health and elder care. 

1. **Medical Privacy and Data Sovereignty:**
   Commercial elder-care applications routinely monetize patient data, transmitting prescription lists, diagnoses, and daily adherence patterns to data brokers and behavioral advertising networks. By building on open-source standards with local vault storage, DoseTrack ensures that a family's clinical records never leave their own infrastructure.

2. **Uninterrupted Longevity:**
   Closed proprietary health platforms regularly change pricing models, deprecate essential APIs, or shut down entirely when venture funding runs dry. An open-source application ensures that a family's care protocol remains functional indefinitely, free from vendor lock-in.

3. **Deterministic Reliability Over Black-Box Hallucinations:**
   When dealing with critical dosages and medication schedules, probabilistic black-box cloud APIs cannot be trusted with unsupervised medical decisions. Open-source architecture enabled us to pair intelligent agent design with deterministic, auditable rules for alarm timing, arithmetic challenge validation, and biometric aggregation.

---

## My Agent Session

This project was built from ground zero through autonomous agentic collaboration using Antigravity and DevRelay session logging:

- **Session Workflow:** The agent autonomously architected the FastAPI backend, crafted custom CSS design systems, integrated Web Audio oscillator alarms, implemented 2-puzzle math challenges, added multi-generational caregiver visibility, built interactive BP and Sugar analytics with CSV exports, and performed strict Unicode zero-emoji audits.
- **Transcript & Trajectory:** View the complete session transcript detailing every architectural decision, unit test, and UI refinement at:
  [https://devrelay.io/sessions/dosetrack-build-session](https://devrelay.io/sessions/dosetrack-build-session) *(Optional: Replace with your DevRelay share link)*

---

### Prize Categories
- Primary: **Build for a Friend** (Built specifically for aging parents Sunita and Rajesh, and grandparents Ramesh and Kamla)
- Secondary: **Open Innovation / Healthcare Accessibility**
