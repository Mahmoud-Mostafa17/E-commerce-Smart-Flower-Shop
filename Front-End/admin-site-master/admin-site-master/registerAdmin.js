document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const form = e.target;
    const data = {
        fullName: form.fullName.value,
        address: form.address.value,
        phone: form.phone.value,
        email: form.email.value,
        password: form.password.value,
        confirmPassword: form.confirmPassword.value
    };

    if (data.password !== data.confirmPassword) {
        document.getElementById('message').textContent = "Passwords do not match.";
        document.getElementById('message').style.color = 'red';
        return;
    }

    try {
        const response = await fetch('http://localhost:5035/api/Account/AdminRegister', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const responseText = await response.text();
        const responseData = responseText ? JSON.parse(responseText) : null;

        if (response.ok) {
            document.getElementById('message').textContent = responseData?.message || "Registration successful. Redirecting to login...";
            document.getElementById('message').style.color = 'green';
            form.reset();
            setTimeout(() => {
                window.location.href = "../../products/signin.html";
            }, 1200);
        } else {
            let errorMessage = "Registration failed.";
            if (Array.isArray(responseData)) {
                errorMessage = responseData.map(e => e.description || e.code || String(e)).join(", ");
            } else if (responseData && typeof responseData === "object") {
                errorMessage = responseData.message || Object.values(responseData).flat().join(", ");
            } else if (responseText) {
                errorMessage = responseText;
            }
            document.getElementById('message').textContent = errorMessage;
            document.getElementById('message').style.color = 'red';
        }

    } catch (error) {
        document.getElementById('message').textContent = "Error: " + error.message;
        document.getElementById('message').style.color = 'red';
    }
});
