/**
 * DoseGuard AI - Login & Registration Controller (login.js)
 * Completely PIN-free authentication with Username and Password.
 * Streamlined registration (6 fields only) with automatic post-registration onboarding handover.
 * Strictly no emojis.
 */

document.addEventListener("DOMContentLoaded", () => {
  setupAuthTabs();
  setupSignInForm();
  setupRegisterForm();
  setupDemoButtons();
});

function setupAuthTabs() {
  const btnSignInTab = document.getElementById("tab-btn-signin");
  const btnRegisterTab = document.getElementById("tab-btn-register");
  const secSignIn = document.getElementById("section-signin");
  const secRegister = document.getElementById("section-register");

  if (!btnSignInTab || !btnRegisterTab) return;

  btnSignInTab.addEventListener("click", () => {
    btnSignInTab.classList.remove("btn-secondary");
    btnSignInTab.classList.add("btn-primary");
    btnRegisterTab.classList.remove("btn-primary");
    btnRegisterTab.classList.add("btn-secondary");

    secSignIn.style.display = "block";
    secRegister.style.display = "none";
  });

  btnRegisterTab.addEventListener("click", () => {
    btnRegisterTab.classList.remove("btn-secondary");
    btnRegisterTab.classList.add("btn-primary");
    btnSignInTab.classList.remove("btn-primary");
    btnSignInTab.classList.add("btn-secondary");

    secRegister.style.display = "block";
    secSignIn.style.display = "none";
  });
}

function setupSignInForm() {
  const form = document.getElementById("form-signin");
  const alertBox = document.getElementById("signin-alert");
  const btnSubmit = document.getElementById("btn-submit-signin");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (alertBox) {
      alertBox.style.display = "none";
      alertBox.textContent = "";
    }

    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value.trim();

    if (!username || !password) {
      showSignInError("Please enter both username and password.");
      return;
    }

    btnSubmit.disabled = true;
    btnSubmit.textContent = "Authenticating...";

    try {
      const res = await API.login(username, password);
      sessionStorage.setItem("doseguard_active_user", res.profile.id);
      sessionStorage.setItem("doseguard_active_profile", JSON.stringify(res.profile));
      window.location.href = "/dashboard";
    } catch (err) {
      showSignInError(err.message || "Invalid username or password. Please verify your credentials.");
      btnSubmit.disabled = false;
      btnSubmit.textContent = "Sign In to Personal Dashboard";
    }
  });
}

function showSignInError(msg) {
  const alertBox = document.getElementById("signin-alert");
  if (alertBox) {
    alertBox.textContent = msg;
    alertBox.style.display = "block";
  }
}

function setupRegisterForm() {
  const form = document.getElementById("form-register");
  const alertBox = document.getElementById("register-alert");
  const btnSubmit = document.getElementById("btn-submit-register");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (alertBox) {
      alertBox.style.display = "none";
      alertBox.textContent = "";
    }

    const firstName = document.getElementById("reg-first-name").value.trim();
    const lastName = document.getElementById("reg-last-name").value.trim();
    const gender = document.getElementById("reg-gender").value;
    const age = parseInt(document.getElementById("reg-age").value.trim(), 10);
    const username = document.getElementById("reg-username").value.trim().toLowerCase();
    const password = document.getElementById("reg-password").value.trim();

    if (!firstName || !lastName || !username || !password || isNaN(age)) {
      showRegisterError("All fields marked with an asterisk are required.");
      return;
    }

    if (password.length < 4) {
      showRegisterError("Password must be at least 4 characters long.");
      return;
    }

    btnSubmit.disabled = true;
    btnSubmit.textContent = "Creating Member Profile...";

    try {
      const res = await API.register({
        first_name: firstName,
        last_name: lastName,
        gender: gender,
        age: age,
        username: username,
        password: password
      });

      // Save active session & flag to trigger onboarding popup on dashboard
      sessionStorage.setItem("doseguard_active_user", res.profile.id);
      sessionStorage.setItem("doseguard_active_profile", JSON.stringify(res.profile));
      sessionStorage.setItem("doseguard_trigger_onboarding", "true");

      window.location.href = "/dashboard";
    } catch (err) {
      showRegisterError(err.message || "Failed to register family member. Please choose another username.");
      btnSubmit.disabled = false;
      btnSubmit.textContent = "Complete Registration & Proceed to Clinical Setup";
    }
  });
}

function showRegisterError(msg) {
  const alertBox = document.getElementById("register-alert");
  if (alertBox) {
    alertBox.textContent = msg;
    alertBox.style.display = "block";
  }
}

function setupDemoButtons() {
  const demoButtons = document.querySelectorAll(".demo-account-btn");
  demoButtons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const u = btn.getAttribute("data-username");
      const p = btn.getAttribute("data-pwd");

      const inputU = document.getElementById("login-username");
      const inputP = document.getElementById("login-password");

      if (inputU) inputU.value = u;
      if (inputP) inputP.value = p;

      const form = document.getElementById("form-signin");
      if (form) {
        form.dispatchEvent(new Event("submit", { cancelable: true }));
      }
    });
  });
}
