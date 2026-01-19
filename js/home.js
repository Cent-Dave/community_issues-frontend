const logoutBtn = document.getElementById("logoutBtn");
const welcomeBox = document.getElementById("welcomeMessage");
const welcomeText = document.getElementById("welcomeText");

//Logout from other page removes the token; if no token? direct this page back to login page
if (!localStorage.getItem("token")) {
  location.replace("login.html");
}

//Welcome message
function showWelcomeMessage() {
  const username = localStorage.getItem("username");
  if (!username) {
    return;
  }

  welcomeText.textContent = `Welcome, ${username}!`;
  requestAnimationFrame(() => {
    welcomeBox.classList.add("show");
  });

  // Hide message after 3 seconds
  setTimeout(() => {
    welcomeBox.classList.remove("show");
  }, 3000);
}

//Logout
logoutBtn.addEventListener("click", () => {
  if (!confirm("Are you sure you want to logout?")) return;

  localStorage.clear();
  window.location.replace("login.html");
});

document.addEventListener("DOMContentLoaded", () => {
  showWelcomeMessage();
});
