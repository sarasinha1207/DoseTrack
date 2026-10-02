# 💊 DoseGuard AI — Family Medication Guardian
> **Built for Mom, Dad, and Grandparents** • Powered by Local Open-Source AI • 100% Private Health Vault

*A submission for the [Hacktoberfest Weekend Challenge: Build for a Friend / Loved One](https://dev.to/challenges/hacktoberfest-weekend-2026-10-01)*

---

## 👵 The Real Human Story: Why I Built This
Forgetting or losing track of daily medication is one of the most common and dangerous struggles for aging parents and grandparents:
- **"Did I already take my morning tablet?"** This daily panic leads to either skipped doses (causing health relapses) or dangerous accidental double-dosing of blood pressure, thyroid, or diabetes medication.
- **Complex, Contradictory Regimens:** Mom's thyroid tablet must be taken on an empty stomach 45 minutes before tea, while her calcium supplement must be taken after lunch (at least 4 hours apart). Dad takes Metformin twice daily with meals and Atorvastatin at bedtime. Grandparents need large-print instructions and gentle reassurance.
- **High-Friction Existing Apps:** Commercial apps require tedious 15-field forms and bombard users with ads, paywalls, and notifications that seniors find confusing.
- **Caregiver Anxiety:** Living in a separate room or different city means constantly making anxious phone calls: *"Mom, Dad, did you take your pressure medicine today?"*

**DoseGuard AI** was built to solve this for our loved ones: a senior-friendly, one-tap visual checklist, instant prescription & pharmacy bill extraction, and a caregiver peace-of-mind dashboard.

---

## ✨ Key Features

### 1. 🕒 One-Tap "Did I Take It?" Checklist
- Organized by daily time slots: **🌅 Morning**, **☀️ Afternoon**, **🌆 Evening**, and **🌙 Night**.
- Large, high-contrast buttons designed for senior eyes.
- One-click **"Mark as Taken"** records the exact timestamp (e.g., *"Confirmed taken at 08:35 AM by Mom"*), completely eliminating double-dosing panic.

### 2. 📸 Open-Source AI Prescription & Medical Bill Parser
- No bills or paper prescriptions right now? **Includes instant 1-click test scenarios**:
  - 👩 **Mom's Thyroid & Bone Health Script**
  - 👨 **Dad's Cardio & Diabetes Pharmacy Invoice**
  - 👴 **Grandpa's Geriatric Care & Eye Routine**
- Upload a photo or paste a doctor's script: the open AI engine automatically extracts drug names, dosages, frequencies, food timings, and safety cautions.

### 3. 💬 AI Family Health Companion (100% Offline & Grounded)
- Compassionate, clear answers to everyday worries:
  - *"Grandpa forgot his morning blood pressure tablet, it's 2 PM now—what should we do?"*
  - *"Can Dad drink grapefruit juice while on Atorvastatin?"*
  - *"Why must Calcium and Thyroid tablets be kept 4 hours apart?"*
- Grounded in strict clinical safety rules (never double dose, time thresholds, dietary interactions).

### 4. 🛡️ Caregiver Peace-of-Mind Hub
- Glanceable multi-profile overview of Mom, Dad, Grandma, and Grandpa.
- Automatic one-click WhatsApp/SMS caring message generator (*"Hi Dad! Just a gentle reminder to take your night meds with warm water. Love you! ❤️"*).
- Export complete medication summaries for their next doctor's consultation.

---

## 🔒 Why Open Innovation Matters
In health and family care, open-source AI is not just an alternative—it is **the only ethical approach**:

1. **Zero Health-Data Leakage (Extreme Privacy):** Prescriptions reveal intimate medical conditions (cardiovascular issues, mental health, diabetes, neurological conditions). Sending a parent's prescription history to closed commercial APIs (OpenAI, Anthropic, Google) exposes them to corporate data retention, ad profiling, and potential insurance discrimination. DoseGuard's open-source architecture runs **100% locally on the device**—private family health records never leave home hardware.
2. **Offline Reliability in Rural Homes:** Medication adherence doesn't stop when internet connections fail. DoseGuard runs completely offline on any laptop or local machine.
3. **No Subscription Paywalls:** Lifesaving medication reminders and interaction checks should be accessible to every family, not locked behind a \$15/month corporate subscription.

---

## 🚀 Quickstart & Installation

### Prerequisites
- Python 3.10+
- Pip

### 1. Clone & Install
```bash
git clone https://github.com/your-username/doseguard-ai.git
cd doseguard-ai
pip install -r requirements.txt
```

### 2. Run the Web Application
```bash
streamlit run app.py
```
Open your browser at `http://localhost:8501`.

---

## 📁 Project Architecture
```
Challenge-1/
├── app.py                      # Main Streamlit web application & senior UI
├── core/
│   ├── models.py               # Local JSON vault & profile persistence
│   ├── ai_engine.py            # Open-source clinical extraction & Q&A
│   └── sample_prescriptions.py # Pre-loaded Mom, Dad, & Grandpa prescriptions
├── family_health_vault.json    # 100% local, encrypted family health store
├── requirements.txt            # Dependency manifest
└── README.md                   # Documentation
```
