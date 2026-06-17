function toggleMenu() {
    const navMenu = document.getElementById("navMenu");
    navMenu.classList.toggle("responsive");
}

function validateLogin() {
    const username = document.getElementById("name").value.trim();
    const password = document.getElementById("pass").value.trim();
    const roleInput = document.querySelector('input[name="role"]:checked');

    if (!roleInput) {
        Swal.fire("Missing Role", "Please select a role (User or Admin)", "warning");
        return;
    }

    const role = roleInput.value;

    if (!username || !password) {
        Swal.fire("Error", "Please fill in all fields", "warning");
        return;
    }

    const url = role === "Admin"
        ? "http://localhost:5035/api/Account/AdminLogin"
        : "http://localhost:5035/api/Account/UserLogin";

    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: username, password: password })
    })
        .then(async response => {
            const data = await response.json().catch(() => ({}));
            if (!response.ok) {
                throw new Error(data.message || "Unauthorized or invalid credentials.");
            }
            return data;
        })
        .then(data => {
            Swal.fire("Login Successful", `Welcome back, ${role}!`, "success");
            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("userName", data.userName);

            setTimeout(() => {
                if (role === "Admin") {
                    const params = new URLSearchParams({
                        token: data.token,
                        userName: data.userName
                    });
                    window.location.href = "../admin-site-master/admin-site-master/admin.html?" + params.toString();
                } else {
                    window.location.href = "products.html";
                }
            }, 1000);
        })
        .catch(error => {
            console.error("Login error:", error);
            Swal.fire("Login Failed", error.message, "error");
        });
}

window.addEventListener("DOMContentLoaded", () => {
    const userName = sessionStorage.getItem("userName");
    const displayDiv = document.getElementById("userNameDisplay");

    if (userName && displayDiv) {
        displayDiv.textContent = `Welcome, ${userName}`;
    }
});
