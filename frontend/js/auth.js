const API_BASE = window.location.origin;

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json"
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

async function checkSession() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return null;
    }

    const response = await fetch(`${API_BASE}/api/auth/me`, {
      method: "GET",
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      localStorage.removeItem("token");
      return null;
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error("Session check error:", error);
    return null;
  }
}

async function handleLogoutUser() {
  try {
    await fetch(`${API_BASE}/api/auth/logout`, {
      method: "POST",
      headers: getAuthHeaders()
    });
  } catch (error) {
    console.error("Logout request failed:", error);
  } finally {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  }
}

// Global protection check based on current page url
document.addEventListener("DOMContentLoaded", async () => {
  const path = window.location.pathname;
  const isDashboard = path.includes("dashboard");
  const isAuthPage = path.includes("login") || path.includes("register");

  if (isDashboard || isAuthPage) {
    const user = await checkSession();

    if (isDashboard && !user) {
      window.location.href = "login.html";
    }

    if (isAuthPage && user) {
      window.location.href = "dashboard.html";
    }
  }
});
