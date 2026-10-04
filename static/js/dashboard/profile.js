/**
 * DoseGuard AI - Dashboard Profile Controller (profile.js)
 * Manages biometric indicators, clinical notes, and profile editing.
 * Strictly no emojis.
 */

const ProfileModule = {
  init() {
    const modalEditBio = document.getElementById("modal-edit-profile");
    const btnCloseEditBio = document.getElementById("btn-close-edit-profile");
    const btnCancelEditBio = document.getElementById("btn-cancel-edit-profile");
    const btnTriggerEditBio = document.getElementById("btn-trigger-edit-bio");
    const formEditBio = document.getElementById("form-edit-profile");

    if (btnTriggerEditBio) {
      btnTriggerEditBio.addEventListener("click", () => this.openEditModal());
    }

    const closeEditBio = () => {
      if (modalEditBio) modalEditBio.classList.remove("active");
    };
    if (btnCloseEditBio) btnCloseEditBio.addEventListener("click", closeEditBio);
    if (btnCancelEditBio) btnCancelEditBio.addEventListener("click", closeEditBio);

    if (formEditBio) {
      formEditBio.addEventListener("submit", async (e) => {
        e.preventDefault();
        const age = parseInt(document.getElementById("edit-bio-age").value, 10);
        const blood = document.getElementById("edit-bio-blood").value.trim();
        const weight = document.getElementById("edit-bio-weight").value.trim();
        const height = document.getElementById("edit-bio-height").value.trim();
        const notes = document.getElementById("edit-bio-notes").value.trim();

        try {
          const res = await API.updateProfile({
            profile_id: dashState.currentUserId,
            age: age || (dashState.currentProfile ? dashState.currentProfile.age : 60),
            weight: weight || "-",
            height: height || "-",
            blood_group: blood || "-",
            notes: notes || ""
          });

          dashState.currentProfile = res.profile;
          closeEditBio();
          if (window.DashboardCore) {
            window.DashboardCore.updateHeaderAndSidebarUser();
          }
          this.updateDisplay();
          showToast("Biometric indicators updated!");
        } catch (err) {
          showToast("Error updating profile: " + err.message);
        }
      });
    }
  },

  updateDisplay() {
    const p = dashState.currentProfile;
    if (!p) return;

    const fullName = p.name || `${p.first_name || ""} ${p.last_name || ""}`.trim() || p.username;

    const bValName = document.getElementById("bio-val-name");
    const bValUser = document.getElementById("bio-val-username");
    const bValAgeGen = document.getElementById("bio-val-age-gender");
    const bValBlood = document.getElementById("bio-val-blood");
    const bValWeight = document.getElementById("bio-val-weight");
    const bValHeight = document.getElementById("bio-val-height");
    const bValDoctor = document.getElementById("bio-val-doctor");
    const bValNotes = document.getElementById("bio-val-notes");

    if (bValName) bValName.textContent = fullName;
    if (bValUser) bValUser.textContent = `@${p.username}`;
    if (bValAgeGen) bValAgeGen.textContent = `${p.age || "-"} yrs / ${p.gender || "-"}`;
    if (bValBlood) bValBlood.textContent = p.blood_group || "-";
    if (bValWeight) bValWeight.textContent = p.weight || "-";
    if (bValHeight) bValHeight.textContent = p.height || "-";
    if (bValDoctor) bValDoctor.textContent = p.doctor || "Family Physician";
    if (bValNotes) bValNotes.textContent = p.notes || "No clinical precautions recorded.";
  },

  openEditModal() {
    const modal = document.getElementById("modal-edit-profile");
    if (!modal || !dashState.currentProfile) return;

    const p = dashState.currentProfile;
    const inputAge = document.getElementById("edit-bio-age");
    const inputBlood = document.getElementById("edit-bio-blood");
    const inputWeight = document.getElementById("edit-bio-weight");
    const inputHeight = document.getElementById("edit-bio-height");
    const inputNotes = document.getElementById("edit-bio-notes");

    if (inputAge) inputAge.value = p.age || 60;
    if (inputBlood) inputBlood.value = p.blood_group !== "-" ? p.blood_group : "";
    if (inputWeight) inputWeight.value = p.weight !== "-" ? p.weight : "";
    if (inputHeight) inputHeight.value = p.height !== "-" ? p.height : "";
    if (inputNotes) inputNotes.value = p.notes || "";

    modal.classList.add("active");
  }
};

window.ProfileModule = ProfileModule;
