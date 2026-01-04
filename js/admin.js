const ADMIN_PIN = "1"; // Change to your desired PIN
const adminPin = document.getElementById("adminPin");
const pinMessage = document.getElementById("pinMessage");
const pinSection = document.getElementById("pinSection");
const adminSection = document.getElementById("adminSection");
const adminIssuesContainer = document.getElementById("adminIssuesContainer");

const API_BASE_URL = "https://community-issues-backend.onrender.com";

// Verify admin PIN
function verifyPin() {
  if (adminPin.value === ADMIN_PIN) {
    pinSection.style.display = "none";
    adminSection.style.display = "block";
    loadAdminIssues();
  } else {
    pinMessage.textContent = "Incorrect PIN";
    pinMessage.style.color = "red";
  }
}

// Load all issues for admin
async function loadAdminIssues() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/issues`);
    const issues = await res.json();

    adminIssuesContainer.innerHTML = "";

    if (issues.length === 0) {
      adminIssuesContainer.innerHTML = "<h6>---No issues reported yet---</h6>";
      return;
    }

    issues.forEach((issue) => {
      const div = document.createElement("div");

      // Pre-select status in dropdown
      const statuses = ["Pending", "In Progress", "Resolved"];
      const options = statuses
        .map(
          (status) =>
            `<option value="${status}" ${
              issue.status === status ? "selected" : ""
            }>${status}</option>`
        )
        .join("");

      div.innerHTML = `
        <h3>${issue.title}</h3>
        <p><strong>Reporter:</strong> ${issue.reporterName} | ${issue.contactInfo}</p>
        <p><strong>Category:</strong> ${issue.category}</p>
        <p><strong>Location:</strong> ${issue.location}</p>
        <p><strong>Description:</strong> ${issue.description}</p>
        <select onchange="updateStatus('${issue._id}', this.value)">
          ${options}
        </select>
        <button onclick="deleteIssue('${issue._id}')">Delete</button>
        <hr>
      `;

      adminIssuesContainer.appendChild(div);
    });
  } catch (err) {
    adminIssuesContainer.innerHTML = `<p>⚠️Couldn't load issues⚠️<em>  Error: ${err.message}❗❗❗<em></p>`;
  }
}

// Update issue status
async function updateStatus(id, status) {
  try {
    await fetch(`${API_BASE_URL}/api/issues/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    loadAdminIssues(); // Refresh list
  } catch (err) {
    alert("Error occurred in updating status: " + err.message);
  }
}

// Delete an issue
async function deleteIssue(id) {
  if (!confirm("Are you sure you want to delete this issue?")) return;

  try {
    await fetch(`${API_BASE_URL}/api/issues/${id}`, {
      method: "DELETE",
    });
    loadAdminIssues(); // Refresh list
  } catch (err) {
    alert("Error occurred in deleting this issue: " + err.message);
  }
}
