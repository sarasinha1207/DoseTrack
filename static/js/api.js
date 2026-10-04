/**
 * DoseGuard AI - API Client Layer
 * Handles async communication with the FastAPI backend.
 * Zero emojis.
 */

const API = {
  async getProfiles() {
    const res = await fetch("/api/profiles");
    if (!res.ok) throw new Error("Failed to load profiles");
    return await res.json();
  },

  async login(username, password) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, password: password })
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || "Invalid credentials");
    }
    return await res.json();
  },

  async register(registerData) {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registerData)
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || "Failed to register family member");
    }
    return await res.json();
  },

  async completeOnboarding(onboardingData) {
    const res = await fetch("/api/profiles/complete-onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(onboardingData)
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || "Failed to save health profile details");
    }
    return await res.json();
  },

  async getProfile(profileId) {
    const res = await fetch(`/api/profiles/${profileId}`);
    if (!res.ok) throw new Error("Failed to load profile details");
    return await res.json();
  },

  async updateProfile(profileData) {
    const res = await fetch("/api/profiles/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileData)
    });
    if (!res.ok) throw new Error("Failed to update profile biometrics");
    return await res.json();
  },

  async getAllFamilyMedications() {
    const res = await fetch("/api/family/all-medications");
    if (!res.ok) throw new Error("Failed to load family medications");
    return await res.json();
  },

  async markTaken(profileId, medId, takenBy = "Self") {
    const res = await fetch("/api/medications/mark-taken", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile_id: profileId, med_id: medId, taken_by: takenBy })
    });
    if (!res.ok) throw new Error("Failed to mark medication as taken");
    return await res.json();
  },

  async unmarkTaken(profileId, medId) {
    const res = await fetch("/api/medications/unmark-taken", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile_id: profileId, med_id: medId })
    });
    if (!res.ok) throw new Error("Failed to revert medication status");
    return await res.json();
  },

  async addMedication(medData) {
    const res = await fetch("/api/medications/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(medData)
    });
    if (!res.ok) throw new Error("Failed to add medication");
    return await res.json();
  },

  async deleteMedication(profileId, medId) {
    const res = await fetch(`/api/medications/${profileId}/${medId}`, {
      method: "DELETE"
    });
    if (!res.ok) throw new Error("Failed to delete medication");
    return await res.json();
  },

  async getSamples() {
    const res = await fetch("/api/samples");
    if (!res.ok) throw new Error("Failed to load sample prescriptions");
    return await res.json();
  },

  async parsePrescription(text, sampleKey = null) {
    const res = await fetch("/api/prescription/parse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text, sample_key: sampleKey })
    });
    if (!res.ok) throw new Error("Failed to parse prescription text");
    return await res.json();
  },

  async askCompanion(profileId, question) {
    const res = await fetch("/api/chat/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile_id: profileId, question: question })
    });
    if (!res.ok) throw new Error("Failed to query companion");
    return await res.json();
  },

  async exportVault() {
    const res = await fetch("/api/export");
    if (!res.ok) throw new Error("Failed to export vault data");
    return await res.json();
  },

  async getVitals(profileId = null) {
    const query = profileId && profileId !== "all" ? `?profile_id=${encodeURIComponent(profileId)}` : "";
    const res = await fetch(`/api/vitals${query}`);
    if (!res.ok) throw new Error("Failed to load health vitals records");
    return await res.json();
  },

  async addVital(vitalData) {
    const res = await fetch("/api/vitals/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vitalData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to save vital reading");
    }
    return await res.json();
  },

  async deleteVital(vitalId) {
    const res = await fetch(`/api/vitals/${vitalId}`, {
      method: "DELETE"
    });
    if (!res.ok) throw new Error("Failed to delete vital reading");
    return await res.json();
  },

  async getCalendarAdherence(month = null) {
    const query = month ? `?month=${encodeURIComponent(month)}` : "";
    const res = await fetch(`/api/calendar/adherence${query}`);
    if (!res.ok) throw new Error("Failed to load calendar adherence records");
    return await res.json();
  }
};
