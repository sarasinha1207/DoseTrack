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

  async getProfile(profileId) {
    const res = await fetch(`/api/profiles/${profileId}`);
    if (!res.ok) throw new Error("Failed to load profile details");
    return await res.json();
  },

  async createProfile(data) {
    const res = await fetch("/api/profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to create profile");
    return await res.json();
  },

  async markTaken(profileId, medId, takenBy = "Family Caregiver") {
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

  async batchAddMedications(profileId, medications) {
    const res = await fetch("/api/medications/batch-add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile_id: profileId, medications: medications })
    });
    if (!res.ok) throw new Error("Failed to batch save medications");
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

  async uploadPrescription(formData) {
    const res = await fetch("/api/prescription/upload", {
      method: "POST",
      body: formData
    });
    if (!res.ok) throw new Error("Failed to upload document");
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
  }
};
