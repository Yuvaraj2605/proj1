const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
        window.location.href = "login.html";
    });
}


// Profile Settings

const editProfileBtn = document.getElementById("editProfileBtn");
const profileForm = document.getElementById("profileForm");
const saveProfileBtn = document.getElementById("saveProfileBtn");

if (editProfileBtn && profileForm) {
    editProfileBtn.addEventListener("click", function () {
        profileForm.style.display = "block";
    });
}

if (saveProfileBtn && profileForm) {
    saveProfileBtn.addEventListener("click", function () {

        const name = document.getElementById("profileName").value;
        const email = document.getElementById("profileEmail").value;

        if (name === "" || email === "") {
            alert("Please fill all fields");
            return;
        }

        alert("Profile updated successfully!");

        profileForm.style.display = "none";
    });
}