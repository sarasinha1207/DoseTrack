/**
 * DoseGuard AI - Dashboard Help & FAQ Controller (help.js)
 * Manages interactive FAQ accordion in the dashboard.
 * Strictly no emojis.
 */

const HelpModule = {
  init() {
    const faqButtons = document.querySelectorAll("#page-help .faq-accordion-btn");
    faqButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = btn.parentElement;
        const isActive = item.classList.contains("active");

        document.querySelectorAll("#page-help .faq-accordion-item").forEach((el) => {
          el.classList.remove("active");
        });

        if (!isActive) {
          item.classList.add("active");
        }
      });
    });
  }
};

window.HelpModule = HelpModule;
