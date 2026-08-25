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
const notificationBtn = document.getElementById("notificationBtn");
const notificationSettings = document.getElementById("notificationSettings");
const saveNotificationBtn = document.getElementById("saveNotificationBtn");

if (notificationBtn && notificationSettings) {
    notificationBtn.addEventListener("click", function () {
        notificationSettings.style.display = "block";
    });
}

if (saveNotificationBtn) {
    saveNotificationBtn.addEventListener("click", function () {
        alert("Notification preferences saved!");
        notificationSettings.style.display = "none";
    });
}
const securityBtn = document.getElementById("securityBtn");
const securityForm = document.getElementById("securityForm");
const changePasswordBtn = document.getElementById("changePasswordBtn");

if (securityBtn && securityForm) {
    securityBtn.addEventListener("click", function () {
        securityForm.style.display = "block";
    });
}

if (changePasswordBtn) {
    changePasswordBtn.addEventListener("click", function () {

        const currentPassword = document.getElementById("currentPassword").value;
        const newPassword = document.getElementById("newPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (!currentPassword || !newPassword || !confirmPassword) {
            alert("Please fill all fields");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("New passwords do not match");
            return;
        }

        alert("Password changed successfully!");
        securityForm.style.display = "none";
    });
}