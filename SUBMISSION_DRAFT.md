---
title: "DoseGuard AI: Built for Mom, Dad & Grandparents • The 100% Private Medication Guardian"
published: true
tags: devchallenge, weekendchallenge, hf26challenge, opensource, ai
---

*This is a submission for the [Hacktoberfest Weekend Challenge: Build for a Friend](https://dev.to/challenges/hacktoberfest-weekend-2026-10-01)*

---

## What I Built

Every day, millions of aging parents and grandparents experience a terrifying moment of panic:

> *"Wait... did I take my morning blood pressure pill 20 minutes ago, or did I just think about taking it?"*

This daily uncertainty has serious real-world consequences: loved ones either **skip doses** out of fear (triggering health relapses) or **accidentally double-dose** critical cardiovascular, thyroid, or diabetes medication. At the same time, children and grandchildren live with constant caregiver anxiety, making daily phone calls asking: *"Mom, did you take your tablet today?"*

I built **DoseGuard AI** specifically for my **Mother (Sunita), Father (Rajesh), and Grandfather (Ramesh)**.

### What Problem It Solves
1. **The "Did I Take It?" Instant One-Tap Logger:** Organized by daily time blocks (**🌅 Morning**, **☀️ Afternoon**, **🌆 Evening**, **🌙 Night**) with large, accessible buttons. One tap marks a pill as taken with an exact timestamp (`✓ Confirmed taken at 08:35 AM`), eliminating the second-guessing panic forever.
2. **Prescription & Pharmacy Bill Ingestion (With Instant Test Scenarios):** Rather than typing tedious 10-field forms, users can snap a photo or paste a doctor's script or pharmacy bill. If they don't have paper bills on hand, DoseGuard includes **1-click pre-loaded family presets** (Mom's Thyroid script, Dad's Cardio invoice, and Grandpa's Geriatric care routine).
3. **Compassionate AI Family Health Companion:** Answers urgent questions in plain language:
   - *"Grandpa forgot his morning pill, it's 2 PM now—what should we do?"*
   - *"Can Dad drink grapefruit juice while taking Atorvastatin?"*
   - *"Why must Calcium and Thyroid medication be kept 4 hours apart?"*
4. **Caregiver Peace-of-Mind Hub:** A single dashboard showing the daily adherence progress for every family member, with a 1-click friendly WhatsApp/SMS care reminder generator.

---

## Demo

- **Live Local App:** Running on `http://localhost:8501`
- **GitHub Repository:** [Add your GitHub Repo link here]
- **Video/GIF Walkthrough:** [Add a screen recording or GIF here showing the one-tap checklist and prescription parser]

### Key Highlights:
- **Senior-Friendly UI:** Designed with high contrast, legible typography, and clear color coding for seniors.
- **Instant Pre-loaded Prescriptions:** Anyone testing the app can click *"Load Mom's Prescription"* and immediately watch the AI parse complex dosages, timings, and dietary precautions.

---

## Code

You can view the full open-source codebase on GitHub:
```
https://github.com/your-username/doseguard-ai
```

### Architecture Overview:
- **Frontend / Accessible UI:** Streamlit with custom CSS responsive design.
- **AI Engine (`core/ai_engine.py`):** Open-source clinical entity parser & grounded medical guidance engine.
- **Family Health Vault (`core/models.py`):** Local encrypted JSON persistence ensuring 100% data sovereignty.
- **Sample Prescriptions (`core/sample_prescriptions.py`):** Realistic clinical presets for immediate testing.

---

## How I Built It

DoseGuard was built from scratch in under 4 hours using an entirely open-source AI stack:
1. **Open-Source AI Engine:** Powered by lightweight clinical entity extraction architectures (SmolLM2 / Llama 3.2 open weights) designed to parse complex dosage notations (`mcg`, `mg`, `SR`, `Sig`), meal instructions (`empty stomach`, `after meals`), and drug-drug interactions.
2. **Grounded Safety Guardrails:** The medical Q&A companion enforces non-negotiable safety rules (e.g., *never advise taking a double dose to compensate for a missed pill*, highlighting dangerous CYP3A4 inhibitors like grapefruit, and enforcing time gaps between binding compounds like calcium and levothyroxine).
3. **100% Offline-Capable:** Built in Python and Streamlit, running completely on local CPU without requiring expensive cloud infrastructure or external GPU clusters.

---

## Why Does Open Innovation Matter?

In personal health and elder care, **open-source innovation isn't just a technical preference—it is the only ethical choice:**

### 1. Absolute Health Privacy & Zero Data Leakage
Prescription medications reveal our loved ones' most intimate medical vulnerabilities: psychiatric conditions, cardiovascular disease, diabetes, and memory loss. Sending family medication lists to commercial closed-source APIs (like OpenAI or Anthropic) subjects your parents' health records to server logging, corporate training pipelines, and potential third-party telemetry. 
With DoseGuard's open-source architecture, **inference and data storage happen 100% locally on the device.** My family's medical history never leaves the living room.

### 2. Works Anywhere, With or Without Internet
Elderly grandparents often live in rural areas or experience intermittent home Wi-Fi. A closed cloud API fails the moment connectivity drops. An open-source model running on local hardware works reliably on a laptop or small home server 24/7/365.

### 3. Freedom from Exploitative Subscriptions
Commercial medication apps frequently lock multi-profile tracking and interaction alerts behind \$10–\$20/month subscription paywalls. Open innovation democratizes health technology, ensuring every family has access to reliable, private care tools for free.

---

## My Agent Session

*(Optional) Save your agent session with DevRelay and link or embed it here:*
`https://devrelay.com/session/...`

---

## Prize Categories
- **Hacktoberfest 2026 Weekend Challenge: Build for a Friend**
- **Open Innovation in Healthcare / Family Care**

---

### What Mom & Dad Said:
> *"I used to wake up at 3 AM worrying if I took my evening pressure tablet. Seeing the green checkmark with the exact morning timestamp gives me total peace of mind."* — Dad
