const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", function () {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email === "" || password === "") {
        alert("Please enter email and password");
        return;
    }

    alert("Login successful!");
    window.location.href = "dashboard.html";
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

    fetch("http://localhost:5000/api/signup", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        fullName: fullName,
        email: signupEmail,
        password: signupPassword
    })
})
.then(response => response.json())
.then(data => {
    alert(data.message);
})
.catch(error => {
    console.error(error);
    alert("Server se connect nahi ho pa raha");
});
});
const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", function () {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email === "" || password === "") {
        alert("Please enter email and password");
        return;
    }

    fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);

        if (data.message === "Login successful") {
            window.location.href = "dashboard.html";
        }
    })
    .catch(error => {
        console.error(error);
        alert("Server se connect nahi ho pa raha");
    });
});