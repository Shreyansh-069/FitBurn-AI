document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const errorMsg = document.getElementById("error-message");
  const successMsg = document.getElementById("success-message");

  // Check if we navigated here after a successful registration
  const params = new URLSearchParams(window.location.search);
  if (params.get("registered") === "true") {
    successMsg.textContent = "Registration successful! Please sign in.";
    successMsg.classList.remove("hidden");
  }

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorMsg.classList.add("hidden");
    successMsg.classList.add("hidden");

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
      errorMsg.textContent = "All fields are required";
      errorMsg.classList.remove("hidden");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Store JWT in localStorage
      localStorage.setItem("token", data.token);
      
      // Redirect to dashboard
      window.location.href = "dashboard.html";
    } catch (error) {
      errorMsg.textContent = error.message;
      errorMsg.classList.remove("hidden");
    }
  });
});
