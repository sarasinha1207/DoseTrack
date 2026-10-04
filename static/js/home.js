/**
 * DoseGuard AI - Public Homepage Script (home.js)
 * Controls collapsible FAQ interactions, smooth navigation, and session status.
 * Strictly no emojis.
 */

document.addEventListener("DOMContentLoaded", () => {
  initHomeFaqAccordion();
  checkExistingSession();
});

function initHomeFaqAccordion() {
  const faqButtons = document.querySelectorAll(".faq-accordion-btn");

  faqButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.parentElement;
      const isActive = item.classList.contains("active");

      // Close all items in the accordion
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
  const activeUser = sessionStorage.getItem("doseguard_active_user");
  const navLoginBtn = document.getElementById("btn-nav-login");

  if (activeUser && navLoginBtn) {
    navLoginBtn.textContent = "Open Dashboard";
    navLoginBtn.href = "/dashboard";
  }
}
