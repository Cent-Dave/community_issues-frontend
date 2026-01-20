const adminPin = document.getElementById("adminPin");
const pinMessage = document.getElementById("pinMessage");
const pinSection = document.getElementById("pinSection");
const adminSection = document.getElementById("adminSection");
const adminIssuesContainer = document.getElementById("adminIssuesContainer");
const loadingSpinner = document.getElementById("loadingSpinner");
const statusFilter = document.getElementById("statusFilter");
const categoryFilter = document.getElementById("categoryFilter");
const btnSubmit = document.getElementById("btnSubmit");
const reporterSearch = document.getElementById("reporterSearch");
const logoutBtn = document.getElementById("logoutBtn");

const API_BASE_URL = "https://community-issues-backend.onrender.com";

//Logout from other page removes the token; if no token? direct this page back to login page
if (!localStorage.getItem("token")) {
  location.replace("login.html");
}

// Verify admin PIN
async function verifyPin() {
  btnSubmit.textContent = "Accessing Admin...";
  const inputPin = adminPin.value;
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/verify-pin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin: inputPin }),
    });
    const data = await response.json();

    if (data.success) {
      pinSection.style.display = "none";
      adminSection.style.display = "block";
      loadAdminIssues();
    } else {
      pinMessage.textContent = "Invalid PIN!!!";
      pinMessage.style.color = "#c50000";
    }
  } catch (err) {
    pinMessage.textContent = "Server error!!!";
    pinMessage.style.color = "#c50000";
  }
  btnSubmit.textContent = "Access Admin";
}

// Load all issues for admin
async function loadAdminIssues() {
  loadingSpinner.style.display = "flex";
  adminIssuesContainer.style.display = "none";

  try {
    const res = await fetch(`${API_BASE_URL}/api/issues`);
    const issues = await res.json();

    loadingSpinner.style.display = "none";
    adminIssuesContainer.style.display = "flex";

    adminIssuesContainer.innerHTML = "";

    if (issues.length === 0) {
      adminIssuesContainer.innerHTML = "<h6>---No issues reported yet---</h6>";
      return;
    }

    issues.forEach((issue) => {
      const div = document.createElement("div");
      div.classList.add("issue-card");

      // Select status in dropdown
      const statuses = ["Pending", "In Progress", "Resolved"];
      const options = statuses
        .map(
          (status) =>
            `<option value="${status}" ${
              issue.status === status ? "selected" : ""
            }>${status}</option>`,
        )
        .join("");

      div.dataset.status = issue.status.toLowerCase();
      div.dataset.category = issue.category.toLowerCase();
      div.dataset.reporter = issue.reporterName.toLowerCase();

      div.innerHTML = `
        <h3>${issue.title}</h3>
        <p><strong>Reporter:</strong> ${issue.reporterName} | ${
          issue.contactInfo
        }</p>
        <p><strong>Category:</strong> ${issue.category}</p>
        <p><strong>Location:</strong> ${issue.location}</p>
        <p><strong>Description:</strong> ${issue.description}</p>
        <p><strong>Reported on:</strong> ${Intl.DateTimeFormat(
          navigator.language,
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: "true",
          },
        )
          .formatToParts(new Date(issue.createdAt))
          .map((p) =>
            p.type === "dayPeriod" ? p.value.toUpperCase() : p.value,
          )
          .join("")}</p>
        <select onchange="updateStatus('${issue._id}', this.value)">
          ${options}
        </select>
        <button onclick="deleteIssue('${issue._id}')">Delete</button>
        <hr>
      `;

      adminIssuesContainer.appendChild(div);
      filterIssues();
    });
  } catch (err) {
    loadingSpinner.style.display = "none";
    adminIssuesContainer.style.display = "flex";
    adminIssuesContainer.innerHTML = `<p>⚠️Couldn't load issues.<em>⛔Error: ${err.message}❗❗❗</em>.</p>`;
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
    loadAdminIssues();
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
    loadAdminIssues();
  } catch (err) {
    alert("Error occurred in deleting this issue: " + err.message);
  }
}

function filterIssues() {
  const selectedStatus = statusFilter.value.toLowerCase();
  const selectedCategory = categoryFilter.value.toLowerCase();
  const searchValue = reporterSearch.value.toLowerCase();

  const issueCards = document.querySelectorAll(".issue-card");

  issueCards.forEach((card) => {
    const issueStatus = card.dataset.status;
    const issueCategory = card.dataset.category;
    const issueReporter = card.dataset.reporter;

    const allStatus = selectedStatus === "all";
    const specificStatus = selectedStatus === issueStatus;
    const allCategory = selectedCategory === "all";
    const specificCategory = selectedCategory === issueCategory;

    const statusMatch = allStatus || specificStatus;

    const categoryMatch = allCategory || specificCategory;

    const reporterMatch = issueReporter.toLowerCase().includes(searchValue);

    card.style.display =
      statusMatch && categoryMatch && reporterMatch ? "block" : "none";
  });
}

statusFilter.addEventListener("change", filterIssues);
categoryFilter.addEventListener("change", filterIssues);
reporterSearch.addEventListener("input", filterIssues);

//Logout
logoutBtn.addEventListener("click", () => {
  if (!confirm("Are you sure you want to logout?")) return;

  localStorage.clear();
  window.location.replace("login.html");
});
