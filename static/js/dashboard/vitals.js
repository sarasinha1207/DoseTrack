/**
 * DoseGuard AI - Health Vitals Controller (vitals.js)
 * Manages Blood Pressure (BP) & Blood Sugar records,
 * computes Mean, Highest, Lowest statistical metrics,
 * renders native interactive SVG trend graphs, and exports CSV.
 * Strictly zero emojis.
 */

const VitalsModule = {
  currentFilterMember: "all",
  vitalsData: [],
  statsData: null,

  init() {
    this.setupTypeToggle();
    this.setupForm();
    this.setupFilter();
    this.prefillDateTime();
  },

  prefillDateTime() {
    const dateInput = document.getElementById("vital-input-date");
    const timeInput = document.getElementById("vital-input-time");
    const now = new Date();
    if (dateInput) {
      dateInput.value = now.toISOString().split("T")[0];
    }
    if (timeInput) {
      const hours = now.getHours();
      const mins = String(now.getMinutes()).padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      const formattedHours = String(hours % 12 || 12).padStart(2, "0");
      timeInput.value = `${formattedHours}:${mins} ${ampm}`;
    }
  },

  setupTypeToggle() {
    const btnBp = document.getElementById("btn-vital-type-bp");
    const btnSugar = document.getElementById("btn-vital-type-sugar");
    const fieldsetBp = document.getElementById("fieldset-vital-bp");
    const fieldsetSugar = document.getElementById("fieldset-vital-sugar");
    const inputType = document.getElementById("vital-input-type");

    if (btnBp && btnSugar) {
      btnBp.addEventListener("click", () => {
        btnBp.classList.add("active");
        btnBp.classList.remove("btn-secondary");
        btnBp.classList.add("btn-primary");

        btnSugar.classList.remove("active");
        btnSugar.classList.remove("btn-primary");
        btnSugar.classList.add("btn-secondary");

        if (fieldsetBp) fieldsetBp.style.display = "grid";
        if (fieldsetSugar) fieldsetSugar.style.display = "none";
        if (inputType) inputType.value = "bp";
      });

      btnSugar.addEventListener("click", () => {
        btnSugar.classList.add("active");
        btnSugar.classList.remove("btn-secondary");
        btnSugar.classList.add("btn-primary");

        btnBp.classList.remove("active");
        btnBp.classList.remove("btn-primary");
        btnBp.classList.add("btn-secondary");

        if (fieldsetBp) fieldsetBp.style.display = "none";
        if (fieldsetSugar) fieldsetSugar.style.display = "grid";
        if (inputType) inputType.value = "sugar";
      });
    }

    const toggleBtn = document.getElementById("btn-toggle-add-vital-form");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        const formCard = document.getElementById("card-add-vital");
        if (formCard) {
          formCard.scrollIntoView({ behavior: "smooth" });
        }
      });
    }
  },

  populateMemberSelects() {
    const filterSelect = document.getElementById("vitals-filter-member");
    const formMemberSelect = document.getElementById("vital-input-member");
    if (!dashState.allProfiles || dashState.allProfiles.length === 0) return;

    if (filterSelect) {
      const current = this.currentFilterMember || "all";
      filterSelect.innerHTML = `<option value="all" ${current === "all" ? "selected" : ""}>All Family Members</option>` +
        dashState.allProfiles.map((p) => {
          return `<option value="${p.id}" ${p.id === current ? "selected" : ""}>${escapeHtml(p.name || p.username)} (${escapeHtml(p.role || "Member")})</option>`;
        }).join("");
    }

    if (formMemberSelect) {
      const activeUser = dashState.currentUserId || "mother";
      formMemberSelect.innerHTML = dashState.allProfiles.map((p) => {
        return `<option value="${p.id}" ${p.id === activeUser ? "selected" : ""}>${escapeHtml(p.name || p.username)} (${escapeHtml(p.role || "Member")})</option>`;
      }).join("");
    }
  },

  setupFilter() {
    const filterSelect = document.getElementById("vitals-filter-member");
    if (filterSelect) {
      filterSelect.addEventListener("change", (e) => {
        this.currentFilterMember = e.target.value;
        this.loadAndRender();
      });
    }
  },

  setupForm() {
    const form = document.getElementById("form-add-vital");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const inputType = document.getElementById("vital-input-type").value;
      const memberId = document.getElementById("vital-input-member").value;
      const dateVal = document.getElementById("vital-input-date").value;
      const timeVal = document.getElementById("vital-input-time").value.trim();
      const notesVal = document.getElementById("vital-input-notes").value.trim();

      const payload = {
        profile_id: memberId,
        measurement_type: inputType,
        date: dateVal,
        time: timeVal || "08:00 AM",
        notes: notesVal
      };

      if (inputType === "bp") {
        const sys = parseInt(document.getElementById("vital-bp-systolic").value, 10);
        const dia = parseInt(document.getElementById("vital-bp-diastolic").value, 10);
        const pulse = parseInt(document.getElementById("vital-bp-pulse").value, 10);

        if (isNaN(sys) || isNaN(dia)) {
          showToast("Valid systolic and diastolic numbers are required.");
          return;
        }
        payload.systolic = sys;
        payload.diastolic = dia;
        payload.pulse = isNaN(pulse) ? 72 : pulse;

      } else {
        const sugar = parseFloat(document.getElementById("vital-sugar-value").value);
        const ctx = document.getElementById("vital-sugar-context").value;

        if (isNaN(sugar)) {
          showToast("Valid blood sugar value is required.");
          return;
        }
        payload.sugar_value = sugar;
        payload.sugar_context = ctx;
      }

      try {
        await API.addVital(payload);
        showToast("Vital reading recorded successfully.");
        document.getElementById("vital-input-notes").value = "";
        this.prefillDateTime();
        await this.loadAndRender();
      } catch (err) {
        showToast("Error saving vital reading: " + err.message);
      }
    });
  },

  async loadAndRender() {
    try {
      this.populateMemberSelects();
      const filterId = this.currentFilterMember === "all" ? null : this.currentFilterMember;
      const res = await API.getVitals(filterId);

      this.vitalsData = res.vitals || [];
      this.statsData = res.stats || {};

      this.renderStats();
      this.renderBpChart();
      this.renderSugarChart();
      this.renderTable();

    } catch (err) {
      console.error("Failed to load vitals:", err);
      showToast("Error loading health vitals: " + err.message);
    }
  },

  renderStats() {
    if (!this.statsData) return;
    const bp = this.statsData.bp || {};
    const sugar = this.statsData.sugar || {};

    // BP Highlights
    const elBpMean = document.getElementById("stat-bp-mean");
    const elBpPulse = document.getElementById("stat-bp-mean-pulse");
    const elBpHighest = document.getElementById("stat-bp-highest");
    const elBpHighestMeta = document.getElementById("stat-bp-highest-meta");
    const elBpLowest = document.getElementById("stat-bp-lowest");
    const elBpLowestMeta = document.getElementById("stat-bp-lowest-meta");
    const elBpCount = document.getElementById("bp-stats-count-label");

    if (elBpMean) elBpMean.textContent = bp.mean_bp || "0/0";
    if (elBpPulse) elBpPulse.textContent = `Pulse: ${bp.mean_pulse || 72} bpm`;
    if (elBpHighest) elBpHighest.textContent = bp.highest_bp || "0/0";
    if (elBpHighestMeta) elBpHighestMeta.textContent = `${bp.highest_date || "-"} ${bp.highest_member ? "&bull; " + bp.highest_member : ""}`;
    if (elBpLowest) elBpLowest.textContent = bp.lowest_bp || "0/0";
    if (elBpLowestMeta) elBpLowestMeta.textContent = `${bp.lowest_date || "-"} ${bp.lowest_member ? "&bull; " + bp.lowest_member : ""}`;
    if (elBpCount) elBpCount.textContent = `${bp.count || 0} BP readings analyzed`;

    // Sugar Highlights
    const elSugarMean = document.getElementById("stat-sugar-mean");
    const elSugarHighest = document.getElementById("stat-sugar-highest");
    const elSugarHighestMeta = document.getElementById("stat-sugar-highest-meta");
    const elSugarLowest = document.getElementById("stat-sugar-lowest");
    const elSugarLowestMeta = document.getElementById("stat-sugar-lowest-meta");
    const elSugarCount = document.getElementById("sugar-stats-count-label");

    if (elSugarMean) elSugarMean.textContent = sugar.mean_sugar ? `${sugar.mean_sugar}` : "-";
    if (elSugarHighest) elSugarHighest.textContent = sugar.highest_sugar || "-";
    if (elSugarHighestMeta) elSugarHighestMeta.textContent = `${sugar.highest_context || ""} ${sugar.highest_date ? "&bull; " + sugar.highest_date : ""}`;
    if (elSugarLowest) elSugarLowest.textContent = sugar.lowest_sugar || "-";
    if (elSugarLowestMeta) elSugarLowestMeta.textContent = `${sugar.lowest_context || ""} ${sugar.lowest_date ? "&bull; " + sugar.lowest_date : ""}`;
    if (elSugarCount) elSugarCount.textContent = `${sugar.count || 0} glucose tests analyzed`;
  },

  renderBpChart() {
    const container = document.getElementById("bp-chart-container");
    if (!container) return;

    // Filter BP readings and sort chronologically (oldest to newest)
    const bpList = this.vitalsData
      .filter((v) => v.measurement_type === "bp" && v.systolic != null)
      .slice(0, 12)
      .reverse();

    if (bpList.length === 0) {
      container.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--slate-400);font-size:0.85rem;">No BP readings available for this filter.</div>`;
      return;
    }

    const width = 500;
    const height = 200;
    const padX = 45;
    const padY = 25;
    const chartW = width - padX * 2;
    const chartH = height - padY * 2;

    const minSys = 60;
    const maxSys = 160;

    const getX = (idx) => padX + (idx / Math.max(bpList.length - 1, 1)) * chartW;
    const getY = (val) => padY + chartH - ((val - minSys) / (maxSys - minSys)) * chartH;

    // Normal threshold lines (120 Systolic, 80 Diastolic)
    const y120 = getY(120);
    const y80 = getY(80);

    let sysPoints = "";
    let diaPoints = "";
    let dotsHtml = "";

    bpList.forEach((item, idx) => {
      const x = getX(idx);
      const ySys = getY(item.systolic);
      const yDia = getY(item.diastolic);

      sysPoints += `${idx === 0 ? "M" : "L"} ${x} ${ySys} `;
      diaPoints += `${idx === 0 ? "M" : "L"} ${x} ${yDia} `;

      const shortDate = item.date.slice(5); // MM-DD
      dotsHtml += `
        <circle cx="${x}" cy="${ySys}" r="4" fill="#4f46e5" stroke="#ffffff" stroke-width="1.5">
          <title>${item.member_name}: ${item.systolic}/${item.diastolic} mmHg (${item.date})</title>
        </circle>
        <circle cx="${x}" cy="${yDia}" r="4" fill="#059669" stroke="#ffffff" stroke-width="1.5">
          <title>${item.member_name}: Diastolic ${item.diastolic} mmHg (${item.date})</title>
        </circle>
        <text x="${x}" y="${height - 6}" font-size="9" fill="#64748b" text-anchor="middle">${shortDate}</text>
      `;
    });

    container.innerHTML = `
      <svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" style="display:block;">
        <!-- Grid lines & guidelines -->
        <line x1="${padX}" y1="${y120}" x2="${width - padX}" y2="${y120}" stroke="#c7d2fe" stroke-width="1" stroke-dasharray="3 3"></line>
        <text x="${padX - 6}" y="${y120 + 3}" font-size="9" fill="#4f46e5" text-anchor="end">120</text>

        <line x1="${padX}" y1="${y80}" x2="${width - padX}" y2="${y80}" stroke="#a7f3d0" stroke-width="1" stroke-dasharray="3 3"></line>
        <text x="${padX - 6}" y="${y80 + 3}" font-size="9" fill="#059669" text-anchor="end">80</text>

        <!-- Lines -->
        <path d="${sysPoints}" fill="none" stroke="#4f46e5" stroke-width="2.5" stroke-linecap="round"></path>
        <path d="${diaPoints}" fill="none" stroke="#059669" stroke-width="2.5" stroke-linecap="round"></path>

        <!-- Dots & Date labels -->
        ${dotsHtml}
      </svg>
    `;
  },

  renderSugarChart() {
    const container = document.getElementById("sugar-chart-container");
    if (!container) return;

    // Filter sugar readings and sort chronologically
    const sugarList = this.vitalsData
      .filter((v) => v.measurement_type === "sugar" && v.sugar_value != null)
      .slice(0, 12)
      .reverse();

    if (sugarList.length === 0) {
      container.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--slate-400);font-size:0.85rem;">No Blood Sugar tests available for this filter.</div>`;
      return;
    }

    const width = 500;
    const height = 200;
    const padX = 45;
    const padY = 25;
    const chartW = width - padX * 2;
    const chartH = height - padY * 2;

    const minSugar = 60;
    const maxSugar = 200;

    const getX = (idx) => padX + (idx / Math.max(sugarList.length - 1, 1)) * chartW;
    const getY = (val) => padY + chartH - ((val - minSugar) / (maxSugar - minSugar)) * chartH;

    const y140 = getY(140);
    const y100 = getY(100);

    let pathPoints = "";
    let dotsHtml = "";

    sugarList.forEach((item, idx) => {
      const x = getX(idx);
      const y = getY(item.sugar_value);
      pathPoints += `${idx === 0 ? "M" : "L"} ${x} ${y} `;

      const isFasting = (item.sugar_context || "").toLowerCase().includes("fast");
      const dotColor = isFasting ? "#059669" : "#d97706";
      const shortDate = item.date.slice(5);

      dotsHtml += `
        <circle cx="${x}" cy="${y}" r="4.5" fill="${dotColor}" stroke="#ffffff" stroke-width="1.5">
          <title>${item.member_name}: ${item.sugar_value} mg/dL (${item.sugar_context}) on ${item.date}</title>
        </circle>
        <text x="${x}" y="${y - 8}" font-size="9" font-weight="700" fill="${dotColor}" text-anchor="middle">${Math.round(item.sugar_value)}</text>
        <text x="${x}" y="${height - 6}" font-size="9" fill="#64748b" text-anchor="middle">${shortDate}</text>
      `;
    });

    container.innerHTML = `
      <svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" style="display:block;">
        <!-- Optimal Zone Band -->
        <rect x="${padX}" y="${y140}" width="${chartW}" height="${y100 - y140}" fill="#ecfdf5" opacity="0.6"></rect>

        <line x1="${padX}" y1="${y140}" x2="${width - padX}" y2="${y140}" stroke="#fde68a" stroke-width="1" stroke-dasharray="3 3"></line>
        <text x="${padX - 6}" y="${y140 + 3}" font-size="9" fill="#d97706" text-anchor="end">140</text>

        <line x1="${padX}" y1="${y100}" x2="${width - padX}" y2="${y100}" stroke="#a7f3d0" stroke-width="1" stroke-dasharray="3 3"></line>
        <text x="${padX - 6}" y="${y100 + 3}" font-size="9" fill="#059669" text-anchor="end">100</text>

        <!-- Trend Line -->
        <path d="${pathPoints}" fill="none" stroke="#d97706" stroke-width="2" stroke-linecap="round"></path>

        <!-- Dots & Labels -->
        ${dotsHtml}
      </svg>
    `;
  },

  renderTable() {
    const tbody = document.getElementById("vitals-table-body");
    const countEl = document.getElementById("table-record-count");
    if (!tbody) return;

    if (countEl) {
      countEl.textContent = `Showing ${this.vitalsData.length} records`;
    }

    if (this.vitalsData.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="padding: 30px; text-align: center; color: var(--slate-400);">
            No vital readings recorded for this selection. Use the form above to log a reading.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = this.vitalsData.map((v) => {
      const isBp = v.measurement_type === "bp";
      const readingDisplay = isBp
        ? `<strong>${v.systolic}/${v.diastolic}</strong> <span style="font-size:0.75rem;color:var(--slate-500);">${v.unit}</span> (Pulse: ${v.pulse || 72})`
        : `<strong>${v.sugar_value}</strong> <span style="font-size:0.75rem;color:var(--slate-500);">${v.unit}</span>`;

      const typeBadgeBg = isBp ? "background: #e0e7ff; color: #4338ca;" : "background: #fef3c7; color: #b45309;";
      const catColor = (v.category_status || "").toLowerCase().includes("normal")
        ? "background: var(--success-light); color: var(--success);"
        : (v.category_status || "").toLowerCase().includes("stage 1") || (v.category_status || "").toLowerCase().includes("mild")
        ? "background: #fef3c7; color: #b45309;"
        : "background: #fee2e2; color: #b91c1c;";

      return `
        <tr style="border-bottom: 1px solid var(--slate-100);">
          <td style="padding: 10px 12px; font-size: 0.82rem; color: var(--slate-800); white-space: nowrap;">
            ${escapeHtml(v.date)}<br>
            <span style="font-size: 0.75rem; color: var(--slate-500);">${escapeHtml(v.time)}</span>
          </td>
          <td style="padding: 10px 12px;">
            <strong style="color: var(--slate-900); font-size: 0.85rem;">${escapeHtml(v.member_name)}</strong>
            <div style="font-size: 0.72rem; color: var(--slate-500);">${escapeHtml(v.role)}</div>
          </td>
          <td style="padding: 10px 12px;">
            <span style="font-size: 0.72rem; font-weight: 700; padding: 2px 8px; border-radius: var(--radius-full); ${typeBadgeBg}">
              ${isBp ? "Blood Pressure" : "Blood Sugar"}
            </span>
          </td>
          <td style="padding: 10px 12px; font-size: 0.88rem; color: var(--slate-900);">
            ${readingDisplay}
          </td>
          <td style="padding: 10px 12px;">
            <span style="font-size: 0.72rem; font-weight: 700; padding: 2px 8px; border-radius: var(--radius-full); ${catColor}">
              ${escapeHtml(v.category_status || "Normal")}
            </span>
          </td>
          <td style="padding: 10px 12px; font-size: 0.8rem; color: var(--slate-600); max-width: 240px;">
            <div style="font-weight: 600; color: var(--slate-700);">${escapeHtml(v.sugar_context || "Resting")}</div>
            <div style="color: var(--slate-500); font-size: 0.75rem;">${escapeHtml(v.notes || "-")}</div>
          </td>
          <td style="padding: 10px 12px; text-align: right;">
            <button type="button" class="btn btn-secondary btn-sm btn-delete-vital" data-id="${v.id}" style="padding: 2px 8px; font-size: 0.72rem; color: var(--danger); border-color: var(--danger-border);" title="Delete reading">
              Delete
            </button>
          </td>
        </tr>
      `;
    }).join("");

    tbody.querySelectorAll(".btn-delete-vital").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-id");
        if (confirm("Delete this vital reading record?")) {
          try {
            await API.deleteVital(id);
            showToast("Reading deleted.");
            await this.loadAndRender();
          } catch (err) {
            showToast("Error deleting reading: " + err.message);
          }
        }
      });
    });
  }
};

window.VitalsModule = VitalsModule;
