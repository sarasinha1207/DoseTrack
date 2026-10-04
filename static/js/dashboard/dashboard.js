/**
 * DoseGuard AI - Master Dashboard Coordinator (dashboard/dashboard.js)
 * Coordinates modular controllers, session lifecycle, navigation,
 * header popovers (Notifications & Profile card with Logout),
 * and onboarding modal triggers.
 * Strictly no emojis.
 */

let dashState = {
  currentUserId: null,
  currentProfile: null,
  allProfiles: [],
  activePage: "schedule"
};

const DashboardCore = {
  async init() {
    // Validate or default session for seamless inspection
    dashState.currentUserId = sessionStorage.getItem("doseguard_active_user");
    if (!dashState.currentUserId) {
      dashState.currentUserId = "mother";
      sessionStorage.setItem("doseguard_active_user", "mother");
    }

    // Initialize Audio & Math Alarm System
    DoseGuardAlarm.init((medId) => {
      this.handleAlarmDismissed(medId);
    });

    // Setup header, popovers, navigation, and submodules
    this.setupNavigation();
    this.setupHeaderPopovers();
    this.setupOnboardingModal();

    if (window.ScheduleModule) window.ScheduleModule.setupAddMedModal();
    if (window.AddMemberModule) window.AddMemberModule.init();
    if (window.ProfileModule) window.ProfileModule.init();
    if (window.ClinicalModule) window.ClinicalModule.init();
    if (window.HelpModule) window.HelpModule.init();

    // Load user data and render
    await this.loadUserData();

    // Check post-registration onboarding trigger
    this.checkOnboardingTrigger();
  },

  async loadUserData() {
    try {
      const profileRes = await API.getProfile(dashState.currentUserId);
      dashState.currentProfile = profileRes.profile;

      const famRes = await API.getAllFamilyMedications();
      dashState.allProfiles = famRes.family || [];

      this.updateHeaderAndSidebarUser();
      this.renderActivePage();
      this.updateNotificationsList();

    } catch (err) {
      console.error("Failed to load user profile", err);
      showToast("Error loading account data: " + err.message);
    }
  },

  updateHeaderAndSidebarUser() {
    const p = dashState.currentProfile;
    if (!p) return;

    const initials = p.initials || (p.first_name ? p.first_name.slice(0, 1) : "FM");
    const fullName = p.name || `${p.first_name || ""} ${p.last_name || ""}`.trim() || p.username;
    const role = p.role || "Family Member";

    // Sidebar elements
    const sideName = document.getElementById("sidebar-user-fullname");
    const sideRole = document.getElementById("sidebar-user-role");
    if (sideName) sideName.textContent = fullName;
    if (sideRole) sideRole.textContent = role + (p.is_admin ? " (Admin)" : "");

    // Header avatar & meta
    const headerInitials = document.getElementById("header-avatar-initials");
    const headerName = document.getElementById("header-display-name");
    const headerRole = document.getElementById("header-display-role");
    if (headerInitials) {
      headerInitials.textContent = initials;
      if (p.badge_color) headerInitials.style.background = p.badge_color;
    }
    if (headerName) headerName.textContent = fullName;
    if (headerRole) headerRole.textContent = role;

    // Header Profile Dropdown Holder
    const holderAvatar = document.getElementById("holder-avatar-large");
    const holderFullName = document.getElementById("holder-user-fullname");
    const holderUsername = document.getElementById("holder-user-username");
    const holderRoleBadge = document.getElementById("holder-badge-role");
    const holderAdminBadge = document.getElementById("holder-badge-admin");

    if (holderAvatar) {
      holderAvatar.textContent = initials;
      if (p.badge_color) holderAvatar.style.background = p.badge_color;
    }
    if (holderFullName) holderFullName.textContent = fullName;
    if (holderUsername) holderUsername.textContent = `@${p.username}`;
    if (holderRoleBadge) holderRoleBadge.textContent = role;
    if (holderAdminBadge) holderAdminBadge.style.display = p.is_admin ? "inline-block" : "none";

    const bioAge = document.getElementById("holder-bio-age");
    const bioGender = document.getElementById("holder-bio-gender");
    const bioWeight = document.getElementById("holder-bio-weight");
    const bioHeight = document.getElementById("holder-bio-height");
    const bioBlood = document.getElementById("holder-bio-blood");
    const bioDoctor = document.getElementById("holder-bio-doctor");
    const bioNotes = document.getElementById("holder-bio-notes");

    if (bioAge) bioAge.textContent = `${p.age || "-"} yrs`;
    if (bioGender) bioGender.textContent = p.gender || "-";
    if (bioWeight) bioWeight.textContent = p.weight || "-";
    if (bioHeight) bioHeight.textContent = p.height || "-";
    if (bioBlood) bioBlood.textContent = p.blood_group || "-";
    if (bioDoctor) bioDoctor.textContent = p.doctor || "-";
    if (bioNotes) bioNotes.textContent = p.notes || "No allergy or clinical notes.";

    // Banner in Schedule view
    const bannerAvatar = document.getElementById("banner-avatar");
    const bannerName = document.getElementById("banner-user-name");
    const bannerAdmin = document.getElementById("banner-admin-badge");

    if (bannerAvatar) {
      bannerAvatar.textContent = initials;
      if (p.badge_color) bannerAvatar.style.background = p.badge_color;
    }
    if (bannerName) bannerName.textContent = fullName;
    if (bannerAdmin) {
      bannerAdmin.textContent = p.is_admin ? "Primary Caregiver Admin" : role;
    }

    if (window.ProfileModule) {
      window.ProfileModule.updateDisplay();
    }
  },

  checkOnboardingTrigger() {
    const trigger = sessionStorage.getItem("doseguard_trigger_onboarding");
    if (trigger === "true") {
      const modal = document.getElementById("modal-onboarding");
      const welcomeTitle = document.getElementById("onboarding-welcome-title");
      if (dashState.currentProfile && welcomeTitle) {
        const fname = dashState.currentProfile.first_name || dashState.currentProfile.name;
        welcomeTitle.textContent = `Welcome, ${fname}! Complete Clinical Profile`;
      }
      if (modal) modal.classList.add("active");
    }
  },

  setupHeaderPopovers() {
    const btnNotif = document.getElementById("btn-header-notifications");
    const holderNotif = document.getElementById("holder-notifications");
    const closeNotif = document.getElementById("close-notifications-btn");
    const btnClearNotif = document.getElementById("btn-clear-notifications");

    const btnProfile = document.getElementById("btn-header-profile");
    const holderProfile = document.getElementById("holder-profile");
    const closeProfile = document.getElementById("close-profile-btn");
    const btnHolderLogout = document.getElementById("btn-holder-logout");
    const btnHolderEditBio = document.getElementById("btn-holder-edit-profile");

    const btnSidebarLogout = document.getElementById("btn-sidebar-logout");
    const btnSimulateAlarm = document.getElementById("btn-simulate-alarm");

    // Notifications Toggle
    if (btnNotif && holderNotif) {
      btnNotif.addEventListener("click", (e) => {
        e.stopPropagation();
        const isActive = holderNotif.classList.contains("active");
        if (holderProfile) holderProfile.classList.remove("active");
        if (isActive) {
          holderNotif.classList.remove("active");
        } else {
          holderNotif.classList.add("active");
        }
      });
    }

    if (closeNotif && holderNotif) {
      closeNotif.addEventListener("click", () => {
        holderNotif.classList.remove("active");
      });
    }

    if (btnClearNotif) {
      btnClearNotif.addEventListener("click", () => {
        const badge = document.getElementById("header-notif-badge");
        if (badge) {
          badge.textContent = "0";
          badge.style.display = "none";
        }
        showToast("All scheduled medication reminders acknowledged.");
        if (holderNotif) holderNotif.classList.remove("active");
      });
    }

    // Profile Popover Toggle
    if (btnProfile && holderProfile) {
      btnProfile.addEventListener("click", (e) => {
        e.stopPropagation();
        const isActive = holderProfile.classList.contains("active");
        if (holderNotif) holderNotif.classList.remove("active");
        if (isActive) {
          holderProfile.classList.remove("active");
        } else {
          holderProfile.classList.add("active");
        }
      });
    }

    if (closeProfile && holderProfile) {
      closeProfile.addEventListener("click", () => {
        holderProfile.classList.remove("active");
      });
    }

    // Logout Handlers
    const handleLogout = () => {
      sessionStorage.removeItem("doseguard_active_user");
      sessionStorage.removeItem("doseguard_active_profile");
      sessionStorage.removeItem("doseguard_trigger_onboarding");
      window.location.href = "/login";
    };

    if (btnHolderLogout) btnHolderLogout.addEventListener("click", handleLogout);
    if (btnSidebarLogout) btnSidebarLogout.addEventListener("click", handleLogout);

    // Edit Bio Trigger from Profile Popover
    if (btnHolderEditBio) {
      btnHolderEditBio.addEventListener("click", () => {
        if (holderProfile) holderProfile.classList.remove("active");
        if (window.ProfileModule) {
          window.ProfileModule.openEditModal();
        }
      });
    }

    // Simulate Alarm
    if (btnSimulateAlarm) {
      btnSimulateAlarm.addEventListener("click", () => {
        DoseGuardAlarm.trigger("Amlodipine 5 mg (Prescribed Intake)", "08:00 AM", null);
      });
    }

    // Close popovers when clicking outside
    document.addEventListener("click", (e) => {
      if (holderNotif && !holderNotif.contains(e.target) && e.target !== btnNotif && !btnNotif.contains(e.target)) {
        holderNotif.classList.remove("active");
      }
      if (holderProfile && !holderProfile.contains(e.target) && e.target !== btnProfile && !btnProfile.contains(e.target)) {
        holderProfile.classList.remove("active");
      }
    });
  },

  updateNotificationsList() {
    const container = document.getElementById("holder-notifications-list");
    const badge = document.getElementById("header-notif-badge");
    if (!container || !dashState.currentProfile) return;

    const meds = dashState.currentProfile.medications || [];
    const logs = dashState.currentProfile.logs || {};
    const todayKey = new Date().toISOString().split("T")[0];
    const todayLogs = logs[todayKey] || {};

    container.innerHTML = "";

    let unreadCount = 0;

    meds.forEach((m) => {
      const isTaken = !!todayLogs[m.id];
      if (!isTaken) {
        unreadCount++;
        const item = document.createElement("div");
        item.className = "holder-notif-item urgent";
        item.innerHTML = `
          <div class="holder-notif-header">
            <span class="holder-notif-title">${escapeHtml(m.name)}</span>
            <span class="holder-notif-time">${escapeHtml(m.time || m.timing)}</span>
          </div>
          <div class="holder-notif-body">
            ${escapeHtml(m.dosage)} - ${escapeHtml(m.food_instruction || "Take with water")}
          </div>
        `;
        container.appendChild(item);
      }
    });

    if (unreadCount === 0) {
      container.innerHTML = `
        <div style="padding: 24px; text-align: center; color: var(--slate-400); font-size: 0.85rem;">
          All scheduled doses for today have been taken!
        </div>
      `;
      if (badge) badge.style.display = "none";
    } else {
      if (badge) {
        badge.textContent = unreadCount;
        badge.style.display = "inline-block";
      }
    }
  },

  setupNavigation() {
    const navLinks = document.querySelectorAll(".sidebar-nav-item");
    const titleEl = document.getElementById("dash-view-title");
    const subtitleEl = document.getElementById("dash-view-subtitle");

    const titles = {
      "schedule": { title: "My Daily Schedule", sub: "Today's scheduled medication intake and adherence tracking" },
      "family": { title: "All Family Medications", sub: "Transparent cross-family adherence oversight for parents and grandparents" },
      "add-member": { title: "Add Family Member", sub: "Register an additional household member with their dedicated profile" },
      "profile": { title: "Biometric Profile", sub: "Recorded biometric indicators, attending physician, and clinical allergies" },
      "clinical": { title: "Clinical Guidance", sub: "AI prescription parsing, hospital summaries, and drug instruction analysis" },
      "help": { title: "Help & FAQ", sub: "Caregiver guides, math challenge alarm instructions, and support" }
    };

    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const pageKey = link.getAttribute("data-page");
        if (!pageKey) return;

        navLinks.forEach((l) => l.classList.remove("active"));
        link.classList.add("active");

        document.querySelectorAll(".dash-page").forEach((page) => {
          page.classList.remove("active");
        });

        const targetPage = document.getElementById(`page-${pageKey}`);
        if (targetPage) targetPage.classList.add("active");

        dashState.activePage = pageKey;

        if (titles[pageKey]) {
          if (titleEl) titleEl.textContent = titles[pageKey].title;
          if (subtitleEl) subtitleEl.textContent = titles[pageKey].sub;
        }

        this.renderActivePage();
      });
    });
  },

  renderActivePage() {
    if (dashState.activePage === "schedule" && window.ScheduleModule) {
      window.ScheduleModule.render();
    } else if (dashState.activePage === "family" && window.FamilyModule) {
      window.FamilyModule.render();
    } else if (dashState.activePage === "profile" && window.ProfileModule) {
      window.ProfileModule.updateDisplay();
    }
  },

  setupOnboardingModal() {
    const modalOnboard = document.getElementById("modal-onboarding");
    const btnCloseOnboard = document.getElementById("btn-close-onboarding");
    const btnSkipOnboard = document.getElementById("btn-skip-onboarding");
    const formOnboard = document.getElementById("form-onboarding");

    const closeOnboard = () => {
      sessionStorage.removeItem("doseguard_trigger_onboarding");
      if (modalOnboard) modalOnboard.classList.remove("active");
    };
    if (btnCloseOnboard) btnCloseOnboard.addEventListener("click", closeOnboard);
    if (btnSkipOnboard) {
      btnSkipOnboard.addEventListener("click", () => {
        closeOnboard();
        showToast("Setup skipped. You can configure your biometrics anytime under the Biometric Profile tab.");
      });
    }

    if (formOnboard) {
      formOnboard.addEventListener("submit", async (e) => {
        e.preventDefault();
        const weight = document.getElementById("onboard-weight").value.trim();
        const height = document.getElementById("onboard-height").value.trim();
        const blood = document.getElementById("onboard-blood").value;
        const doctor = document.getElementById("onboard-doctor").value.trim();
        const notes = document.getElementById("onboard-notes").value.trim();
        const isAdmin = document.getElementById("onboard-is-admin").checked;

        const medName = document.getElementById("onboard-med-name").value.trim();
        const medDosage = document.getElementById("onboard-med-dosage").value.trim();
        const medTime = document.getElementById("onboard-med-time").value.trim();
        const medTiming = document.getElementById("onboard-med-timing").value;
        const medFood = document.getElementById("onboard-med-food").value.trim();

        try {
          const res = await API.completeOnboarding({
            profile_id: dashState.currentUserId,
            weight: weight || "-",
            height: height || "-",
            blood_group: blood || "-",
            doctor: doctor || "Family Physician",
            notes: notes || "",
            is_admin: isAdmin,
            initial_med_name: medName || null,
            initial_med_dosage: medDosage || null,
            initial_med_time: medTime || null,
            initial_med_timing: medTiming || "Morning",
            initial_med_food: medFood || null
          });

          dashState.currentProfile = res.profile;
          closeOnboard();
          this.updateHeaderAndSidebarUser();
          if (window.ScheduleModule) window.ScheduleModule.render();
          this.updateNotificationsList();
          showToast("Clinical profile and regimen saved successfully!");
        } catch (err) {
          showToast("Error completing clinical profile: " + err.message);
        }
      });
    }
  },

  handleAlarmDismissed(medId) {
    showToast("Alarm dismissed. Cognitive alertness verified!");
    if (medId && window.ScheduleModule) {
      window.ScheduleModule.markTaken(medId);
    }
  }
};

function showToast(message) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.style.cssText = "background: var(--slate-900); color: #fff; padding: 12px 18px; border-radius: var(--radius-md); margin-top: 8px; font-size: 0.85rem; box-shadow: var(--shadow-lg); transition: opacity 0.3s ease;";
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => {
      if (toast.parentElement) toast.parentElement.removeChild(toast);
    }, 300);
  }, 4000);
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

window.DashboardCore = DashboardCore;
window.dashState = dashState;
window.showToast = showToast;
window.escapeHtml = escapeHtml;

document.addEventListener("DOMContentLoaded", () => {
  DashboardCore.init();
});
