const issueForm = document.getElementById("issueForm");
const reporterName = document.getElementById("reporterName");
const contactInfo = document.getElementById("contactInfo");
const title = document.getElementById("title");
const description = document.getElementById("description");
const category = document.getElementById("category");
const issueLocation = document.getElementById("location");
const message = document.getElementById("message");

const API_BASE_URL = "https://community-issues-backend.onrender.com";

issueForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const issueData = {
    reporterName: reporterName.value,
    contactInfo: contactInfo.value,
    title: title.value,
    description: description.value,
    category: category.value,
    location: issueLocation.value,
  };

  try {
    const res = await fetch(`${API_BASE_URL}/api/issues`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(issueData),
    });

    const data = await res.json();

    if (res.ok) {
      message.textContent = "Issue submitted successfully!";
      message.style.color = "green";
      issueForm.reset();
    } else {
      message.textContent = data.error || "Something went wrong";
      message.style.color = "red";
    }
  } catch (err) {
    message.textContent = "Error! Issue was not submitted";
    message.style.color = "red";
  }
});
