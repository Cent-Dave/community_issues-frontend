const issuesContainer = document.getElementById("issuesContainer");
const loadingSpinner = document.getElementById("loadingSpinner");
const logoutBtn = document.getElementById("logoutBtn");

const API_BASE_URL = "https://community-issues-backend.onrender.com";

//Logout from other page removes the token; if no token? direct this page back to login page
if (!localStorage.getItem("token")) {
  location.replace("login.html");
}

async function loadIssues() {
  loadingSpinner.style.display = "flex";
  issuesContainer.style.display = "none";

  try {
    const res = await fetch(`${API_BASE_URL}/api/issues`);
    const issues = await res.json();

    loadingSpinner.style.display = "none";
    issuesContainer.style.display = "flex";

    issuesContainer.innerHTML = "";

    if (issues.length === 0) {
      issuesContainer.innerHTML = "<h6>---No issues reported yet---</h6>";
      return;
    }

    issues.forEach((issue) => {
      const div = document.createElement("div");

      // Determine status badge class
      let statusClass = "";
      switch (issue.status.toLowerCase()) {
        case "pending":
          statusClass = "status-pending";
          break;
        case "in progress":
          statusClass = "status-progress";
          break;
        case "resolved":
          statusClass = "status-resolved";
          break;
        default:
          statusClass = "status-pending";
      }

      div.innerHTML = `
        <h3>${issue.title}</h3>
        <p><strong>Description:</strong> ${issue.description}</p>
        <p><strong>Category:</strong> ${issue.category}</p>
        <p><strong>Location:</strong> ${issue.location}</p>
        <p><strong>Reporter:</strong> ${issue.reporterName}</p>
        <p><strong>Reported on:</strong> ${Intl.DateTimeFormat(
          navigator.language,
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: "true",
          }
        )
          .formatToParts(new Date(issue.createdAt))
          .map((p) =>
            p.type === "dayPeriod" ? p.value.toUpperCase() : p.value
          )
          .join("")}</p>
        <span class="${statusClass}">${issue.status}</span>
      `;

      issuesContainer.appendChild(div);
    });
  } catch (err) {
    loadingSpinner.style.display = "none";
    issuesContainer.style.display = "flex";
    issuesContainer.innerHTML = `<p>⚠️Couldn't load issues.<em>⛔Error: ${err.message}❗❗❗</em>.</p>`;
  }
}

// Load issues when page loads
window.addEventListener("DOMContentLoaded", loadIssues);

//Logout
logoutBtn.addEventListener("click", () => {
  if (!confirm("Are you sure you want to logout?")) return;

  localStorage.clear();
  window.location.replace("login.html");
});
