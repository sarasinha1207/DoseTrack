/**
 * DoseTrack - Dashboard Family Controller (family.js)
 * Manages family-wide medication transparency across all members.
 * Connected through Primary Admin (Sunita Sharma).
 * Strictly no emojis.
 */

const FamilyModule = {
  currentFilter: "all",

  async render() {
    const container = document.getElementById("family-members-grid");
    const compContainer = document.getElementById("family-comparison-container");
    const aggregateBadge = document.getElementById("family-aggregate-badge");
    const totalMedsCount = document.getElementById("total-family-meds-count");
    const masterTbody = document.getElementById("family-meds-master-tbody");
    const filtersContainer = document.getElementById("family-table-filters");

    // Always fetch fresh family overview data to ensure medications are never missing
    try {
      const famRes = await API.getAllFamilyMedications();
      if (famRes && (famRes.family_overview || famRes.family)) {
        dashState.allProfiles = famRes.family_overview || famRes.family || [];
        dashState.familyAdmin = famRes.admin || null;
      }
    } catch (err) {
      console.warn("Could not reload family medications in family.js:", err);
    }

    const profiles = dashState.allProfiles || [];

    if (!container) return;
    container.innerHTML = "";
    if (compContainer) compContainer.innerHTML = "";
    if (masterTbody) masterTbody.innerHTML = "";

    if (profiles.length === 0) {
      container.innerHTML = `<div style="color: var(--slate-500); padding: 20px;">Loading family members and medication records...</div>`;
      if (compContainer) {
        compContainer.innerHTML = `<div style="color: var(--slate-500); font-size: 0.85rem;">No family records available.</div>`;
      }
      return;
    }

    let totalFamilyMeds = 0;
    let totalFamilyTaken = 0;
    let cardioCount = 0;
    let metabolicCount = 0;
    let boneCount = 0;
    let vitaminCount = 0;

    // Filter controls setup
    if (filtersContainer && filtersContainer.children.length === 0) {
      this.setupFilterPills(profiles, filtersContainer);
    }

    // Process profiles and medications
    const allMasterMeds = [];

    profiles.forEach((member) => {
      const initials = member.initials || (member.first_name ? member.first_name.slice(0, 1) : "FM");
      const fullName = member.name || `${member.first_name || ""} ${member.last_name || ""}`.trim() || member.username;
      const role = member.role || "Family Member";
      const meds = member.medications || [];
      const isAdmin = !!member.is_admin;
      const adminName = member.admin_name || "Sunita Sharma";

      let memberTaken = 0;
      meds.forEach((m) => {
        const isTaken = !!m.is_taken;
        if (isTaken) memberTaken++;

        // Categorize for therapeutic distribution
        const pLower = (m.purpose || "").toLowerCase() + " " + (m.name || "").toLowerCase();
        if (pLower.includes("pressure") || pLower.includes("cardio") || pLower.includes("lipid") || pLower.includes("cholesterol") || pLower.includes("telmisartan") || pLower.includes("atorvastatin") || pLower.includes("amlodipine") || pLower.includes("aspirin")) {
          cardioCount++;
        } else if (pLower.includes("sugar") || pLower.includes("glycemic") || pLower.includes("diabetes") || pLower.includes("metformin") || pLower.includes("glimepiride")) {
          metabolicCount++;
        } else if (pLower.includes("calcium") || pLower.includes("bone") || pLower.includes("joint") || pLower.includes("shelcal") || pLower.includes("osteopenia") || pLower.includes("d3")) {
          boneCount++;
        } else {
          vitaminCount++;
        }

        allMasterMeds.push({
          memberId: member.id,
          memberName: fullName,
          memberRole: role,
          memberColor: member.badge_color || "var(--primary)",
          memberInitials: initials,
          med: m
        });
      });

      const memberTotal = meds.length;
      const memberPct = memberTotal > 0 ? Math.round((memberTaken / memberTotal) * 100) : 100;

      totalFamilyMeds += memberTotal;
      totalFamilyTaken += memberTaken;

      // Populate comparative progress bar
      if (compContainer) {
        const compItem = document.createElement("div");
        compItem.className = "family-comp-item";
        const barColor = memberPct === 100 ? "var(--success)" : (memberPct >= 50 ? "var(--primary)" : "var(--accent-rose)");
        compItem.innerHTML = `
          <div class="family-comp-header">
            <span>
              <strong>${escapeHtml(fullName)}</strong> (${escapeHtml(role)})
              ${isAdmin ? '<span style="font-size:0.68rem; font-weight:800; background:#e0f2fe; color:#0369a1; padding:1px 6px; border-radius:10px; margin-left:6px;">Admin</span>' : ''}
            </span>
            <span>${memberPct}% (${memberTaken}/${memberTotal} taken)</span>
          </div>
          <div class="family-comp-track">
            <div class="family-comp-fill" style="width: ${memberPct}%; background: ${barColor};"></div>
          </div>
        `;
        compContainer.appendChild(compItem);
      }

      // Populate individual member card (if matching filter)
      if (this.currentFilter === "all" || this.currentFilter === member.id) {
        const card = document.createElement("div");
        card.className = "card";
        card.style.cssText = "padding: 20px; display: flex; flex-direction: column; justify-content: space-between;";

        let medsHtml = "";
        if (meds.length === 0) {
          medsHtml = `<div style="font-size: 0.82rem; color: var(--slate-400); padding: 10px 0;">No active medications scheduled.</div>`;
        } else {
          medsHtml = meds.map((m) => {
            const isTaken = !!m.is_taken;
            return `
              <div style="display: flex; justify-content: space-between; align-items: flex-start; padding: 8px 0; border-bottom: 1px solid var(--slate-100); font-size: 0.83rem;">
                <div style="flex: 1; min-width: 0; padding-right: 8px;">
                  <div style="font-weight: 700; color: var(--slate-900);">${escapeHtml(m.name)}</div>
                  <div style="font-size: 0.76rem; color: var(--slate-600); margin-top: 1px;">
                    ${escapeHtml(m.dosage)} &bull; ${escapeHtml(m.time || m.timing)} &bull; <span style="color: var(--primary);">${escapeHtml(m.timing || "Routine")}</span>
                  </div>
                  <div style="font-size: 0.72rem; color: var(--slate-500); margin-top: 2px;">
                    ${escapeHtml(m.food_instruction || "Take with plain water")}
                  </div>
                </div>
                <span style="font-size: 0.72rem; font-weight: 700; padding: 3px 8px; border-radius: var(--radius-full); flex-shrink: 0; ${isTaken ? "background: var(--success-light); color: var(--success);" : "background: #fef2f2; color: var(--accent-rose);"}">
                  ${isTaken ? "Taken" : "Pending"}
                </span>
              </div>
            `;
          }).join("");
        }

        const adminBadgeHtml = isAdmin
          ? `<span style="font-size:0.68rem; font-weight:800; background:#e0f2fe; color:#0369a1; border:1px solid #bae6fd; padding:2px 7px; border-radius:var(--radius-full); text-transform:uppercase;">Primary Admin</span>`
          : `<span class="card-admin-link-badge">Connected to Admin: ${escapeHtml(adminName)}</span>`;

        card.innerHTML = `
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 42px; height: 42px; border-radius: var(--radius-full); background: ${member.badge_color || "var(--primary)"}; color: #fff; font-weight: 800; font-size: 0.95rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                  ${initials}
                </div>
                <div>
                  <div style="font-weight: 800; font-size: 1rem; color: var(--slate-900);">${escapeHtml(fullName)}</div>
                  <div style="font-size: 0.78rem; color: var(--slate-500); margin-bottom: 2px;">${escapeHtml(role)} &bull; ${member.age || "-"} yrs</div>
                  <div>${adminBadgeHtml}</div>
                </div>
              </div>
              <span style="font-size: 0.75rem; font-weight: 800; padding: 4px 10px; border-radius: var(--radius-full); ${memberPct === 100 ? "background: var(--success-light); color: var(--success);" : "background: var(--primary-light); color: var(--primary);"}">
                ${memberPct}% Today
              </span>
            </div>

            <div style="margin-top: 14px; margin-bottom: 14px;">
              <div style="display: flex; justify-content: space-between; font-size: 0.74rem; font-weight: 700; color: var(--slate-400); text-transform: uppercase; margin-bottom: 6px;">
                <span>Active Prescriptions</span>
                <span>${meds.length} Regimens</span>
              </div>
              ${medsHtml}
            </div>
          </div>

          <div style="border-top: 1px solid var(--slate-100); padding-top: 10px; font-size: 0.75rem; color: var(--slate-500); display: flex; justify-content: space-between; flex-wrap: wrap; gap: 6px;">
            <span>Physician: <strong>${escapeHtml(member.doctor || "Family Physician")}</strong></span>
            <span>Blood Group: <strong>${escapeHtml(member.blood_group || "-")}</strong></span>
          </div>
        `;

        container.appendChild(card);
      }
    });

    // Populate Master Family Medications Table
    if (masterTbody) {
      const filteredMeds = (this.currentFilter === "all")
        ? allMasterMeds
        : allMasterMeds.filter((item) => item.memberId === this.currentFilter);

      if (filteredMeds.length === 0) {
        masterTbody.innerHTML = `
          <tr>
            <td colspan="8" style="text-align: center; color: var(--slate-400); padding: 24px;">
              No medications matching the selected filter.
            </td>
          </tr>
        `;
      } else {
        masterTbody.innerHTML = filteredMeds.map((item) => {
          const m = item.med;
          const isTaken = !!m.is_taken;
          return `
            <tr>
              <td>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="width: 26px; height: 26px; border-radius: var(--radius-full); background: ${item.memberColor}; color: #ffffff; font-weight: 800; font-size: 0.72rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    ${item.memberInitials}
                  </span>
                  <div>
                    <div style="font-weight: 700; color: var(--slate-900); font-size: 0.85rem;">${escapeHtml(item.memberName)}</div>
                    <div style="font-size: 0.72rem; color: var(--slate-500);">${escapeHtml(item.memberRole)}</div>
                  </div>
                </div>
              </td>
              <td>
                <strong style="color: var(--slate-900);">${escapeHtml(m.name)}</strong>
              </td>
              <td>
                <span style="font-weight: 600; color: var(--slate-700);">${escapeHtml(m.dosage)}</span>
              </td>
              <td>
                <span style="font-weight: 700; color: var(--slate-800);">${escapeHtml(m.time || "-")}</span>
              </td>
              <td>
                <span style="font-size: 0.74rem; font-weight: 700; padding: 2px 8px; border-radius: var(--radius-full); background: #f1f5f9; color: var(--slate-700);">
                  ${escapeHtml(m.timing || "Routine")}
                </span>
              </td>
              <td style="max-width: 220px; font-size: 0.8rem; color: var(--slate-600);">
                ${escapeHtml(m.food_instruction || "Take with plain water")}
              </td>
              <td style="max-width: 220px; font-size: 0.78rem; color: var(--slate-500);">
                <span style="color: var(--slate-800); font-weight: 600;">${escapeHtml(m.purpose || "Prescribed Regimen")}</span>
                ${m.caution ? `<div style="font-size: 0.72rem; color: var(--slate-400);">${escapeHtml(m.caution)}</div>` : ''}
              </td>
              <td>
                <span style="font-size: 0.72rem; font-weight: 700; padding: 3px 8px; border-radius: var(--radius-full); ${isTaken ? "background: var(--success-light); color: var(--success);" : "background: #fef2f2; color: var(--accent-rose);"}">
                  ${isTaken ? "Taken" : "Pending"}
                </span>
              </td>
            </tr>
          `;
        }).join("");
      }
    }

    // Update aggregate badges
    if (aggregateBadge) {
      const aggPct = totalFamilyMeds > 0 ? Math.round((totalFamilyTaken / totalFamilyMeds) * 100) : 100;
      aggregateBadge.textContent = `${aggPct}% Family Rate`;
    }

    if (totalMedsCount) {
      totalMedsCount.textContent = `${totalFamilyMeds} Active Regimens`;
    }

    const cardioEl = document.getElementById("cat-count-cardio");
    const metabolicEl = document.getElementById("cat-count-metabolic");
    const boneEl = document.getElementById("cat-count-bone");
    const vitaminEl = document.getElementById("cat-count-vitamins");

    if (cardioEl) cardioEl.textContent = `${cardioCount} Meds`;
    if (metabolicEl) metabolicEl.textContent = `${metabolicCount} Meds`;
    if (boneEl) boneEl.textContent = `${boneCount} Meds`;
    if (vitaminEl) vitaminEl.textContent = `${vitaminCount} Meds`;
  },

  setupFilterPills(profiles, container) {
    container.innerHTML = "";

    const allBtn = document.createElement("button");
    allBtn.type = "button";
    allBtn.className = "filter-pill-btn active";
    allBtn.textContent = "All Family Members";
    allBtn.addEventListener("click", () => {
      container.querySelectorAll(".filter-pill-btn").forEach((b) => b.classList.remove("active"));
      allBtn.classList.add("active");
      this.currentFilter = "all";
      this.render();
    });
    container.appendChild(allBtn);

    profiles.forEach((p) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "filter-pill-btn";
      const fName = p.first_name || p.name.split(" ")[0];
      btn.textContent = `${fName} (${p.role})`;
      btn.addEventListener("click", () => {
        container.querySelectorAll(".filter-pill-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentFilter = p.id;
        this.render();
      });
      container.appendChild(btn);
    });
  }
};

window.FamilyModule = FamilyModule;
