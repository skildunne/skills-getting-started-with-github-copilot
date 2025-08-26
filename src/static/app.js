document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Fetch and display activities
  async function loadActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Clear loading message and activity options
      activitiesList.innerHTML = "";
      activitySelect.innerHTML = '<option value="">-- Select an activity --</option>';

      // Sort activities by name
      const sortedActivities = Object.entries(activities).sort((a, b) => a[0].localeCompare(b[0]));

      sortedActivities.forEach(([name, details]) => {
        // Create activity card
        const card = document.createElement("div");
        card.className = "activity-card";
        card.innerHTML = `
                <h4>${name}</h4>
                <p><strong>Description:</strong> ${details.description}</p>
                <p><strong>Schedule:</strong> ${details.schedule}</p>
                <p><strong>Available Spots:</strong> ${details.max_participants - details.participants.length} / ${details.max_participants}</p>
                <div class="participants-header">Current Participants:</div>
                <ul class="participants-list">
                    ${details.participants.map(email => `<li>${email}</li>`).join('')}
                </ul>
            `;
        activitiesList.appendChild(card);

        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });
    } catch (error) {
      console.error("Error loading activities:", error);
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      messageDiv.className = "message success";
      messageDiv.textContent = `Successfully signed up for ${activity}!`;
      messageDiv.classList.remove("hidden");

      // Reload activities to show updated participants
      loadActivities();
    } catch (error) {
      messageDiv.className = "message error";
      messageDiv.textContent = `Error signing up: ${error.message}`;
      messageDiv.classList.remove("hidden");
    }
  });

  // Load activities when page loads
  loadActivities();
});
});
