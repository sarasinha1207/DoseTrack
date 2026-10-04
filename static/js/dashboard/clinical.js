/**
 * DoseGuard AI - Dashboard Clinical Guidance Controller (clinical.js)
 * Manages prescription text parsing, clinical samples, and regimen import.
 * Strictly no emojis.
 */

const ClinicalModule = {
  init() {
    const btnParse = document.getElementById("btn-parse-prescription");
    const sampleButtons = document.querySelectorAll(".sample-rx-btn");
    const txtInput = document.getElementById("input-prescription-text");
    const resultContainer = document.getElementById("parsed-results-box");

    sampleButtons.forEach((btn) => {
      btn.addEventListener("click", async () => {
        const key = btn.getAttribute("data-key");
        btn.disabled = true;
        try {
          const samples = await API.getSamples();
          if (samples.samples && samples.samples[key]) {
            if (txtInput) txtInput.value = samples.samples[key];
          }
        } catch (err) {
          console.error(err);
        } finally {
          btn.disabled = false;
        }
      });
    });

    if (btnParse) {
      btnParse.addEventListener("click", async () => {
        const text = txtInput ? txtInput.value.trim() : "";
        if (!text) {
          showToast("Please enter or load prescription text first.");
          return;
        }

        btnParse.disabled = true;
        btnParse.textContent = "Analyzing with AI...";

        try {
          const parsed = await API.parsePrescription(text);
          this.renderParsedResults(parsed, resultContainer);
        } catch (err) {
          showToast("Parsing error: " + err.message);
        } finally {
          btnParse.disabled = false;
          btnParse.textContent = "Analyze Prescription with AI";
        }
      });
    }
  },

  renderParsedResults(data, container) {
    if (!container) return;

    const meds = data.medications || [];
    if (meds.length === 0) {
      container.innerHTML = `<div style="color: var(--slate-600);">No structured medications could be identified. Please verify the format.</div>`;
      return;
    }

    let html = `
      <div style="margin-bottom: 12px; font-weight: 700; color: var(--slate-900);">
        Extracted ${meds.length} Medication(s):
      </div>
    `;

    meds.forEach((m) => {
      html += `
        <div style="background: var(--slate-50); border: 1px solid var(--slate-200); border-radius: var(--radius-md); padding: 10px 14px; margin-bottom: 8px;">
          <div style="display: flex; justify-content: space-between; font-weight: 700; color: var(--slate-900);">
            <span>${escapeHtml(m.name)}</span>
            <span style="color: var(--primary);">${escapeHtml(m.dosage)}</span>
          </div>
          <div style="font-size: 0.8rem; color: var(--slate-600); margin-top: 2px;">
            Timing: ${escapeHtml(m.timing || "Morning")} &bull; ${escapeHtml(m.food_instruction || "Take with water")}
          </div>
        </div>
      `;
    });

    html += `
      <button type="button" class="btn btn-primary btn-sm" id="btn-import-parsed-meds" style="margin-top: 10px;">
        Import Extracted Regimens to Schedule
      </button>
    `;

    container.innerHTML = html;

    const btnImport = document.getElementById("btn-import-parsed-meds");
    if (btnImport) {
      btnImport.addEventListener("click", async () => {
        btnImport.disabled = true;
        btnImport.textContent = "Importing...";
        try {
          for (const m of meds) {
            await API.addMedication({
              profile_id: dashState.currentUserId,
              name: m.name,
              dosage: m.dosage,
              time: m.time || "08:00 AM",
              timing: m.timing || "Morning",
              food_instruction: m.food_instruction || "Take with water",
              purpose: m.purpose || "Prescribed Regimen"
            });
          }
          const profileRes = await API.getProfile(dashState.currentUserId);
          dashState.currentProfile = profileRes.profile;
          if (window.ScheduleModule) {
            window.ScheduleModule.render();
          }
          if (window.DashboardCore) {
            window.DashboardCore.updateNotificationsList();
          }
          showToast("Prescription medications successfully imported into your schedule!");
        } catch (err) {
          showToast("Import failed: " + err.message);
        } finally {
          btnImport.disabled = false;
          btnImport.textContent = "Import Extracted Regimens to Schedule";
        }
      });
    }
  }
};

window.ClinicalModule = ClinicalModule;
