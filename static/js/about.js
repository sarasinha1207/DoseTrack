/**
 * DoseTrack - About Page Script (about.js)
 * Controls FAQ interactions and session status on the about page.
 * Strictly no emojis.
 */

document.addEventListener("DOMContentLoaded", () => {
  initAboutFaqAccordion();
  checkExistingSession();
});

function initAboutFaqAccordion() {
  const faqButtons = document.querySelectorAll(".faq-accordion-btn");

  faqButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.parentElement;
      const isActive = item.classList.contains("active");

      // Close all items
      document.querySelectorAll(".faq-accordion-item").forEach((el) => {
        el.classList.remove("active");
      });

      // If it wasn't open, open it
      if (!isActive) {
        item.classList.add("active");
      }
    });
  });
}

function checkExistingSession() {
  const activeUser = sessionStorage.getItem("dosetrack_active_user");
  const navLoginBtn = document.getElementById("btn-nav-login");

  if (activeUser && navLoginBtn) {
    navLoginBtn.textContent = "Open Dashboard";
    navLoginBtn.href = "/dashboard";
  }
}
