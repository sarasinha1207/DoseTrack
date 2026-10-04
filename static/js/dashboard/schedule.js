/**
 * DoseGuard AI - Dashboard Schedule Controller (schedule.js)
 * Manages daily medication schedule rendering, intake verification,
 * status retraction, medication deletion, and adherence tracking.
 * Strictly no emojis.
 */

const ScheduleModule = {
  render() {
    const container = document.getElementById("schedule-medications-list");
    if (!container || !dashState.currentProfile) return;

    const meds = dashState.currentProfile.medications || [];
    const logs = dashState.currentProfile.logs || {};
    const todayKey = new Date().toISOString().split("T")[0];
    const todayLogs = logs[todayKey] || {};

    container.innerHTML = "";

    // Calculate adherence and time-of-day distribution
    let takenCount = 0;
    let morningCount = 0;
    let afternoonCount = 0;
    let eveningCount = 0;
    let nightCount = 0;

    meds.forEach((m) => {
      if (todayLogs[m.id]) takenCount++;
      const timing = (m.timing || "").toLowerCase();
      if (timing.includes("morning")) morningCount++;
      else if (timing.includes("afternoon")) afternoonCount++;
      else if (timing.includes("evening")) eveningCount++;
      else if (timing.includes("night") || timing.includes("bedtime")) nightCount++;
      else morningCount++;
    });
    const totalCount = meds.length;
    const pct = totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 0;

    const pctText = document.getElementById("text-adherence-pct");
    const pctFill = document.getElementById("bar-adherence-fill");
    if (pctText) pctText.textContent = `${pct}% (${takenCount} of ${totalCount} taken)`;
    if (pctFill) pctFill.style.width = `${pct}%`;

    // Update streak & verification metrics
    const valVerifiedToday = document.getElementById("val-verified-today");
    if (valVerifiedToday) valVerifiedToday.textContent = `${takenCount} / ${totalCount}`;

    // Update today's bar in weekly adherence chart
    const chartValToday = document.getElementById("chart-val-today");
    const chartFillToday = document.getElementById("chart-fill-today");
    if (chartValToday) chartValToday.textContent = `${pct}%`;
    if (chartFillToday) {
      chartFillToday.style.height = `${pct}%`;
      chartFillToday.className = "chart-bar-fill " + (pct === 100 ? "perfect" : (pct > 0 ? "missed" : ""));
    }

    // Update time-of-day donut metrics
    const donutTotal = document.getElementById("donut-total-meds");
    if (donutTotal) donutTotal.textContent = totalCount;

    const legMorn = document.getElementById("legend-count-morning");
    const legAft = document.getElementById("legend-count-afternoon");
    const legEve = document.getElementById("legend-count-evening");
    const legNight = document.getElementById("legend-count-night");
    if (legMorn) legMorn.textContent = morningCount;
    if (legAft) legAft.textContent = afternoonCount;
    if (legEve) legEve.textContent = eveningCount;
    if (legNight) legNight.textContent = nightCount;

    // Dynamically adjust SVG donut strokes if elements exist
    const segMorn = document.getElementById("donut-seg-morning");
    const segAft = document.getElementById("donut-seg-afternoon");
    const segNight = document.getElementById("donut-seg-night");
    if (totalCount > 0 && segMorn && segAft) {
      const mRatio = Math.round((morningCount / totalCount) * 100);
      const aRatio = Math.round((afternoonCount / totalCount) * 100);
      const nRatio = 100 - mRatio - aRatio;
      segMorn.setAttribute("stroke-dasharray", `${mRatio} ${100 - mRatio}`);
      segAft.setAttribute("stroke-dasharray", `${aRatio} ${100 - aRatio}`);
      segAft.setAttribute("stroke-dashoffset", `${100 - mRatio + 25}`);
      if (segNight) {
        segNight.setAttribute("stroke-dasharray", `${Math.max(0, nRatio)} ${100 - Math.max(0, nRatio)}`);
      }
    }

    if (meds.length === 0) {
      container.innerHTML = `
        <div class="card" style="padding: 40px; text-align: center; color: var(--slate-500);">
          <p style="font-weight: 700; font-size: 1.1rem; color: var(--slate-800); margin-bottom: 8px;">No medications scheduled</p>
          <p style="font-size: 0.88rem; margin-bottom: 18px;">Click "+ Add Medication" above to configure your first prescribed tablet or drops.</p>
        </div>
      `;
      return;
    }

    // Render each medication card
    meds.forEach((m) => {
      const isTaken = !!todayLogs[m.id];
      const logInfo = todayLogs[m.id];

      const card = document.createElement("div");
      card.className = "card";
      card.style.cssText = "padding: 20px 24px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;";

      card.innerHTML = `
        <div style="flex: 1; min-width: 240px;">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
            <span style="font-size: 1.1rem; font-weight: 800; color: var(--slate-900);">${escapeHtml(m.name)}</span>
            <span style="font-size: 0.75rem; font-weight: 700; padding: 2px 8px; border-radius: var(--radius-full); background: var(--primary-light); color: var(--primary);">
              ${escapeHtml(m.timing || "Daily")}
            </span>
            <span style="font-size: 0.82rem; font-weight: 700; color: var(--slate-500);">
              ${escapeHtml(m.time || "Scheduled")}
            </span>
          </div>
          <div style="font-size: 0.85rem; color: var(--slate-600); margin-bottom: 4px;">
            <strong>Dosage:</strong> ${escapeHtml(m.dosage)} &bull; <strong>Instructions:</strong> ${escapeHtml(m.food_instruction || "Take with water")}
          </div>
          <div style="font-size: 0.78rem; color: var(--slate-500);">
            <strong>Purpose:</strong> ${escapeHtml(m.purpose || "Prescribed Regimen")}
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 10px;">
          ${isTaken ? `
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="badge badge-success" style="padding: 6px 12px; font-weight: 700;">
                Taken at ${logInfo && logInfo.time ? logInfo.time : "Today"}
              </span>
              <button type="button" class="btn btn-secondary btn-sm btn-retract" data-id="${m.id}" title="Retract accidental log">
                Retract
              </button>
            </div>
          ` : `
            <button type="button" class="btn btn-secondary btn-sm btn-test-alarm" data-name="${escapeHtml(m.name)}" data-time="${escapeHtml(m.time || m.timing)}" data-id="${m.id}">
              Test Alarm
            </button>
            <button type="button" class="btn btn-primary btn-sm btn-mark-taken" data-id="${m.id}">
              Mark as Taken
            </button>
          `}
          <button type="button" class="btn btn-danger btn-sm btn-delete-med" data-id="${m.id}" title="Remove medication">
            Delete
          </button>
        </div>
      `;

      container.appendChild(card);
    });

    // Attach event listeners to card actions
    container.querySelectorAll(".btn-mark-taken").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const medId = btn.getAttribute("data-id");
        await ScheduleModule.markTaken(medId);
      });
    });

    container.querySelectorAll(".btn-retract").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const medId = btn.getAttribute("data-id");
        await ScheduleModule.unmarkTaken(medId);
      });
    });

    container.querySelectorAll(".btn-test-alarm").forEach((btn) => {
      btn.addEventListener("click", () => {
        const name = btn.getAttribute("data-name");
        const time = btn.getAttribute("data-time");
        const id = btn.getAttribute("data-id");
        DoseGuardAlarm.trigger(name, time, id);
      });
    });

    container.querySelectorAll(".btn-delete-med").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const medId = btn.getAttribute("data-id");
        if (confirm("Are you sure you want to remove this medication from your schedule?")) {
          await ScheduleModule.deleteMed(medId);
        }
      });
    });
  },

  async markTaken(medId) {
    try {
      const res = await API.markTaken(dashState.currentUserId, medId, "Self");
      dashState.currentProfile = res.profile;
      this.render();
      if (window.DashboardCore) {
        window.DashboardCore.updateNotificationsList();
      }
      showToast("Medication marked as taken!");
    } catch (err) {
      showToast("Error updating status: " + err.message);
    }
  },

  async unmarkTaken(medId) {
    try {
      const res = await API.unmarkTaken(dashState.currentUserId, medId);
      dashState.currentProfile = res.profile;
      this.render();
      if (window.DashboardCore) {
        window.DashboardCore.updateNotificationsList();
      }
      showToast("Medication status reverted to pending.");
    } catch (err) {
      showToast("Error updating status: " + err.message);
    }
  },

  async deleteMed(medId) {
    try {
      const res = await API.deleteMedication(dashState.currentUserId, medId);
      dashState.currentProfile = res.profile;
      this.render();
      if (window.DashboardCore) {
        window.DashboardCore.updateNotificationsList();
      }
      showToast("Medication removed from schedule.");
    } catch (err) {
      showToast("Error removing medication: " + err.message);
    }
  },

  setupAddMedModal() {
    const modalAddMed = document.getElementById("modal-add-med");
    const btnOpenAddMed = document.getElementById("btn-open-add-med-modal");
    const btnCloseAddMed = document.getElementById("btn-close-add-med");
    const btnCancelAddMed = document.getElementById("btn-cancel-add-med");
    const formAddMed = document.getElementById("form-add-med");

    if (btnOpenAddMed && modalAddMed) {
      btnOpenAddMed.addEventListener("click", () => {
        modalAddMed.classList.add("active");
      });
    }

    const closeAddMed = () => {
      if (modalAddMed) modalAddMed.classList.remove("active");
    };
    if (btnCloseAddMed) btnCloseAddMed.addEventListener("click", closeAddMed);
    if (btnCancelAddMed) btnCancelAddMed.addEventListener("click", closeAddMed);

    if (formAddMed) {
      formAddMed.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("add-med-name").value.trim();
        const dosage = document.getElementById("add-med-dosage").value.trim();
        const time = document.getElementById("add-med-time").value.trim();
        const timing = document.getElementById("add-med-timing").value;
        const food = document.getElementById("add-med-food").value.trim();
        const purpose = document.getElementById("add-med-purpose").value.trim();

        if (!name || !dosage) {
          showToast("Medication name and dosage are required.");
          return;
        }

        try {
          const res = await API.addMedication({
            profile_id: dashState.currentUserId,
            name: name,
            dosage: dosage,
            time: time || "08:00 AM",
            timing: timing,
            food_instruction: food || "Take with water",
            purpose: purpose || "Prescribed Regimen"
          });

          dashState.currentProfile = res.profile;
          closeAddMed();
          formAddMed.reset();
          ScheduleModule.render();
          if (window.DashboardCore) {
            window.DashboardCore.updateNotificationsList();
          }
          showToast("Medication added to schedule!");
        } catch (err) {
          showToast("Error adding medication: " + err.message);
        }
      });
    }
  }
};

window.ScheduleModule = ScheduleModule;
