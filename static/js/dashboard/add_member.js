/**
 * DoseTrack - Dashboard Add Member Controller (add_member.js)
 * Handles registration of additional family members into the household vault.
 * Strictly no emojis.
 */

const AddMemberModule = {
  init() {
    const formAddMember = document.getElementById("form-add-family-member");
    if (!formAddMember) return;

    formAddMember.addEventListener("submit", async (e) => {
      e.preventDefault();
      const first = document.getElementById("add-member-first").value.trim();
      const last = document.getElementById("add-member-last").value.trim();
      const role = document.getElementById("add-member-role").value;
      const gender = document.getElementById("add-member-gender").value;
      const age = parseInt(document.getElementById("add-member-age").value, 10);
      const username = document.getElementById("add-member-username").value.trim().toLowerCase();
      const password = document.getElementById("add-member-pwd").value.trim();
      const isAdmin = document.getElementById("add-member-admin").checked;

      if (!first || !last || !username || !password) {
        showToast("Please fill all required fields.");
        return;
      }

      const submitBtn = document.getElementById("btn-submit-add-member");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Registering...";
      }

      try {
        await API.register({
          first_name: first,
          last_name: last,
          gender: gender,
          age: age || 60,
          username: username,
          password: password,
          role: role,
          is_admin: isAdmin
        });

        formAddMember.reset();
        showToast(`Family member ${first} registered successfully!`);

        // Refresh family list
        const famRes = await API.getAllFamilyMedications();
        dashState.allProfiles = famRes.family || [];

        // If family tab is active, re-render
        if (dashState.activePage === "family" && window.FamilyModule) {
          window.FamilyModule.render();
        }
      } catch (err) {
        showToast("Error registering member: " + err.message);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Save & Register Family Member";
        }
      }
    });
  }
};

window.AddMemberModule = AddMemberModule;
