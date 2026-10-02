/**
 * DoseGuard AI - Frontend Controller
 * Coordinates UI rendering, profile switching, checklist updates, and AI workflows.
 * Strictly no emojis. Clean professional clinical interaction.
 */

let appState = {
  profiles: [],
  currentProfileId: null,
  currentProfileData: null,
  adherence: { total: 0, taken: 0, percentage: 0 },
  samples: {},
  extractedMedsCache: [],
  activeTab: "routine"
};

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", () => {
  initApp();
  setupEventListeners();
});

async function initApp() {
  try {
    const data = await API.getProfiles();
    appState.profiles = data.profiles;
    if (appState.profiles.length > 0) {
      appState.currentProfileId = appState.profiles[0].id;
    }
    renderProfilesBar();
    await loadCurrentProfile();
    await loadSamples();
    renderCaregiverHub(data.caregiver_summary);
  } catch (err) {
    showToast("Error loading family vault data.");
    console.error(err);
  }
}

function setupEventListeners() {
  // Tab Switching
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab");
      switchTab(tabId);
    });
  });

  // Add Medication Modal
  const openAddMedBtn = document.getElementById("btn-open-add-med");
  if (openAddMedBtn) {
    openAddMedBtn.addEventListener("click", () => openModal("modal-add-med"));
  }

  // Add Member Modal
  const openAddMemberBtn = document.getElementById("btn-open-add-member");
  if (openAddMemberBtn) {
    openAddMemberBtn.addEventListener("click", () => openModal("modal-add-member"));
  }

  // Close Modal Buttons
  document.querySelectorAll(".modal-close-btn, .modal-cancel-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const modal = btn.closest(".modal-overlay");
      if (modal) modal.classList.remove("active");
    });
  });

  // Submit Add Medication Form
  const formAddMed = document.getElementById("form-add-med");
  if (formAddMed) {
    formAddMed.addEventListener("submit", handleAddMedicationSubmit);
  }

  // Submit Add Profile Form
  const formAddMember = document.getElementById("form-add-member");
  if (formAddMember) {
    formAddMember.addEventListener("submit", handleAddMemberSubmit);
  }

  // Parse Prescription Text Button
  const btnParseText = document.getElementById("btn-parse-text");
  if (btnParseText) {
    btnParseText.addEventListener("click", handleParsePrescription);
  }

  // Batch Save Extracted Meds Button
  const btnSaveExtracted = document.getElementById("btn-save-extracted");
  if (btnSaveExtracted) {
    btnSaveExtracted.addEventListener("click", handleSaveExtractedMeds);
  }

  // Prescription File Upload
  const fileInput = document.getElementById("file-prescription-upload");
  if (fileInput) {
    fileInput.addEventListener("change", handleFileUpload);
  }

  // Companion Chat Submit
  const btnAskCompanion = document.getElementById("btn-ask-companion");
  if (btnAskCompanion) {
    btnAskCompanion.addEventListener("click", handleAskCompanion);
  }

  // Export Vault Button
  const btnExport = document.getElementById("btn-export-vault");
  if (btnExport) {
    btnExport.addEventListener("click", handleExportVault);
  }

  // Copy Caregiver Message Button
  const btnCopyMessage = document.getElementById("btn-copy-caregiver-msg");
  if (btnCopyMessage) {
    btnCopyMessage.addEventListener("click", handleCopyCaregiverMessage);
  }
}

function switchTab(tabId) {
  appState.activeTab = tabId;
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-tab") === tabId);
  });
  document.querySelectorAll(".tab-content").forEach(panel => {
    panel.classList.toggle("active", panel.id === `tab-${tabId}`);
  });
}

function renderProfilesBar() {
  const container = document.getElementById("profiles-list-container");
  if (!container) return;

  container.innerHTML = "";
  appState.profiles.forEach(p => {
    const btn = document.createElement("button");
    btn.className = `profile-card-btn ${p.id === appState.currentProfileId ? "active" : ""}`;
    btn.innerHTML = `
      <div class="profile-avatar">${p.initials || p.role.substring(0, 2).toUpperCase()}</div>
      <div>
        <div class="profile-info-name">${escapeHtml(p.name)}</div>
        <div class="profile-info-role">${escapeHtml(p.role)} (${p.age} yrs)</div>
      </div>
    `;
    btn.addEventListener("click", () => selectProfile(p.id));
    container.appendChild(btn);
  });

  const addBtn = document.createElement("button");
  addBtn.className = "add-profile-btn";
  addBtn.id = "btn-open-add-member";
  addBtn.innerHTML = `
    <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <path d="M12 5v14M5 12h14"></path>
    </svg>
    Add Family Member
  `;
  addBtn.addEventListener("click", () => openModal("modal-add-member"));
  container.appendChild(addBtn);
}

async function selectProfile(profileId) {
  appState.currentProfileId = profileId;
  renderProfilesBar();
  await loadCurrentProfile();
  refreshCaregiverHub();
}

async function loadCurrentProfile() {
  if (!appState.currentProfileId) return;
  try {
    const res = await API.getProfile(appState.currentProfileId);
    appState.currentProfileData = res.profile;
    appState.adherence = res.adherence;
    
    renderAdherenceOverview();
    renderRoutineChecklist();
    updateCaregiverMessage();
    updateChatSuggestions();
  } catch (err) {
    showToast("Error retrieving profile details.");
    console.error(err);
  }
}

function renderAdherenceOverview() {
  const nameEl = document.getElementById("adherence-profile-name");
  const subEl = document.getElementById("adherence-profile-sub");
  const countEl = document.getElementById("adherence-ratio-text");
  const pctEl = document.getElementById("adherence-pct-text");
  const fillEl = document.getElementById("adherence-progress-fill");

  if (nameEl) nameEl.textContent = `${appState.currentProfileData.role} (${appState.currentProfileData.name})`;
  if (subEl) subEl.textContent = appState.currentProfileData.notes || "Standard Geriatric Regimen";

  const { total, taken, percentage } = appState.adherence;
  if (countEl) countEl.textContent = `${taken} of ${total} Doses Confirmed`;
  if (pctEl) pctEl.textContent = `${percentage}%`;

  if (fillEl) {
    fillEl.style.width = `${percentage}%`;
    fillEl.classList.toggle("complete", percentage === 100 && total > 0);
  }
}

function renderRoutineChecklist() {
  const container = document.getElementById("routine-schedule-container");
  if (!container) return;

  const meds = appState.currentProfileData.medications || [];
  const activeMeds = meds.filter(m => m.active !== false);

  if (activeMeds.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; color: var(--slate-500);">
        <p style="font-weight: 600; margin-bottom: 8px;">No active medications configured for this profile.</p>
        <p style="font-size: 0.88rem;">Use the "Prescription & Bill Ingestion" tab to load clinical records or add medications manually.</p>
      </div>
    `;
    return;
  }

  const slots = [
    { key: "Morning", title: "Morning (Breakfast and Early Hours)" },
    { key: "Afternoon", title: "Afternoon (Lunch and Midday)" },
    { key: "Evening", title: "Evening (Dinner and Early Night)" },
    { key: "Night", title: "Night (Bedtime Schedule)" }
  ];

  const todayStr = new Date().toISOString().split("T")[0];
  const logs = appState.currentProfileData.logs?.[todayStr] || {};

  let html = "";

  slots.forEach(slot => {
    const slotMeds = activeMeds.filter(m => m.timing === slot.key);
    if (slotMeds.length > 0) {
      html += `
        <div class="time-slot">
          <div class="time-slot-title">
            <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            ${slot.title} (${slotMeds.length})
          </div>
      `;

      slotMeds.forEach(med => {
        const logEntry = logs[med.id];
        const isTaken = !!logEntry;

        html += `
          <div class="medication-card ${isTaken ? "taken" : ""}">
            <div class="medication-details">
              <div class="medication-title-row">
                <span class="medication-name">${escapeHtml(med.name)}</span>
                <span class="pill-badge pill-dosage">${escapeHtml(med.dosage || "1 Unit")}</span>
                <span class="pill-badge pill-purpose">${escapeHtml(med.purpose || "Prescribed Regimen")}</span>
              </div>
              <div class="medication-instruction">
                <strong>Administration:</strong> ${escapeHtml(med.food_instruction || "Take with water")}
              </div>
              ${med.caution ? `<div class="medication-caution">Clinical Precaution: ${escapeHtml(med.caution)}</div>` : ""}
              ${isTaken ? `<div class="medication-timestamp">Confirmed taken at ${logEntry.timestamp} (${logEntry.taken_by || "Caregiver"})</div>` : ""}
            </div>
            <div>
              ${!isTaken ? `
                <button class="btn btn-primary" onclick="handleMarkTaken('${med.id}')">
                  <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Mark as Taken
                </button>
              ` : `
                <button class="btn btn-secondary" onclick="handleUnmarkTaken('${med.id}')">
                  Revert Status
                </button>
              `}
              <button class="btn btn-outline-danger" style="margin-left: 6px;" onclick="handleDeleteMedication('${med.id}')" title="Delete Medication">
                Delete
              </button>
            </div>
          </div>
        `;
      });

      html += `</div>`;
    }
  });

  container.innerHTML = html;
}

async function handleMarkTaken(medId) {
  try {
    const res = await API.markTaken(appState.currentProfileId, medId, "Family Caregiver");
    showToast("Status recorded: Dose confirmed.");
    await loadCurrentProfile();
    refreshCaregiverHub();
  } catch (err) {
    showToast("Failed to record confirmation.");
    console.error(err);
  }
}

async function handleUnmarkTaken(medId) {
  try {
    const res = await API.unmarkTaken(appState.currentProfileId, medId);
    showToast("Status reverted: Dose set to pending.");
    await loadCurrentProfile();
    refreshCaregiverHub();
  } catch (err) {
    showToast("Failed to revert confirmation.");
    console.error(err);
  }
}

async function handleDeleteMedication(medId) {
  if (!confirm("Are you sure you want to remove this medication from the profile?")) return;
  try {
    await API.deleteMedication(appState.currentProfileId, medId);
    showToast("Medication removed from profile.");
    await loadCurrentProfile();
    refreshCaregiverHub();
  } catch (err) {
    showToast("Failed to remove medication.");
    console.error(err);
  }
}

// Samples Loading
async function loadSamples() {
  try {
    appState.samples = await API.getSamples();
    renderSampleCards();
  } catch (err) {
    console.error("Failed to load sample clinical data", err);
  }
}

function renderSampleCards() {
  const container = document.getElementById("sample-prescriptions-grid");
  if (!container) return;

  container.innerHTML = "";
  Object.keys(appState.samples).forEach(key => {
    const s = appState.samples[key];
    const card = document.createElement("div");
    card.className = "sample-card";
    card.innerHTML = `
      <div>
        <div class="sample-card-title">${escapeHtml(s.title)}</div>
        <div class="sample-card-desc">${escapeHtml(s.subtitle)} - ${escapeHtml(s.patient)}</div>
      </div>
      <button class="btn btn-secondary" style="width: 100%; margin-top: 8px;">
        Load Sample Script
      </button>
    `;
    card.addEventListener("click", () => loadSampleIntoParser(key));
    container.appendChild(card);
  });
}

function loadSampleIntoParser(key) {
  const sample = appState.samples[key];
  if (!sample) return;

  const textarea = document.getElementById("prescription-raw-textarea");
  if (textarea) textarea.value = sample.raw_text;

  document.getElementById("loaded-sample-key").value = key;
  showToast(`Loaded: ${sample.title}`);
}

async function handleParsePrescription() {
  const textarea = document.getElementById("prescription-raw-textarea");
  const sampleKey = document.getElementById("loaded-sample-key").value || null;
  const text = textarea ? textarea.value.trim() : "";

  if (!text) {
    showToast("Please paste prescription text or select a sample above.");
    return;
  }

  const btn = document.getElementById("btn-parse-text");
  if (btn) btn.textContent = "Processing Extraction...";

  try {
    const res = await API.parsePrescription(text, sampleKey);
    appState.extractedMedsCache = res.medications;
    renderExtractedResults(res.source);
    showToast(`Successfully extracted ${res.medications.length} medication items.`);
  } catch (err) {
    showToast("Extraction error occurred.");
    console.error(err);
  } finally {
    if (btn) btn.textContent = "Extract Medications with Open-Source AI";
  }
}

async function handleFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  const statusEl = document.getElementById("upload-file-status");
  if (statusEl) statusEl.textContent = `Scanning: ${file.name}...`;

  try {
    const res = await API.uploadPrescription(formData);
    const textarea = document.getElementById("prescription-raw-textarea");
    if (textarea) textarea.value = res.raw_text;
    appState.extractedMedsCache = res.medications;
    renderExtractedResults(res.source);
    if (statusEl) statusEl.textContent = `File ingested: ${file.name}`;
    showToast("File processed and entities extracted.");
  } catch (err) {
    if (statusEl) statusEl.textContent = "Error scanning file.";
    showToast("File upload failed.");
    console.error(err);
  }
}

function renderExtractedResults(sourceName) {
  const container = document.getElementById("extracted-results-container");
  const saveBtn = document.getElementById("btn-save-extracted");
  if (!container) return;

  if (appState.extractedMedsCache.length === 0) {
    container.innerHTML = "";
    if (saveBtn) saveBtn.style.display = "none";
    return;
  }

  let html = `
    <div style="font-weight: 700; color: var(--slate-900); margin-bottom: 12px; font-size: 1rem;">
      Extracted Schedule (${appState.extractedMedsCache.length} items from ${escapeHtml(sourceName)}):
    </div>
  `;

  appState.extractedMedsCache.forEach((m, idx) => {
    html += `
      <div class="extracted-item">
        <div class="extracted-title">#${idx + 1}: ${escapeHtml(m.name)} (${escapeHtml(m.dosage)})</div>
        <div class="extracted-meta">
          <strong>Timing:</strong> ${escapeHtml(m.timing)} | 
          <strong>Administration:</strong> ${escapeHtml(m.food_instruction)}
        </div>
        <div class="extracted-meta" style="color: var(--warning); margin-top: 2px;">
          <strong>Clinical Caution:</strong> ${escapeHtml(m.caution)}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
  if (saveBtn) {
    saveBtn.style.display = "inline-flex";
    saveBtn.textContent = `Save Extracted Items to ${appState.currentProfileData.role}'s Schedule`;
  }
}

async function handleSaveExtractedMeds() {
  if (appState.extractedMedsCache.length === 0) return;
  try {
    await API.batchAddMedications(appState.currentProfileId, appState.extractedMedsCache);
    showToast(`Added ${appState.extractedMedsCache.length} medications to profile.`);
    appState.extractedMedsCache = [];
    renderExtractedResults("");
    await loadCurrentProfile();
    refreshCaregiverHub();
    switchTab("routine");
  } catch (err) {
    showToast("Failed to batch save medications.");
    console.error(err);
  }
}

// AI Companion Chat
function updateChatSuggestions() {
  const container = document.getElementById("chat-suggestions-container");
  if (!container || !appState.currentProfileData) return;

  const role = appState.currentProfileData.role;
  const name = appState.currentProfileData.name;

  container.innerHTML = "";
  const suggestions = [
    `${role} missed their morning medication, it is 2 PM now. What is the clinical directive?`,
    `Are there recognized food interactions with grapefruit juice, milk, or tea for ${role}?`,
    `What medications are scheduled for ${role} tonight?`,
    `Explain the rationale for maintaining a 4-hour interval between calcium and thyroid medication.`
  ];

  suggestions.forEach(q => {
    const chip = document.createElement("button");
    chip.className = "suggestion-chip";
    chip.textContent = q;
    chip.addEventListener("click", () => {
      const input = document.getElementById("input-chat-question");
      if (input) input.value = q;
      handleAskCompanion();
    });
    container.appendChild(chip);
  });
}

async function handleAskCompanion() {
  const input = document.getElementById("input-chat-question");
  const question = input ? input.value.trim() : "";
  if (!question) {
    showToast("Please enter or select a question.");
    return;
  }

  const box = document.getElementById("chat-response-box");
  if (box) {
    box.style.display = "block";
    box.textContent = "Consulting local clinical intelligence model...";
  }

  try {
    const res = await API.askCompanion(appState.currentProfileId, question);
    if (box) box.textContent = res.answer;
  } catch (err) {
    if (box) box.textContent = "Error receiving clinical guidance.";
    showToast("Failed to query companion.");
    console.error(err);
  }
}

// Caregiver Hub
function renderCaregiverHub(summaryList) {
  const container = document.getElementById("caregiver-cards-container");
  if (!container) return;

  container.innerHTML = "";
  (summaryList || []).forEach(item => {
    const card = document.createElement("div");
    card.className = `caregiver-card ${item.percentage === 100 && item.total > 0 ? "complete" : (item.taken > 0 ? "in-progress" : "")}`;
    card.innerHTML = `
      <div class="caregiver-card-initials">${item.initials}</div>
      <div class="caregiver-card-name">${escapeHtml(item.name)}</div>
      <div class="caregiver-card-role">${escapeHtml(item.role)}</div>
      <div class="caregiver-card-pct">${item.percentage}%</div>
      <div class="caregiver-card-status">${item.status}</div>
    `;
    container.appendChild(card);
  });
}

async function refreshCaregiverHub() {
  try {
    const data = await API.getProfiles();
    renderCaregiverHub(data.caregiver_summary);
  } catch (err) {
    console.error("Caregiver summary refresh failed", err);
  }
}

function updateCaregiverMessage() {
  const textarea = document.getElementById("caregiver-sms-textarea");
  if (!textarea || !appState.currentProfileData) return;

  const role = appState.currentProfileData.role;
  const name = appState.currentProfileData.name;
  const meds = appState.currentProfileData.medications || [];

  const todayStr = new Date().toISOString().split("T")[0];
  const logs = appState.currentProfileData.logs?.[todayStr] || {};
  const pending = meds.filter(m => m.active !== false && !logs[m.id]);

  if (pending.length > 0) {
    const pendingNames = pending.map(m => m.name).join(", ");
    textarea.value = `Hello ${role} (${name}), gentle reminder regarding your daily medication schedule. Remaining items for today: ${pendingNames}. Please ensure you take them with adequate room-temperature water. Let us know when completed.`;
  } else {
    textarea.value = `Hello ${role} (${name}), all prescribed medications for today have been confirmed as completed. Excellent adherence. Have a restful and healthy day.`;
  }
}

function handleCopyCaregiverMessage() {
  const textarea = document.getElementById("caregiver-sms-textarea");
  if (!textarea) return;

  textarea.select();
  navigator.clipboard.writeText(textarea.value).then(() => {
    showToast("Message copied to clipboard.");
  }).catch(() => {
    showToast("Could not copy message.");
  });
}

async function handleExportVault() {
  try {
    const data = await API.exportVault();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `doseguard_health_vault_${new Date().toISOString().split("T")[0]}.json`);
    dlAnchor.click();
    showToast("Vault exported successfully.");
  } catch (err) {
    showToast("Export failed.");
  }
}

// Modals & Form Submissions
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add("active");
}

async function handleAddMedicationSubmit(e) {
  e.preventDefault();
  const name = document.getElementById("input-med-name").value.trim();
  const dosage = document.getElementById("input-med-dosage").value.trim();
  const timing = document.getElementById("select-med-timing").value;
  const food = document.getElementById("input-med-food").value.trim();
  const purpose = document.getElementById("input-med-purpose").value.trim();
  const caution = document.getElementById("input-med-caution").value.trim();

  if (!name) {
    showToast("Medication name is required.");
    return;
  }

  try {
    await API.addMedication({
      profile_id: appState.currentProfileId,
      name: name,
      dosage: dosage || "1 Unit",
      timing: timing,
      food_instruction: food || "Take with plain water",
      purpose: purpose || "Prescribed Regimen",
      caution: caution || "Follow physician instructions"
    });
    showToast(`Added ${name} to schedule.`);
    document.getElementById("form-add-med").reset();
    document.getElementById("modal-add-med").classList.remove("active");
    await loadCurrentProfile();
    refreshCaregiverHub();
  } catch (err) {
    showToast("Error adding medication.");
    console.error(err);
  }
}

async function handleAddMemberSubmit(e) {
  e.preventDefault();
  const name = document.getElementById("input-member-name").value.trim();
  const role = document.getElementById("select-member-role").value;
  const age = parseInt(document.getElementById("input-member-age").value) || 60;
  const notes = document.getElementById("input-member-notes").value.trim();

  if (!name) {
    showToast("Name is required.");
    return;
  }

  try {
    const res = await API.createProfile({
      name: name,
      role: role,
      age: age,
      notes: notes
    });
    showToast(`Profile created for ${name}.`);
    document.getElementById("form-add-member").reset();
    document.getElementById("modal-add-member").classList.remove("active");

    const data = await API.getProfiles();
    appState.profiles = data.profiles;
    appState.currentProfileId = res.profile.id;
    renderProfilesBar();
    await loadCurrentProfile();
    refreshCaregiverHub();
  } catch (err) {
    showToast("Error creating profile.");
    console.error(err);
  }
}

// Utility
function showToast(message) {
  let toast = document.getElementById("app-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "app-toast";
    toast.className = "toast-notice";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 3200);
}

function escapeHtml(text) {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
