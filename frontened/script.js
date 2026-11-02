
// Mobile navigation menu
const menuBtn = document.getElementById("menuBtn");
const navbar = document.getElementById("navbar");

if (menuBtn && navbar) {
    menuBtn.addEventListener("click", function () {
        navbar.classList.toggle("show");
    });
}

// Registration form
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const password = document.getElementById("password").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const message = document.getElementById("message");

        if (password.length < 6) {
            message.textContent =
                "Password must contain at least 6 characters.";
            return;
        }

        if (password !== confirmPassword) {
            message.textContent = "Passwords do not match!";
            return;
        }

        message.textContent =
            "Registration form validated successfully!";

        registerForm.reset();
    });
}

// Login form
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const message = document.getElementById("message");

        message.textContent =
            "Demo login submitted. Backend authentication is required.";
    });
}

// Dashboard check-in button
const checkinBtn = document.getElementById("checkinBtn");

if (checkinBtn) {
    checkinBtn.addEventListener("click", function () {
        document.getElementById("checkinMessage").textContent =
            "Your daily check-in is complete!";

        checkinBtn.textContent = "Checked In ✓";
        checkinBtn.disabled = true;
    });
}

