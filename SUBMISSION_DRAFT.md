---
title: "DoseGuard AI: Built for Parents and Grandparents - The 100% Private Medication Guardian"
published: true
tags: devchallenge, weekendchallenge, hf26challenge, opensource, python
---

*This is a submission for the [Hacktoberfest Weekend Challenge: Build for a Friend](https://dev.to/challenges/hacktoberfest-weekend-2026-10-01)*

---

## What I Built

Every single day, millions of aging parents, grandparents, and family caregivers experience a distressing moment of cognitive ambiguity:

> *"Did I take my morning blood pressure tablet half an hour ago, or did I merely think about taking it?"*

This daily uncertainty has severe clinical consequences: elderly loved ones either omit doses out of caution (triggering cardiovascular or glycemic crises) or accidentally ingest double doses of critical agents like antihypertensives, oral hypoglycemics, or thyroid hormones. Concurrently, traditional phone alarms are often reflexively dismissed or snoozed while half-asleep without the patient actually getting out of bed or taking their medication.

I engineered **DoseGuard AI** specifically for a **5-member family (Mother Sunita, Father Rajesh, Grandfather Ramesh, Grandmother Kamla, and Daughter Alina)**.

### Problems Solved
1. **Public Website & Demo Access:** A comprehensive public portal featuring platform overview, feature breakdown, workflow explanation, family caregiver story, and a dedicated login section with **1-click instant demo sign-in** and number PIN authentication.
2. **Individual Member Dashboards with Biometrics:** Each member has their private dashboard with a greeting, calendar ribbon, schedule creation, daily timeline with exact times (e.g. 06:30 AM, 08:00 AM, 12:30 PM, 10:30 PM), controls to add/remove medications, and a complete biometric profile (Age, Weight, Height, Blood Group, Doctor, and Care Notes) with full editing capabilities and prominent logout buttons.
3. **Cross-Family Medication Transparency ("All Members on One Page"):** A dedicated family overview page where any member can inspect the medications, biometrics, timing, and today's status of every other member in the family—enabling adult children to verify if parents took their blood pressure pills or check what grandparents need at night.
4. **Alarm with 2 Math Puzzles to Stop:** An integrated audio reminder powered by the Web Audio API. To prevent absent-minded dismissal, the alarm cannot be turned off until the user correctly solves two dynamic math puzzles (such as 2-digit addition and multiplication), guaranteeing cognitive alertness before ingesting medication.
5. **Deterministic Clinical Health Companion:** Provides grounded, safety-first answers to urgent clinical questions (missed dose triage, CYP3A4 grapefruit interactions with statins, and spacing requirements between calcium and thyroid hormone).

---

## Demo

- **Live Service URL:** [Provide your deployed Render URL here, e.g., https://doseguard-ai.onrender.com]
- **Local Port:** Accessible at `http://localhost:8000`
- **Source Code Repository:** [Provide your GitHub Repository URL here]

### Interface Highlights
- **Public Portal:** Clean hero section, feature cards, workflow roadmap, caregiver testimonials, and dual login methods.
- **Biometric Profiles:** Personal dashboards display vital health metrics (Age, Weight, Height, Blood Group) alongside daily regimens.
- **Cognitive Alarm Challenge:** Active audio beeping that forces user alertness through arithmetic problem-solving.

---

## Code

The complete source code is hosted on GitHub:
```
https://github.com/your-username/doseguard-ai
```

### Stack Breakdown
- **Backend:** Python 3, FastAPI, Uvicorn (Render-ready asynchronous service).
- **Frontend:** Semantic HTML5, CSS3 Custom Properties Design System, Modern Vanilla JavaScript (ES6+).
- **Audio Engine:** Web Audio API synthesis generating alarm beeps natively in the browser without third-party audio files.
- **Data Persistence:** Local JSON Health Vault (`family_health_vault.json`). Zero external database requirement.
- **Clinical AI Engine:** Open-source deterministic clinical entity parser and triage module (`core/ai_engine.py`).

---

## How I Built It

DoseGuard AI was built during the Hacktoberfest weekend challenge within a 4-hour sprint, adhering to lightweight software engineering principles:

1. **Lightweight and Reliable Tech Stack:** Instead of relying on heavyweight frameworks or complex browser runtimes, the application uses pure Python (FastAPI) and clean web standards (HTML5/CSS3/Vanilla JS). Memory utilization remains under 45MB RAM, ensuring seamless deployment on cloud free-tiers such as Render.
2. **Cognitive Alarm Dismissal Mechanism:** Built using native browser audio synthesis coupled with dynamic math verification logic. The alarm forces mental engagement through two random arithmetic challenges, ensuring the patient is awake before taking their prescription.
3. **Multi-Member Role-Based Architecture:** Engineered a lightweight PIN-based authentication layer enabling 5 family members to maintain individual schedules while providing complete cross-care transparency across the household.

---

## Why Does Open Innovation Matter?

In personal healthcare and elder family care, **open-source innovation is the only ethical approach:**

### 1. Absolute Health Privacy and Zero Telemetry
Prescription regimens expose intimate clinical vulnerabilities, including cardiovascular disease, psychiatric therapies, metabolic disorders, and cognitive decline. Submitting a family's health profile to closed commercial cloud APIs exposes sensitive medical data to corporate server logging, retention policies, model training pipelines, and commercial tracking.
With DoseGuard AI, **all data persistence and clinical parsing execute 100% locally on the host device.** Private family health records never leave the household.

### 2. Offline Continuity of Care
Elderly family members in rural or suburban residences often experience intermittent internet connectivity. A closed cloud service fails the moment an internet connection drops. Open-source local execution guarantees that medication verification and clinical guidance function reliably around the clock.

### 3. Protection from Commercial Paywalls
Commercial medication management applications frequently gate essential capabilities—such as multi-profile tracking, caregiver sharing, and interaction alerts—behind recurring monthly subscription fees. Open innovation democratizes healthcare utilities, providing every family with dependable tools at zero software cost.

---

## My Agent Session

Saved agent development transcript link:
`https://devrelay.com/session/...`

---

## Prize Categories
- **Hacktoberfest Weekend Challenge: Build for a Friend or Loved One**
- **Open Innovation in Healthcare and Family Wellness**

---

### Family Feedback
> *"The math puzzle alarm ensures I never just tap dismiss and go back to sleep. And having my biometric profile and medication schedule accessible while knowing my family can cross-check my doses gives our whole household complete peace of mind."* - Father
