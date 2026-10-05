---
title: "DoseTrack: Built for Parents and Grandparents - The 100% Private Medication Guardian"
published: true
tags: devchallenge, weekendchallenge, hf26challenge, opensource, python
---

*This is a submission for the [Hacktoberfest Weekend Challenge: Build for a Friend](https://dev.to/challenges/hacktoberfest-weekend-2026-10-01)*

---

## What I Built

Every single day, millions of aging parents, grandparents, and family caregivers experience a distressing moment of cognitive ambiguity:

> *"Did I take my morning blood pressure tablet half an hour ago, or did I merely think about taking it?"*

This daily uncertainty has severe clinical consequences: elderly loved ones either omit doses out of caution (triggering cardiovascular or glycemic crises) or accidentally ingest double doses of critical agents like antihypertensives, oral hypoglycemics, or thyroid hormones. Concurrently, traditional phone alarms are often reflexively dismissed or snoozed while half-asleep without the patient actually getting out of bed or taking their medication.

I engineered **DoseTrack** specifically for a multi-generational family (**Mother Sunita, Father Rajesh, Grandfather Ramesh, Grandmother Kamla, Daughter Alina, and custom family members**).

### Problems Solved
1. **Full-Width Edge-to-Edge System Headers & Footers:** Modern, professional full-width header and footer spanning 100% of viewport width across all pages (Home, About, Login, and Dashboard).
2. **Modular Code Architecture & Professional Folder Structure:** Separate HTML templates and JavaScript files for every page (`index.html` + `home.js`, `about.html` + `about.js`, `login.html` + `login.js`, `dashboard.html` + `dashboard.js`, `alarm.js`, and `api.js`).
3. **PIN-Free Authentication & Streamlined Onboarding:**
   - Sign In uses pure **Username and Password** (zero PIN interface or keypad friction), complete with 1-click quick demo buttons.
   - Registration asks strictly for **First Name, Second Name, Gender, Age, Username, and Password** (6 fields only).
   - Post-registration automatically transitions to an onboarding modal on the dashboard for secondary health biometrics (Weight, Height, Blood Group, Doctor, Notes), Primary Family Admin designation, and initial medication setup.
4. **Stationary 100vh Screen-Height Sidebar Dashboard:** A desktop dashboard layout where the sidebar is exactly `100vh` and remains completely fixed in place while the dashboard body content scrolls independently.
5. **Dashboard Top Header with Notification & Profile Popovers:**
   - Notification button with count badge opening a popover holder showing upcoming and pending reminders.
   - Profile button opening a popover card showing Full Name, @username, role badge, Admin status, biometrics summary (Age, Gender, Weight, Height, Blood Group), Physician, Clinical Notes, and a prominent Logout button.
6. **Cross-Family Medication Transparency with Primary Admin Oversight:** A centralized view where any member or designated Primary Admin can inspect the medications, biometrics, timing, and today's taken/pending status of every family member on a single page.
7. **Alarm with 2 Math Puzzles to Stop:** An integrated audio reminder powered by the Web Audio API. To prevent absent-minded dismissal, the alarm cannot be turned off until the user correctly solves two dynamic arithmetic problems (addition and multiplication), guaranteeing cognitive alertness before ingesting medication.
8. **Deterministic Clinical Health Companion:** Grounded answers to urgent clinical questions (missed dose triage, CYP3A4 grapefruit interactions with statins, and spacing requirements between calcium and thyroid hormone), plus in-dashboard collapsible FAQs.

---

## Demo

- **Live Service URL:** [Provide your deployed Render URL here, e.g., https://dosetrack-ai.onrender.com]
- **Local Port:** Accessible at `http://localhost:8000`
- **Source Code Repository:** [Provide your GitHub Repository URL here]

### Interface Highlights
- **Public Homepage:** Hero card, 6 clinical feature cards, 4-step workflow, caregiver polypharmacy story, collapsible FAQs, and full-width multi-column footer.
- **Dedicated About Page:** In-depth clinical context, admin role description, and collapsible FAQs.
- **Dedicated Login & Registration Portal:** Dual tabs for sign-in vs new registration, 1-click demo profiles, zero PIN interface.
- **Sidebar-Driven Dashboard:** Fixed 100vh stationary sidebar, top header with notification and profile popovers, daily medication timeline, primary admin status indicators, and cognitive math alarm challenge.

---

## Code

The complete source code is hosted on GitHub:
```
https://github.com/your-username/dosetrack-ai
```

### Stack Breakdown
- **Backend:** Python 3, FastAPI, Uvicorn (Render-ready asynchronous service).
- **Frontend:** Semantic HTML5, CSS3 Custom Properties Design System, Modern Vanilla JavaScript (ES6+).
- **Audio Engine:** Web Audio API synthesis generating alarm beeps natively in the browser without third-party audio files.
- **Data Persistence:** Local JSON Health Vault (`family_health_vault.json`). Zero external database requirement.
- **Clinical AI Engine:** Open-source deterministic clinical entity parser and triage module (`core/ai_engine.py`).

---

## How I Built It

DoseTrack was built during the Hacktoberfest weekend challenge within a 4-hour sprint, adhering to lightweight software engineering principles:

1. **Lightweight and Reliable Tech Stack:** Instead of relying on heavyweight frameworks or complex browser runtimes, the application uses pure Python (FastAPI) and clean web standards (HTML5/CSS3/Vanilla JS). Memory utilization remains under 45MB RAM, ensuring seamless deployment on cloud free-tiers such as Render.
2. **Cognitive Alarm Dismissal Mechanism:** Built using native browser audio synthesis coupled with dynamic math verification logic. The alarm forces mental engagement through two random arithmetic challenges, ensuring the patient is awake before taking their prescription.
3. **Multi-Member Role-Based Architecture:** Engineered an intuitive authentication and registration layer enabling family members to maintain individual schedules while providing complete cross-care transparency across the household.

---

## Why Does Open Innovation Matter?

In personal healthcare and elder family care, **open-source innovation is the only ethical approach:**

### 1. Absolute Health Privacy and Zero Telemetry
Prescription regimens expose intimate clinical vulnerabilities, including cardiovascular disease, psychiatric therapies, metabolic disorders, and cognitive decline. Submitting a family's health profile to closed commercial cloud APIs exposes sensitive medical data to corporate server logging, retention policies, model training pipelines, and commercial tracking.
With DoseTrack, **all data persistence and clinical parsing execute 100% locally on the host device.** Private family health records never leave the household.

### 2. High Reliability and Local Portability
A parent's blood pressure reminder cannot be dependent on third-party cloud outages, subscription paywalls, or broadband drops. DoseTrack runs offline on a household laptop or local home server, continuing to trigger audio reminders and evaluate arithmetic puzzle solutions without external connectivity.

### 3. Infinite Extensibility and Zero SaaS Lock-In
Commercial medical apps frequently enforce arbitrary paywalls for adding multiple family members or exporting records. By publishing DoseTrack under an open-source license, any developer or caregiver can adapt the scheduling logic, translate interface strings into regional languages, or integrate with hardware pill dispensers.

---

## What I Learned

Building for elderly parents and grandparents requires a complete paradigm shift from standard software engineering:

- **Accessibility over Novelty:** Seniors do not want complex navigation trees. Clear typography, high-contrast badges, full-width layouts, and intuitive controls eliminate cognitive fatigue.
- **Verification over Notification:** Alarms that can be swiped away with half an eye open are clinically ineffective. Forcing active prefrontal cortex engagement via arithmetic math puzzles changes the behavioral dynamic from passive alarm dismissal to conscious therapy adherence.
- **Zero-Emoji Professionalism:** In healthcare, crisp typography, clean status badges, and precise terminology convey medical credibility and reassurance to anxious family caregivers.
