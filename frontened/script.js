
const API_URL = "http://127.0.0.1:5000/api";

// Navigation menu
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
    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const message = document.getElementById("message");

        if (password.length < 8) {
            message.textContent =
                "Password must contain at least 8 characters.";
            return;
        }

        if (password !== confirmPassword) {
            message.textContent = "Passwords do not match!";
            return;
        }

        message.textContent = "Registering...";

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok) {
                message.textContent = "Registration successful! You can now log in.";
                registerForm.reset();
            } else {
                message.textContent =
                    data.error || "Registration failed.";
            }

        } catch (error) {
            message.textContent =
                "Cannot connect to the backend. Please start the server.";
            console.error("Registration error:", error);
        }
    });
}

// Login form - we will connect this next

// Login form
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;
        const message = document.getElementById("message");

        message.textContent = "Logging in...";

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok) {
                message.textContent = "Login successful!";

                window.location.href = "dashboard.html";
            } else {
                message.textContent =
                    data.error || "Login failed.";
            }

        } catch (error) {
            message.textContent =
                "Cannot connect to backend. Please start the server.";
            console.error("Login error:", error);
        }
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
