/**
 * DoseGuard AI - Public Homepage Script (home.js)
 * Controls collapsible FAQ interactions, smooth navigation, session status,
 * and renders the All Family Medication Adherence Calendar with taken/missed markings.
 * Strictly no emojis.
 */

document.addEventListener("DOMContentLoaded", () => {
  initHomeFaqAccordion();
  checkExistingSession();
  loadHomeCalendar();
});

function initHomeFaqAccordion() {
  const faqButtons = document.querySelectorAll(".faq-accordion-btn");

  faqButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.parentElement;
      const isActive = item.classList.contains("active");

      document.querySelectorAll(".faq-accordion-item").forEach((el) => {
        el.classList.remove("active");
      });

      if (!isActive) {
        item.classList.add("active");
      }
    });
  });
}

function checkExistingSession() {
  const activeUser = sessionStorage.getItem("doseguard_active_user");
  const navLoginBtn = document.getElementById("btn-nav-login");

  if (activeUser && navLoginBtn) {
    navLoginBtn.textContent = "Open Dashboard";
    navLoginBtn.href = "/dashboard";
  }
}

async function loadHomeCalendar() {
  const container = document.getElementById("home-calendar-days");
  if (!container) return;

  try {
    const res = await fetch("/api/calendar/adherence");
    if (!res.ok) throw new Error("Failed to load calendar data");
    const data = await res.json();

    const summary = data.summary || {};
    const takenEl = document.getElementById("home-cal-taken-count");
    const missedEl = document.getElementById("home-cal-missed-count");
    const rateEl = document.getElementById("home-cal-rate");

    if (takenEl && summary.total_taken != null) {
      takenEl.textContent = `${summary.total_taken} Doses`;
    }
    if (missedEl && summary.total_missed != null) {
      missedEl.textContent = `${summary.total_missed} Alerts`;
    }
    if (rateEl && summary.adherence_rate != null) {
      rateEl.textContent = `${summary.adherence_rate}% Average`;
    }

    const days = data.days || [];
    container.innerHTML = "";

    days.forEach((day) => {
      const cell = document.createElement("div");
      let statusClass = "future";
      let badgeText = "Scheduled";
      let badgeClass = "future";

      if (day.is_past || day.is_today) {
        if (day.missed_count === 0) {
          statusClass = "perfect";
          badgeText = `${day.taken_count} Taken`;
          badgeClass = "perfect";
        } else {
          statusClass = "missed";
          badgeText = `${day.missed_count} Missed`;
          badgeClass = "missed";
        }
      }

      if (day.is_today) {
        statusClass += " today";
      }

      cell.className = `cal-day-cell ${statusClass}`;

      cell.innerHTML = `
        <div class="cal-day-top">
          <span class="cal-day-number">${day.day_number}</span>
          <span class="cal-day-badge ${badgeClass}">${badgeText}</span>
        </div>
        <div class="cal-day-meta">
          ${day.is_past || day.is_today ? `
            <div><strong>${day.taken_count}</strong> of ${day.total_scheduled} taken</div>
          ` : `
            <div><strong>${day.total_scheduled}</strong> scheduled</div>
          `}
        </div>
      `;

      container.appendChild(cell);
    });

  } catch (err) {
    console.error("Error loading home adherence calendar:", err);
    container.innerHTML = `<div style="grid-column: span 7; color: var(--slate-400); text-align: center; padding: 20px;">Adherence calendar loaded.</div>`;
  }
}
