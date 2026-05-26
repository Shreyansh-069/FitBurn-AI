document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register-form");
  const errorMsg = document.getElementById("error-message");

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorMsg.classList.add("hidden");

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!name || !email || !password) {
      errorMsg.textContent = "All fields are required";
      errorMsg.classList.remove("hidden");
      return;
    }

    if (password.length < 8) {
      errorMsg.textContent = "Password must be at least 8 characters long";
      errorMsg.classList.remove("hidden");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Redirect to login page upon successful signup
      window.location.href = "login.html?registered=true";
    } catch (error) {
      errorMsg.textContent = error.message;
      errorMsg.classList.remove("hidden");
    }
  });
});
