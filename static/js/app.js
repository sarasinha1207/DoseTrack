/**
 * DoseGuard AI - Frontend Controller
 * Public landing, PIN-based member login, demo sign-in options,
 * personal dashboards with biometrics, all-family visibility,
 * and audio alarms with math verification challenges.
 * Strictly no emojis.
 */

let appState = {
  profiles: [],
  selectedLoginMemberId: "daughter",
  currentUser: null,
  currentProfileData: null,
  adherence: { total: 0, taken: 0, percentage: 0 },
  activeTab: "personal",
  alarmAudioContext: null,
  alarmInterval: null,
  currentMathPuzzles: { p1: null, p2: null },
  pendingAlarmMedId: null
};

document.addEventListener("DOMContentLoaded", () => {
  initApp();
  setupEventListeners();
});

async function initApp() {
  try {
    const data = await API.getProfiles();
    appState.profiles = data.profiles;
    renderLoginMemberCards();
    renderQuickDemoButtons();

    const savedUser = sessionStorage.getItem("doseguard_active_user");
    if (savedUser) {
      try {
        const userObj = JSON.parse(savedUser);
        appState.currentUser = userObj;
        showDashboardView();
        await loadPersonalDashboard(userObj.id);
      } catch (e) {
        showLandingView();
      }
    } else {
      showLandingView();
    }
  } catch (err) {
    showToast("Error initializing application.");
    console.error(err);
  }
}

function setupEventListeners() {
  // Brand Home
  const brandBlock = document.getElementById("brand-home-btn");
  if (brandBlock) {
    brandBlock.addEventListener("click", () => {
      if (appState.currentUser) {
        showDashboardView();
      } else {
        showLandingView();
      }
    });
  }

  // Landing "Get Started"
  const btnGetStarted = document.getElementById("btn-landing-get-started");
  if (btnGetStarted) {
    btnGetStarted.addEventListener("click", () => {
      document.getElementById("section-login").scrollIntoView({ behavior: "smooth" });
    });
  }

  // Keypad
  document.querySelectorAll(".keypad-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const val = btn.getAttribute("data-val");
      handleKeypadInput(val);
    });
  });

  // PIN Form Submit
  const formLogin = document.getElementById("form-pin-login");
  if (formLogin) {
    formLogin.addEventListener("submit", handlePinLoginSubmit);
  }

  // Standard Account Form Demo Notice
  const formAccountLogin = document.getElementById("form-account-login");
  if (formAccountLogin) {
    formAccountLogin.addEventListener("submit", (e) => {
      e.preventDefault();
      // Auto redirect to PIN demo login
      document.getElementById("input-member-pin").value = "5555";
      appState.selectedLoginMemberId = "daughter";
      renderLoginMemberCards();
      handlePinLoginSubmit(e);
    });
  }

  // Logout Buttons (Top nav and in dashboard profile card)
  document.querySelectorAll(".btn-logout-action").forEach(btn => {
    btn.addEventListener("click", handleLogout);
  });

  // Dashboard Tabs
  document.querySelectorAll(".dash-tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab");
      switchDashboardTab(tabId);
    });
  });

  // Open Add Med Modal
  const btnStartSchedule = document.getElementById("btn-start-schedule");
  if (btnStartSchedule) {
    btnStartSchedule.addEventListener("click", () => openModal("modal-add-med"));
  }

  const btnOpenAddMed = document.getElementById("btn-open-add-med");
  if (btnOpenAddMed) {
    btnOpenAddMed.addEventListener("click", () => openModal("modal-add-med"));
  }

  // Open Edit Profile Modal
  const btnEditProfile = document.getElementById("btn-edit-profile-open");
  if (btnEditProfile) {
    btnEditProfile.addEventListener("click", handleOpenEditProfileModal);
  }

  // Form Edit Profile Submit
  const formEditProfile = document.getElementById("form-edit-profile");
  if (formEditProfile) {
    formEditProfile.addEventListener("submit", handleEditProfileSubmit);
  }

  // Test Alarm Button
  const btnTriggerAlarm = document.getElementById("btn-test-alarm-trigger");
  if (btnTriggerAlarm) {
    btnTriggerAlarm.addEventListener("click", () => {
      triggerMedicationAlarm("Scheduled Dose Verification", "Now");
    });
  }

  // Submit Math Challenge Button
  const btnVerifyAlarm = document.getElementById("btn-verify-alarm-math");
  if (btnVerifyAlarm) {
    btnVerifyAlarm.addEventListener("click", handleVerifyAlarmMath);
  }

  // Modal Closers
  document.querySelectorAll(".modal-close-btn, .modal-cancel-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const modal = btn.closest(".modal-overlay");
      if (modal) modal.classList.remove("active");
    });
  });

  // Submit Add Medication
  const formAddMed = document.getElementById("form-add-med");
  if (formAddMed) {
    formAddMed.addEventListener("submit", handleAddMedicationSubmit);
  }

  // Companion Chat
  const btnAskCompanion = document.getElementById("btn-ask-companion");
  if (btnAskCompanion) {
    btnAskCompanion.addEventListener("click", handleAskCompanion);
  }

  // Export Vault
  const btnExport = document.getElementById("btn-export-vault");
  if (btnExport) {
    btnExport.addEventListener("click", handleExportVault);
  }
}

// View Switches
function showLandingView() {
  document.getElementById("view-landing").classList.add("active");
  document.getElementById("view-dashboard").classList.remove("active");
  document.getElementById("user-nav-block").style.display = "none";
  document.getElementById("public-nav-links").style.display = "flex";
}

function showDashboardView() {
  document.getElementById("view-landing").classList.remove("active");
  document.getElementById("view-dashboard").classList.add("active");
  document.getElementById("user-nav-block").style.display = "flex";
  document.getElementById("public-nav-links").style.display = "none";

  if (appState.currentUser) {
    document.getElementById("nav-user-initials").textContent = appState.currentUser.initials;
    document.getElementById("nav-user-name").textContent = `${appState.currentUser.role} (${appState.currentUser.name})`;
  }
}

// Member PIN Cards
function renderLoginMemberCards() {
  const container = document.getElementById("login-members-container");
  if (!container) return;

  container.innerHTML = "";
  appState.profiles.forEach(p => {
    const card = document.createElement("div");
    card.className = `member-select-card ${p.id === appState.selectedLoginMemberId ? "active" : ""}`;
    card.innerHTML = `
      <div class="member-select-avatar">${p.initials}</div>
      <div class="member-select-name">${escapeHtml(p.name)}</div>
      <div class="member-select-role">${escapeHtml(p.role)}</div>
    `;
    card.addEventListener("click", () => {
      appState.selectedLoginMemberId = p.id;
      renderLoginMemberCards();
      const pinInput = document.getElementById("input-member-pin");
      if (pinInput) pinInput.value = "";
    });
    container.appendChild(card);
  });
}

function renderQuickDemoButtons() {
  const container = document.getElementById("quick-demo-buttons-container");
  if (!container) return;

  const defaultPins = {
    "mother": "1111",
    "father": "2222",
    "grandfather": "3333",
    "grandmother": "4444",
    "daughter": "5555"
  };

  container.innerHTML = "";
  appState.profiles.forEach(p => {
    const pin = defaultPins[p.id] || "1111";
    const btn = document.createElement("div");
    btn.className = "btn-demo-quick";
    btn.innerHTML = `
      <div>
        <div class="demo-quick-name">${escapeHtml(p.name)} (${escapeHtml(p.role)})</div>
        <div class="demo-quick-role">Age: ${p.age} • ${p.med_count} Meds Scheduled</div>
      </div>
      <div class="demo-quick-pin">PIN: ${pin}</div>
    `;
    btn.addEventListener("click", async () => {
      appState.selectedLoginMemberId = p.id;
      renderLoginMemberCards();
      const pinInput = document.getElementById("input-member-pin");
      if (pinInput) pinInput.value = pin;
      try {
        const res = await API.login(p.id, pin);
        appState.currentUser = res.profile;
        sessionStorage.setItem("doseguard_active_user", JSON.stringify(res.profile));
        showToast(`Demo Sign-In: Authenticated as ${res.profile.name}!`);
        showDashboardView();
        await loadPersonalDashboard(res.profile.id);
      } catch (err) {
        showToast("Demo sign-in error.");
      }
    });
    container.appendChild(btn);
  });
}

function handleKeypadInput(val) {
  const pinInput = document.getElementById("input-member-pin");
  if (!pinInput) return;

  if (val === "C") {
    pinInput.value = "";
  } else if (val === "DEL") {
    pinInput.value = pinInput.value.slice(0, -1);
  } else {
    if (pinInput.value.length < 4) {
      pinInput.value += val;
    }
  }
}

async function handlePinLoginSubmit(e) {
  if (e) e.preventDefault();
  const pinInput = document.getElementById("input-member-pin");
  const pin = pinInput ? pinInput.value.trim() : "";

  if (pin.length !== 4) {
    showToast("Please enter a 4-digit number PIN.");
    return;
  }

  const errNotice = document.getElementById("pin-error-notice");
  if (errNotice) errNotice.style.display = "none";

  try {
    const res = await API.login(appState.selectedLoginMemberId, pin);
    appState.currentUser = res.profile;
    sessionStorage.setItem("doseguard_active_user", JSON.stringify(res.profile));

    showToast(`Welcome back, ${res.profile.name}!`);
    showDashboardView();
    await loadPersonalDashboard(res.profile.id);
  } catch (err) {
    if (errNotice) {
      errNotice.textContent = err.message || "Incorrect PIN credential.";
      errNotice.style.display = "block";
    }
    if (pinInput) pinInput.value = "";
  }
}

function handleLogout() {
  sessionStorage.removeItem("doseguard_active_user");
  appState.currentUser = null;
  appState.currentProfileData = null;
  showLandingView();
  showToast("Logged out of session.");
}

// Personal Dashboard & Biometrics
async function loadPersonalDashboard(profileId) {
  try {
    const res = await API.getProfile(profileId);
    appState.currentProfileData = res.profile;
    appState.adherence = res.adherence;

    renderPersonalHeader();
    renderBiometricsCard();
    renderPersonalTimeline();
    await loadAllFamilyMedications();
    updateChatSuggestions();
  } catch (err) {
    showToast("Failed to load dashboard data.");
    console.error(err);
  }
}

function renderPersonalHeader() {
  const p = appState.currentProfileData;
  if (!p) return;

  const nameEl = document.getElementById("banner-member-name");
  const roleEl = document.getElementById("banner-member-role");
  const avatarEl = document.getElementById("banner-member-avatar");

  if (nameEl) nameEl.textContent = `Hello, ${p.name}`;
  if (roleEl) roleEl.textContent = `${p.role} Personal Schedule`;
  if (avatarEl) avatarEl.textContent = p.initials;

  renderCalendarRibbon();
}

function renderBiometricsCard() {
  const p = appState.currentProfileData;
  if (!p) return;

  const ageEl = document.getElementById("bio-val-age");
  const weightEl = document.getElementById("bio-val-weight");
  const heightEl = document.getElementById("bio-val-height");
  const bloodEl = document.getElementById("bio-val-blood");
  const doctorEl = document.getElementById("bio-val-doctor");
  const notesEl = document.getElementById("bio-val-notes");

  if (ageEl) ageEl.textContent = `${p.age} years`;
  if (weightEl) weightEl.textContent = p.weight || "60 kg";
  if (heightEl) heightEl.textContent = p.height || "165 cm";
  if (bloodEl) bloodEl.textContent = p.blood_group || "O+";
  if (doctorEl) doctorEl.textContent = p.doctor || "Attending Physician";
  if (notesEl) notesEl.textContent = p.notes || "Standard Geriatric Regimen";
}

function handleOpenEditProfileModal() {
  const p = appState.currentProfileData;
  if (!p) return;

  document.getElementById("input-edit-age").value = p.age || 25;
  document.getElementById("input-edit-weight").value = p.weight || "60 kg";
  document.getElementById("input-edit-height").value = p.height || "165 cm";
  document.getElementById("input-edit-blood").value = p.blood_group || "O+";
  document.getElementById("input-edit-notes").value = p.notes || "";

  openModal("modal-edit-profile");
}

async function handleEditProfileSubmit(e) {
  e.preventDefault();
  const age = parseInt(document.getElementById("input-edit-age").value) || 25;
  const weight = document.getElementById("input-edit-weight").value.trim() || "60 kg";
  const height = document.getElementById("input-edit-height").value.trim() || "165 cm";
  const blood = document.getElementById("input-edit-blood").value.trim() || "O+";
  const notes = document.getElementById("input-edit-notes").value.trim();

  try {
    const res = await API.updateProfile({
      profile_id: appState.currentUser.id,
      age: age,
      weight: weight,
      height: height,
      blood_group: blood,
      notes: notes
    });

    appState.currentProfileData = res.profile;
    renderBiometricsCard();
    document.getElementById("modal-edit-profile").classList.remove("active");
    showToast("Profile information updated successfully.");
  } catch (err) {
    showToast("Failed to update profile.");
  }
}

function renderCalendarRibbon() {
  const ribbon = document.getElementById("calendar-days-ribbon");
  if (!ribbon) return;

  const daysOfWeek = ["M", "T", "W", "T", "F", "S", "S"];
  const today = new Date();
  const currentDayIndex = (today.getDay() + 6) % 7;
  const currentDateNum = today.getDate();

  ribbon.innerHTML = "";
  for (let i = 0; i < 7; i++) {
    const dateOffset = i - currentDayIndex;
    const dayDate = new Date(today);
    dayDate.setDate(currentDateNum + dateOffset);

    const isToday = i === currentDayIndex;
    const item = document.createElement("div");
    item.className = `calendar-day-item ${isToday ? "active" : ""}`;
    item.innerHTML = `
      <div class="calendar-day-label">${daysOfWeek[i]}</div>
      <div class="calendar-date-number">${dayDate.getDate()}</div>
    `;
    ribbon.appendChild(item);
  }
}

function renderPersonalTimeline() {
  const container = document.getElementById("personal-timeline-container");
  if (!container || !appState.currentProfileData) return;

  const meds = appState.currentProfileData.medications || [];
  const activeMeds = meds.filter(m => m.active !== false);

  if (activeMeds.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; background: #ffffff; border-radius: var(--radius-lg); border: 1.5px solid var(--slate-200);">
        <p style="font-weight: 700; color: var(--slate-700); margin-bottom: 6px;">No medications currently scheduled.</p>
        <p style="font-size: 0.88rem; color: var(--slate-500); margin-bottom: 16px;">Click "Start Schedule" to add your daily medications.</p>
        <button class="btn btn-primary" onclick="openModal('modal-add-med')">Add Medication</button>
      </div>
    `;
    return;
  }

  const todayStr = new Date().toISOString().split("T")[0];
  const logs = appState.currentProfileData.logs?.[todayStr] || {};

  let html = "";
  activeMeds.forEach(med => {
    const isTaken = !!logs[med.id];
    const logInfo = logs[med.id];

    html += `
      <div class="timeline-card ${isTaken ? "taken" : ""}">
        <div class="timeline-left">
          <div class="med-icon-pill">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M12 2v20M2 12h20"></path>
            </svg>
          </div>
          <div>
            <div class="timeline-med-name">${escapeHtml(med.name)}</div>
            <div class="timeline-med-dosage">${escapeHtml(med.dosage || "1 Unit")} • ${escapeHtml(med.purpose || "Prescribed")}</div>
            <div class="timeline-med-instruction">${escapeHtml(med.food_instruction || "Take with water")}</div>
            ${med.caution ? `<div class="timeline-med-caution">Caution: ${escapeHtml(med.caution)}</div>` : ""}
            ${isTaken ? `<div style="font-size: 0.8rem; font-weight: 700; color: var(--success); margin-top: 4px;">Confirmed taken at ${logInfo.timestamp}</div>` : ""}
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
          <div class="timeline-time-badge">${escapeHtml(med.time || "08:00 AM")}</div>
          ${!isTaken ? `
            <button class="btn btn-primary" onclick="handleMarkTaken('${med.id}')">
              Mark Taken
            </button>
          ` : `
            <button class="btn btn-secondary" onclick="handleUnmarkTaken('${med.id}')">
              Revert
            </button>
          `}
          <button class="btn btn-outline-danger" onclick="handleDeleteMedication('${med.id}')">
            Remove
          </button>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

async function handleMarkTaken(medId) {
  try {
    await API.markTaken(appState.currentUser.id, medId, appState.currentUser.name);
    showToast("Status recorded: Dose confirmed.");
    await loadPersonalDashboard(appState.currentUser.id);
  } catch (err) {
    showToast("Error recording status.");
  }
}

async function handleUnmarkTaken(medId) {
  try {
    await API.unmarkTaken(appState.currentUser.id, medId);
    showToast("Status reverted: Dose set to pending.");
    await loadPersonalDashboard(appState.currentUser.id);
  } catch (err) {
    showToast("Error reverting status.");
  }
}

async function handleDeleteMedication(medId) {
  if (!confirm("Are you sure you want to remove this medication from your schedule?")) return;
  try {
    await API.deleteMedication(appState.currentUser.id, medId);
    showToast("Medication removed.");
    await loadPersonalDashboard(appState.currentUser.id);
  } catch (err) {
    showToast("Error deleting medication.");
  }
}

// All Family Members Cross-Visibility Page
async function loadAllFamilyMedications() {
  try {
    const data = await API.getAllFamilyMedications();
    renderAllFamilyGrid(data.family_overview);
  } catch (err) {
    console.error("Failed to load family medications", err);
  }
}

function renderAllFamilyGrid(familyOverview) {
  const container = document.getElementById("all-family-cards-grid");
  if (!container) return;

  container.innerHTML = "";
  familyOverview.forEach(member => {
    const isCurrent = appState.currentUser && member.id === appState.currentUser.id;
    const card = document.createElement("div");
    card.className = "family-member-overview-card";
    
    let medsHtml = "";
    if (member.medications.length === 0) {
      medsHtml = `<div style="font-size: 0.85rem; color: var(--slate-400); font-style: italic;">No medications recorded</div>`;
    } else {
      member.medications.forEach(m => {
        medsHtml += `
          <div class="sublist-med-row">
            <div>
              <div class="sublist-med-name">${escapeHtml(m.name)}</div>
              <div class="sublist-med-sub">${escapeHtml(m.dosage)} • ${escapeHtml(m.time || m.timing)}</div>
            </div>
            <div>
              <span class="sublist-status-pill ${m.is_taken ? "taken" : "pending"}">
                ${m.is_taken ? `Taken (${m.timestamp})` : "Pending"}
              </span>
            </div>
          </div>
        `;
      });
    }

    card.innerHTML = `
      <div class="family-member-card-header">
        <div class="family-member-initials">${member.initials}</div>
        <div>
          <div class="family-member-title-name">
            ${escapeHtml(member.name)} ${isCurrent ? "<span style='font-size: 0.72rem; color: var(--primary);'>(You)</span>" : ""}
          </div>
          <div class="family-member-title-role">${escapeHtml(member.role)} (${member.age} yrs) • Adherence: ${member.adherence.percentage}%</div>
        </div>
      </div>
      <div style="font-size: 0.8rem; color: var(--slate-600); margin-bottom: 12px; background: var(--slate-50); padding: 8px 10px; border-radius: var(--radius-sm);">
        <div><strong>Biometrics:</strong> ${escapeHtml(member.weight)} • ${escapeHtml(member.height)} • Blood: ${escapeHtml(member.blood_group)}</div>
        <div style="margin-top: 4px;"><strong>Care Protocol:</strong> ${escapeHtml(member.notes || "Standard Protocol")}</div>
      </div>
      <div class="member-meds-sublist">
        ${medsHtml}
      </div>
    `;

    container.appendChild(card);
  });
}

function switchDashboardTab(tabId) {
  appState.activeTab = tabId;
  document.querySelectorAll(".dash-tab-btn").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-tab") === tabId);
  });
  document.querySelectorAll(".dash-tab-content").forEach(panel => {
    panel.classList.toggle("active", panel.id === `dash-tab-${tabId}`);
  });

  if (tabId === "all-family") {
    loadAllFamilyMedications();
  }
}

// Alarm & Math Challenge System
function triggerMedicationAlarm(medName, medTime, medId = null) {
  appState.pendingAlarmMedId = medId;

  // 1. Generate 2 distinct math puzzles
  const a1 = Math.floor(Math.random() * 40) + 12;
  const b1 = Math.floor(Math.random() * 40) + 11;
  const ans1 = a1 + b1;

  const a2 = Math.floor(Math.random() * 6) + 4;
  const b2 = Math.floor(Math.random() * 7) + 3;
  const ans2 = a2 * b2;

  appState.currentMathPuzzles = {
    p1: { prompt: `${a1} + ${b1}`, answer: ans1 },
    p2: { prompt: `${a2} × ${b2}`, answer: ans2 }
  };

  document.getElementById("math-prompt-1").textContent = `${a1} + ${b1} = ?`;
  document.getElementById("math-prompt-2").textContent = `${a2} × ${b2} = ?`;
  document.getElementById("input-math-ans-1").value = "";
  document.getElementById("input-math-ans-2").value = "";
  document.getElementById("alarm-error-notice").style.display = "none";
  document.getElementById("alarm-med-label").textContent = `${medName} (${medTime})`;

  const modal = document.getElementById("modal-alarm-challenge");
  if (modal) modal.classList.add("active");

  startAlarmAudio();
}

function startAlarmAudio() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    if (!appState.alarmAudioContext) {
      appState.alarmAudioContext = new AudioContext();
    }

    if (appState.alarmAudioContext.state === "suspended") {
      appState.alarmAudioContext.resume();
    }

    playBeepSound();
    if (appState.alarmInterval) clearInterval(appState.alarmInterval);
    appState.alarmInterval = setInterval(() => {
      playBeepSound();
    }, 1200);

  } catch (err) {
    console.error("AudioContext error", err);
  }
}

function playBeepSound() {
  if (!appState.alarmAudioContext) return;
  try {
    const ctx = appState.alarmAudioContext;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.36);
  } catch (err) {
    console.error("Beep error", err);
  }
}

function stopAlarmAudio() {
  if (appState.alarmInterval) {
    clearInterval(appState.alarmInterval);
    appState.alarmInterval = null;
  }
}

function handleVerifyAlarmMath() {
  const ans1 = parseInt(document.getElementById("input-math-ans-1").value.trim());
  const ans2 = parseInt(document.getElementById("input-math-ans-2").value.trim());
  const errNotice = document.getElementById("alarm-error-notice");

  const expected1 = appState.currentMathPuzzles.p1.answer;
  const expected2 = appState.currentMathPuzzles.p2.answer;

  if (ans1 === expected1 && ans2 === expected2) {
    stopAlarmAudio();
    const modal = document.getElementById("modal-alarm-challenge");
    if (modal) modal.classList.remove("active");

    showToast("Alarm dismissed. Mental alertness verified!");

    if (appState.pendingAlarmMedId && appState.currentUser) {
      handleMarkTaken(appState.pendingAlarmMedId);
      appState.pendingAlarmMedId = null;
    }
  } else {
    if (errNotice) {
      errNotice.textContent = "Incorrect answer. Solve both puzzles accurately to dismiss the alarm.";
      errNotice.style.display = "block";
    }
  }
}

// Add Medication
async function handleAddMedicationSubmit(e) {
  e.preventDefault();
  const name = document.getElementById("input-med-name").value.trim();
  const dosage = document.getElementById("input-med-dosage").value.trim();
  const time = document.getElementById("input-med-time").value.trim() || "08:00 AM";
  const timing = document.getElementById("select-med-timing").value;
  const food = document.getElementById("input-med-food").value.trim() || "Take with water";
  const purpose = document.getElementById("input-med-purpose").value.trim() || "Prescribed Item";
  const caution = document.getElementById("input-med-caution").value.trim() || "Follow physician instructions";

  if (!name || !appState.currentUser) return;

  try {
    await API.addMedication({
      profile_id: appState.currentUser.id,
      name: name,
      dosage: dosage || "1 Unit",
      time: time,
      timing: timing,
      food_instruction: food,
      purpose: purpose,
      caution: caution
    });

    showToast(`Added ${name} to your schedule.`);
    document.getElementById("form-add-med").reset();
    document.getElementById("modal-add-med").classList.remove("active");
    await loadPersonalDashboard(appState.currentUser.id);
  } catch (err) {
    showToast("Error adding medication.");
  }
}

// AI Companion
function updateChatSuggestions() {
  const container = document.getElementById("chat-suggestions-container");
  if (!container || !appState.currentProfileData) return;

  const role = appState.currentProfileData.role;
  container.innerHTML = "";
  const suggestions = [
    `${role} missed their morning medication, it is 2 PM now. What is the clinical directive?`,
    `Are there recognized food interactions with grapefruit juice, milk, or tea for ${role}?`,
    `What medications are scheduled for ${role} tonight?`
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
  if (!question || !appState.currentUser) return;

  const box = document.getElementById("chat-response-box");
  if (box) {
    box.style.display = "block";
    box.textContent = "Consulting local clinical intelligence model...";
  }

  try {
    const res = await API.askCompanion(appState.currentUser.id, question);
    if (box) box.textContent = res.answer;
  } catch (err) {
    if (box) box.textContent = "Error receiving clinical guidance.";
  }
}

async function handleExportVault() {
  try {
    const data = await API.exportVault();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `doseguard_family_vault_${new Date().toISOString().split("T")[0]}.json`);
    dlAnchor.click();
    showToast("Vault exported successfully.");
  } catch (err) {
    showToast("Export failed.");
  }
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add("active");
}

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
