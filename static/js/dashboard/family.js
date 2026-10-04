/**
 * DoseGuard AI - Dashboard Family Controller (family.js)
 * Manages family-wide medication transparency across all members.
 * Strictly no emojis.
 */

const FamilyModule = {
  render() {
    const container = document.getElementById("family-members-grid");
    if (!container) return;

    container.innerHTML = "";

    if (!dashState.allProfiles || dashState.allProfiles.length === 0) {
      container.innerHTML = `<div style="color: var(--slate-500);">No family members registered.</div>`;
      return;
    }

    const todayKey = new Date().toISOString().split("T")[0];

    dashState.allProfiles.forEach((member) => {
      const initials = member.initials || (member.first_name ? member.first_name.slice(0, 1) : "FM");
      const fullName = member.name || `${member.first_name || ""} ${member.last_name || ""}`.trim() || member.username;
      const role = member.role || "Family Member";
      const meds = member.medications || [];
      const logs = member.logs || {};
      const todayLogs = logs[todayKey] || {};

      let takenCount = 0;
      meds.forEach((m) => {
        if (todayLogs[m.id]) takenCount++;
      });
      const totalCount = meds.length;
      const pct = totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 100;

      const card = document.createElement("div");
      card.className = "card";
      card.style.cssText = "padding: 20px; display: flex; flex-direction: column; justify-content: space-between;";

      let medsHtml = "";
      if (meds.length === 0) {
        medsHtml = `<div style="font-size: 0.82rem; color: var(--slate-400); padding: 8px 0;">No active medications scheduled.</div>`;
      } else {
        medsHtml = meds.map((m) => {
          const isTaken = !!todayLogs[m.id];
          return `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid var(--slate-100); font-size: 0.83rem;">
              <div>
                <strong style="color: var(--slate-800);">${escapeHtml(m.name)}</strong>
                <span style="font-size: 0.75rem; color: var(--slate-500); margin-left: 6px;">${escapeHtml(m.time || m.timing)}</span>
              </div>
              <span style="font-size: 0.72rem; font-weight: 700; padding: 2px 8px; border-radius: var(--radius-full); ${isTaken ? "background: var(--success-light); color: var(--success);" : "background: #fef2f2; color: var(--accent-rose);"}">
                ${isTaken ? "Taken" : "Pending"}
              </span>
            </div>
          `;
        }).join("");
      }

      card.innerHTML = `
        <div>
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 40px; height: 40px; border-radius: var(--radius-full); background: ${member.badge_color || "var(--primary)"}; color: #fff; font-weight: 800; font-size: 0.95rem; display: flex; align-items: center; justify-content: center;">
                ${initials}
              </div>
              <div>
                <div style="font-weight: 800; font-size: 1rem; color: var(--slate-900);">${escapeHtml(fullName)}</div>
                <div style="font-size: 0.78rem; color: var(--slate-500);">${escapeHtml(role)} &bull; ${member.age || "-"} yrs</div>
              </div>
            </div>
            <span style="font-size: 0.75rem; font-weight: 800; padding: 3px 8px; border-radius: var(--radius-full); background: ${pct === 100 ? "var(--success-light)" : "var(--primary-light)"}; color: ${pct === 100 ? "var(--success)" : "var(--primary)"};">
              ${pct}% Adherence
            </span>
          </div>

          <div style="margin-bottom: 14px;">
            <div style="font-size: 0.75rem; font-weight: 700; color: var(--slate-400); text-transform: uppercase; margin-bottom: 6px;">Daily Intake Regimen</div>
            ${medsHtml}
          </div>
        </div>

        <div style="border-top: 1px solid var(--slate-100); padding-top: 10px; font-size: 0.75rem; color: var(--slate-400); display: flex; justify-content: space-between;">
          <span>Physician: ${escapeHtml(member.doctor || "Family Doctor")}</span>
          <span>Blood: ${escapeHtml(member.blood_group || "-")}</span>
        </div>
      `;

      container.appendChild(card);
    });
  }
};

window.FamilyModule = FamilyModule;
