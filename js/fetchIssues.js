const issuesContainer = document.getElementById("issuesContainer");

const API_BASE_URL = "https://community-issues-backend.onrender.com";

async function loadIssues() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/issues`);
    const issues = await res.json();

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
        <p><strong>Reporter:</strong> ${issue.reporterName} | ${issue.contactInfo}</p>
        <span class="${statusClass}">${issue.status}</span>
      `;

      issuesContainer.appendChild(div);
    });
  } catch (err) {
    issuesContainer.innerHTML = `<p>⚠️Couldn't load issues⚠️<em>  Error: ${err.message}❗❗❗<em></p>`;
  }
}

// Load issues when page loads
window.addEventListener("DOMContentLoaded", loadIssues);
