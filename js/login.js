const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const loginBtn = document.getElementById("loginBtn");

const API_BASE_URL = "https://community-issues-backend.onrender.com";

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  loginBtn.textContent = "Logging In...";

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      loginMessage.style.color = "green";
      loginMessage.textContent = "Login successful! Redirecting...";

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      window.location.href = "home.html";
    } else {
      loginMessage.style.color = "red";
      loginMessage.textContent = data.error || "Login failed";
    }
  } catch (err) {
    loginMessage.style.color = "red";
    loginMessage.textContent = "Error connecting to server";
  }
  loginBtn.textContent = "Log In";
});
