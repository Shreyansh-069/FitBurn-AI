document.addEventListener("DOMContentLoaded", async () => {
  const userNameElem = document.getElementById("user-name");
  const logoutBtn = document.getElementById("logout-btn");
  const predictionForm = document.getElementById("prediction-form");
  const predictError = document.getElementById("predict-error");
  const resultValue = document.getElementById("result-value");
  const resultTime = document.getElementById("result-time");
  const historyBody = document.getElementById("history-body");

  // Fetch and display active user name
  const user = await checkSession();
  if (user) {
    userNameElem.textContent = user.name;
  }

  // Logout handler
  logoutBtn.addEventListener("click", handleLogoutUser);

  // Fetch and render prediction history list
  async function loadHistory() {
    try {
      const response = await fetch(`${API_BASE}/api/history`, {
        method: "GET",
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error("Failed to load history");
      }

      const history = await response.json();
      renderHistory(history);
    } catch (error) {
      console.error(error.message);
      historyBody.innerHTML = `
        <tr>
          <td colspan="4" class="text-center text-error py-4">Error loading history records.</td>
        </tr>
      `;
    }
  }

  // Helper to format date string
  function formatDate(dateString) {
    const options = {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  // Render history records in table
  function renderHistory(records) {
    if (!records || records.length === 0) {
      historyBody.innerHTML = `
        <tr>
          <td colspan="4" class="text-center text-muted py-4">No prediction records found. Submit the form to create one!</td>
        </tr>
      `;
      return;
    }

    historyBody.innerHTML = records
      .map((item) => {
        const genderText = item.gender === 0 ? "Male" : "Female";
        const workoutDetails = `
          <div class="table-workout-details">
            <span>Gender: <strong>${genderText}</strong>, Age: <strong>${item.age}</strong></span><br>
            <span>Height: <strong>${item.height} cm</strong>, Weight: <strong>${item.weight} kg</strong></span><br>
            <span>Duration: <strong>${item.duration} min</strong>, HR: <strong>${item.heartRate} bpm</strong>, Temp: <strong>${item.bodyTemp} &deg;C</strong></span>
          </div>
        `;

        return `
          <tr id="row-${item._id}">
            <td>${formatDate(item.createdAt)}</td>
            <td>${workoutDetails}</td>
            <td class="history-calories">${item.predictedCalories.toFixed(2)} kcal</td>
            <td>
              <button class="btn btn-secondary btn-danger btn-small delete-btn" data-id="${item._id}">Delete</button>
            </td>
          </tr>
        `;
      })
      .join("");

    // Bind delete event listeners
    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", async (e) => {
        const predictionId = e.target.getAttribute("data-id");
        if (confirm("Are you sure you want to delete this prediction?")) {
          await deleteHistoryItem(predictionId);
        }
      });
    });
  }

  // Delete prediction item
  async function deleteHistoryItem(id) {
    try {
      const response = await fetch(`${API_BASE}/api/history/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete prediction record");
      }

      // Remove row visually or reload
      const row = document.getElementById(`row-${id}`);
      if (row) {
        row.remove();
        // Check if table is now empty
        if (historyBody.children.length === 0) {
          historyBody.innerHTML = `
            <tr>
              <td colspan="4" class="text-center text-muted py-4">No prediction records found. Submit the form to create one!</td>
            </tr>
          `;
        }
      }
    } catch (error) {
      alert(error.message);
    }
  }

  // Handle new prediction form submission
  predictionForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    predictError.classList.add("hidden");

    const gender = document.getElementById("gender").value;
    const age = parseFloat(document.getElementById("age").value);
    const height = parseFloat(document.getElementById("height").value);
    const weight = parseFloat(document.getElementById("weight").value);
    const duration = parseFloat(document.getElementById("duration").value);
    const heartRate = parseFloat(document.getElementById("heart_rate").value);
    const bodyTemp = parseFloat(document.getElementById("body_temp").value);

    if (
      gender === "" ||
      isNaN(age) ||
      isNaN(height) ||
      isNaN(weight) ||
      isNaN(duration) ||
      isNaN(heartRate) ||
      isNaN(bodyTemp)
    ) {
      predictError.textContent = "Please fill in all inputs with valid values.";
      predictError.classList.remove("hidden");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/predict`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          gender: parseInt(gender),
          age,
          height,
          weight,
          duration,
          heart_rate: heartRate,
          body_temp: bodyTemp
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Prediction request failed");
      }

      // Update Result display card
      resultValue.textContent = data.predictedCalories.toFixed(2);
      resultTime.textContent = `Predicted on: ${formatDate(new Date())}`;

      // Refresh list history
      await loadHistory();
      
      // Optional: reset parts of the form
      document.getElementById("duration").value = "";
      document.getElementById("heart_rate").value = "";
      document.getElementById("body_temp").value = "";
    } catch (error) {
      predictError.textContent = error.message;
      predictError.classList.remove("hidden");
    }
  });

  // Initial load
  await loadHistory();
});
