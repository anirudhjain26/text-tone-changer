document.addEventListener("DOMContentLoaded", function () {
  const rephraseButton = document.getElementById("rephrase-button");
  const resultElement = document.getElementById("result");
  const historyList = document.getElementById("history-list");
  const clearHistoryButton = document.getElementById("clear-history-button");
  const textInputElement = document.getElementById("text-input");

  // Helper: Load history from chrome.storage.local
  function loadHistory() {
    chrome.storage.local.get(["rephraseHistory"], function (result) {
      const history = result.rephraseHistory || [];
      renderHistory(history);
    });
  }

  // Helper: Save a new item to history
  function saveToHistory(original, rephrased, tone) {
    chrome.storage.local.get(["rephraseHistory"], function (result) {
      let history = result.rephraseHistory || [];
      const timestamp = Date.now();
      history.unshift({ original, rephrased, tone, timestamp });
      history = history.slice(0, 10); // Keep only last 10
      chrome.storage.local.set({ rephraseHistory: history }, loadHistory);
    });
  }

  // Helper: Render history items
  function renderHistory(history) {
    historyList.innerHTML = "";
    if (history.length === 0) {
      historyList.innerHTML = '<div class="history-empty">No history yet.</div>';
      return;
    }
    history.forEach((item, idx) => {
      const div = document.createElement("div");
      div.className = "history-item";
      div.innerHTML = `
        <div class="history-meta">
          <span class="history-tone">${item.tone.replace('tone-', '')}</span>
          <span class="history-time">${new Date(item.timestamp).toLocaleString()}</span>
        </div>
        <div class="history-original"><strong>Original:</strong> ${truncate(item.original, 40)}</div>
        <div class="history-rephrased"><strong>Rephrased:</strong> ${truncate(item.rephrased, 40)}</div>
        <div class="history-actions">
          <button class="copy-history" data-idx="${idx}">Copy</button>
          <button class="restore-history" data-idx="${idx}">Restore</button>
        </div>
      `;
      historyList.appendChild(div);
    });
    // Add event listeners for copy/restore
    document.querySelectorAll(".copy-history").forEach(btn => {
      btn.addEventListener("click", function () {
        const idx = this.getAttribute("data-idx");
        const item = history[idx];
        navigator.clipboard.writeText(item.rephrased);
      });
    });
    document.querySelectorAll(".restore-history").forEach(btn => {
      btn.addEventListener("click", function () {
        const idx = this.getAttribute("data-idx");
        const item = history[idx];
        textInputElement.value = item.original;
      });
    });
  }

  // Helper: Truncate text for display
  function truncate(str, n) {
    return str.length > n ? str.slice(0, n) + "..." : str;
  }

  // Clear history
  clearHistoryButton.addEventListener("click", function () {
    chrome.storage.local.set({ rephraseHistory: [] }, loadHistory);
  });

  // On successful rephrase, save to history
  function handleRephraseSuccess(original, rephrased, tone) {
    resultElement.textContent = rephrased;
    saveToHistory(original, rephrased, tone);
    navigator.clipboard.writeText(rephrased).then(() => {
      alert("Rephrased text saved to clipboard!");
    });
  }

  // Update rephraseButton click handler
  rephraseButton.addEventListener("click", function () {
    const textInput = textInputElement.value;
    const selectedTone = document.querySelector(".tone-button.active")?.id || "formal";

    if (textInput) {
      fetch("http://127.0.0.1:5000/rephrase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: textInput,
          tone: selectedTone
        })
      })
        .then(response => response.json())
        .then(data => {
          handleRephraseSuccess(textInput, data.rephrased_text, selectedTone);
        })
        .catch(error => {
          console.error("Error:", error);
          resultElement.textContent = "Failed to rephrase text.";
        });
    } else {
      resultElement.textContent = "Please enter text to rephrase.";
    }
  });

  // Event listeners for tone buttons
  document.querySelectorAll(".tone-button").forEach(button => {
    button.addEventListener("click", function () {
      document.querySelectorAll(".tone-button").forEach(btn => btn.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // Listen for messages sent to the popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "openPopupWithText") {
      document.getElementById("text-input").value = request.text;
    }
  });

  // Load history on popup open
  loadHistory();
});