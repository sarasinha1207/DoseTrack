/**
 * DoseTrack - Add Medication Controller (add_medication.js)
 * Manages medication prescription intake, target member selection,
 * and detailed active regimens inspection.
 * Strictly no emojis.
 */

const AddMedicationModule = {
  selectedMemberId: null,

  init() {
    this.selectedMemberId = dashState.currentUserId || "mother";
    this.setupForm();
    this.setupFilter();
  },

  populateMemberSelects() {
    const memberSelect = document.getElementById("add-med-page-member");
    const filterSelect = document.getElementById("filter-prescribed-member");
    if (!dashState.allProfiles || dashState.allProfiles.length === 0) return;

    const currentSelected = this.selectedMemberId || dashState.currentUserId;

    if (memberSelect) {
      memberSelect.innerHTML = dashState.allProfiles.map((p) => {
        const name = p.name || p.username;
        const role = p.role || "Member";
        return `<option value="${p.id}" ${p.id === currentSelected ? "selected" : ""}>${escapeHtml(name)} (${escapeHtml(role)})</option>`;
      }).join("");
    }

    if (filterSelect) {
      filterSelect.innerHTML = dashState.allProfiles.map((p) => {
        const name = p.name || p.username;
        const role = p.role || "Member";
        return `<option value="${p.id}" ${p.id === currentSelected ? "selected" : ""}>Viewing: ${escapeHtml(name)} (${escapeHtml(role)})</option>`;
      }).join("");
    }
  },

  setupFilter() {
    const filterSelect = document.getElementById("filter-prescribed-member");
    if (filterSelect) {
      filterSelect.addEventListener("change", (e) => {
        this.selectedMemberId = e.target.value;
        const memberSelect = document.getElementById("add-med-page-member");
        if (memberSelect) memberSelect.value = this.selectedMemberId;
        this.renderPresentMedications();
      });
    }
  },

  setupForm() {
    const form = document.getElementById("form-page-add-med");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const memberSelect = document.getElementById("add-med-page-member");
      const targetMemberId = memberSelect ? memberSelect.value : (this.selectedMemberId || dashState.currentUserId);

      const name = document.getElementById("add-med-page-name").value.trim();
      const dosage = document.getElementById("add-med-page-dosage").value.trim();
      const time = document.getElementById("add-med-page-time").value.trim();
      const timing = document.getElementById("add-med-page-timing").value;
      const food = document.getElementById("add-med-page-food").value.trim();
      const purpose = document.getElementById("add-med-page-purpose").value.trim();
      const caution = document.getElementById("add-med-page-caution").value.trim();

      if (!name || !dosage) {
        showToast("Medication name and dosage are required.");
        return;
      }

      try {
        await API.addMedication({
          profile_id: targetMemberId,
          name: name,
          dosage: dosage,
          time: time || "08:00 AM",
          timing: timing,
          food_instruction: food || "Take with plain water",
          purpose: purpose || "Prescribed Regimen",
          caution: caution || "Follow clinical instructions"
        });

        showToast(`Added ${name} to prescribed regimen.`);
        form.reset();

        // Reload data
        if (window.DashboardCore) {
          await window.DashboardCore.loadUserData();
        }

        this.selectedMemberId = targetMemberId;
        this.populateMemberSelects();
        this.renderPresentMedications();

      } catch (err) {
        showToast("Error adding medication: " + err.message);
      }
    });
  },

  render() {
    this.populateMemberSelects();
    this.renderPresentMedications();
  },

  renderPresentMedications() {
    const container = document.getElementById("present-medications-container");
    if (!container) return;

    const targetId = this.selectedMemberId || dashState.currentUserId;
    const member = (dashState.allProfiles || []).find((p) => p.id === targetId) || dashState.currentProfile;

    if (!member) {
      container.innerHTML = `<div style="color: var(--slate-500); padding: 20px;">No member selected.</div>`;
      return;
    }

    const meds = member.medications || [];

    if (meds.length === 0) {
      container.innerHTML = `
        <div style="padding: 30px; text-align: center; color: var(--slate-500); background: #f8fafc; border-radius: var(--radius-md); border: 1.5px dashed var(--slate-200);">
          <div style="font-weight: 700; color: var(--slate-800); margin-bottom: 4px;">No Active Regimens Recorded</div>
          <div style="font-size: 0.82rem;">Use the form on the left to prescribe the first medication for ${escapeHtml(member.name || member.username)}.</div>
        </div>
      `;
      return;
    }

    container.innerHTML = "";

    meds.forEach((m) => {
      const card = document.createElement("div");
      card.className = "present-med-card";
      card.style.cssText = "background: #f8fafc; border: 1px solid var(--slate-200); border-radius: var(--radius-md); padding: 16px; margin-bottom: 12px; transition: border-color 0.15s ease;";

      const timingColors = {
        "Morning": "#059669",
        "Afternoon": "#0284c7",
        "Evening": "#d97706",
        "Night": "#4f46e5"
      };
      const badgeBg = timingColors[m.timing] || "var(--primary)";

      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
          <div>
            <span style="font-size: 1rem; font-weight: 800; color: var(--slate-900);">${escapeHtml(m.name)}</span>
            <span style="font-size: 0.85rem; font-weight: 700; color: var(--slate-600); margin-left: 6px;">${escapeHtml(m.dosage)}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 0.72rem; font-weight: 700; padding: 2px 8px; border-radius: var(--radius-full); background: ${badgeBg}; color: #ffffff;">
              ${escapeHtml(m.timing || "Daily")} &bull; ${escapeHtml(m.time || "Scheduled")}
            </span>
            <button type="button" class="btn btn-secondary btn-sm btn-delete-regimen" data-med-id="${m.id}" data-member-id="${member.id}" style="padding: 2px 8px; font-size: 0.75rem; color: var(--danger); border-color: var(--danger-border);" title="Remove medication from regimen">
              Remove
            </button>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.8rem; margin-bottom: 6px;">
          <div>
            <strong style="color: var(--slate-500); font-size: 0.72rem; text-transform: uppercase; display: block;">Food Rule:</strong>
            <span style="color: var(--slate-700);">${escapeHtml(m.food_instruction || "Take with water")}</span>
          </div>
          <div>
            <strong style="color: var(--slate-500); font-size: 0.72rem; text-transform: uppercase; display: block;">Purpose:</strong>
            <span style="color: var(--slate-700);">${escapeHtml(m.purpose || "Prescribed Regimen")}</span>
          </div>
        </div>

        ${m.caution ? `
          <div style="font-size: 0.75rem; color: #b45309; background: #fef3c7; border: 1px solid #fde68a; border-radius: var(--radius-sm); padding: 6px 10px; margin-top: 6px;">
            <strong>Precaution:</strong> ${escapeHtml(m.caution)}
          </div>
        ` : ""}
      `;

      container.appendChild(card);
    });

    container.querySelectorAll(".btn-delete-regimen").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const medId = btn.getAttribute("data-med-id");
        const memberId = btn.getAttribute("data-member-id");
        if (confirm("Are you sure you want to remove this medication from the active regimen?")) {
          try {
            await API.deleteMedication(memberId, medId);
            showToast("Medication removed.");
            if (window.DashboardCore) {
              await window.DashboardCore.loadUserData();
            }
            this.renderPresentMedications();
          } catch (err) {
            showToast("Error deleting medication: " + err.message);
          }
        }
      });
    });
  }
};

window.AddMedicationModule = AddMedicationModule;
