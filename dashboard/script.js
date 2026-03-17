async function fetchResult() {
  try {
    const response = await fetch("/result");
    const data = await response.json();

    if (data.waiting) {
      updateUI({
        status: "waiting",
        error_log: "No test run yet...",
        ai_fix: "Waiting for first test execution...",
      });
    } else {
      updateUI(data);
      fetchHistory();
    }
  } catch (err) {
    console.error("Error fetching result:", err);
  }
}

async function fetchHistory() {
  try {
    const response = await fetch("/history");
    const history = await response.json();

    const historyEl = document.getElementById("history");
    if (history.length === 0) {
      historyEl.innerHTML = '<p class="empty-state">No history yet...</p>';
      return;
    }

    historyEl.innerHTML = history
      .map(
        (item) => `
        <div class="history-item ${item.status}">
          <div>
            <strong>${item.commit}</strong> • ${item.branch} by ${item.actor}
            <br>
            <small>${formatTime(item.timestamp)}</small>
          </div>
          <span class="history-badge ${item.status}">${item.status.toUpperCase()}</span>
        </div>
      `
      )
      .join("");
  } catch (err) {
    console.error("Error fetching history:", err);
  }
}

function updateUI(result) {
  // Update status card
  const statusCard = document.getElementById("status-card");
  statusCard.className = `status-card ${result.status}`;

  const statusText = {
    success: "✅ Tests Passed!",
    failure: "❌ Tests Failed — AI is fixing...",
    waiting: "⏳ Waiting for test results...",
  };

  statusCard.innerHTML = `
    <div class="status-indicator">
      <div class="spinner"></div>
    </div>
    <div class="status-content">
      <p class="status-text">${statusText[result.status] || result.status}</p>
    </div>
  `;

  if (result.status === "success") {
    statusCard.querySelector(".spinner").style.display = "none";
  } else if (result.status === "failure") {
    statusCard.querySelector(".spinner").style.display = "none";
  }

  // Update details
  document.getElementById("detail-status").textContent = result.status || "—";
  document.getElementById("detail-commit").textContent = result.commit || "—";
  document.getElementById("detail-branch").textContent = result.branch || "—";
  document.getElementById("detail-actor").textContent = result.actor || "—";
  document.getElementById("detail-repo").textContent = result.repo || "—";
  document.getElementById("detail-timestamp").textContent = formatTime(
    result.timestamp
  ) || "—";

  // Update logs
  document.getElementById("error-log").textContent =
    result.error_log || "No errors logged.";
  document.getElementById("ai-fix").textContent =
    result.ai_fix || "No fix provided.";
}

function formatTime(timestamp) {
  if (!timestamp) return "—";
  try {
    return new Date(timestamp).toLocaleString();
  } catch {
    return timestamp;
  }
}

// Initial load
fetchResult();
fetchHistory();

// Auto-refresh every 2 seconds
setInterval(() => {
  fetchResult();
}, 2000);
