const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", function () {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email === "" || password === "") {
        alert("Please enter email and password");
        return;
    }

    alert("Login successful!");
});
const signupBtn = document.getElementById("signupBtn");

signupBtn.addEventListener("click", function () {
    const fullName = document.getElementById("fullName").value;
    const signupEmail = document.getElementById("signupEmail").value;
    const signupPassword = document.getElementById("signupPassword").value;

    if (fullName === "" || signupEmail === "" || signupPassword === "") {
        alert("Please fill in all fields");
        return;
    }

    alert("Sign up successful!");
});