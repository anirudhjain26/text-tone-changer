// script.js

// Function to send a message to the background script (background.js)
function sendMessageToBackground(message) {
    chrome.runtime.sendMessage(message);
  }
  
  // Function to update the selected text in the popup
  function updateSelectedText() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "getSelectedText" }, function (response) {
        if (response && response.selectedText) {
          // Update the text input with the selected text
          document.getElementById("text-input").value = response.selectedText;
        }
      });
    });
  }
  
  // Function to handle tone selection
  function selectTone(tone) {
    // Remove the 'active' class from all tone buttons
    const toneButtons = document.querySelectorAll(".tone-button");
    toneButtons.forEach((button) => button.classList.remove("active"));
  
    // Add the 'active' class to the selected tone button
    const selectedButton = document.getElementById(`tone-${tone}`);
    selectedButton.classList.add("active");
  
    // Get the selected text from the input field
    const selectedText = document.getElementById("text-input").value;
  
    // Send the selected text and tone to the background script for processing
    sendMessageToBackground({ action: "changeTone", selectedText, tone });
  }
  
  // Function to handle the response from the background script
  function handleResponse(response) {
    if (response && response.rephrasedText) {
      // Update the text input with the rephrased text
      document.getElementById("text-input").value = response.rephrasedText;
    }
  }
  
  // Event listener for the 'formal' tone button
  document.getElementById("tone-formal").addEventListener("click", function () {
    selectTone("formal");
  });
  
  // Event listener for the 'casual' tone button
  document.getElementById("tone-casual").addEventListener("click", function () {
    selectTone("casual");
  });

  // Event listener for the 'excited' tone button
  document.getElementById("tone-excited").addEventListener("click", function () {
    selectTone("excited");
  });
  
  // Event listener for the 'humorous' tone button
  document.getElementById("tone-humorous").addEventListener("click", function () {
    selectTone("humorous");
  });

  // Event listener for the 'persuasive' tone button
  document.getElementById("tone-persuasive").addEventListener("click", function () {
    selectTone("persuasive");
  });
  
  // Event listener for the 'assertive' tone button
  document.getElementById("tone-assertive").addEventListener("click", function () {
    selectTone("assertive");
  });

  // Event listener for the 'empathetic' tone button
  document.getElementById("tone-empathetic").addEventListener("click", function () {
    selectTone("empathetic");
  });
  
  // Event listener for the 'sarcastic' tone button
  document.getElementById("tone-sarcastic").addEventListener("click", function () {
    selectTone("sarcastic");
  });
  
  
  // Event listener for the 'Reset' button
  document.getElementById("reset-button").addEventListener("click", function () {
    // toneButtons.forEach((button) => button.classList.remove("active"));
    // Clear the text input and update the selected text from the active tab
    document.getElementById("text-input").value = "";
    updateSelectedText();
  });
  
  // Event listener for the 'Save' button
  document.getElementById("save-button").addEventListener("click", function () {
    // Get the rephrased text and save it to the clipboard
    const rephrasedText = document.getElementById("text-input").value;
    navigator.clipboard.writeText(rephrasedText).then(() => {
      alert("Rephrased text saved to clipboard!");
    });
  });

  // Event listener for the 'Save' button
/*   document.getElementById("save-button").addEventListener("click", function () {
    // Make an HTTP request to your Flask backend to get the rephrased text
    fetch("http://127.0.0.1:5000/") // Replace with your actual backend URL
      .then(response => response.json())
      .then(data => {
        const rephrasedText = data.rephrasedText;

        // Save the rephrased text to the clipboard
        navigator.clipboard.writeText(rephrasedText).then(() => {
          alert("Rephrased text saved to clipboard!");
        });
      })
      .catch(error => {
        console.error("Error:", error);
      });
  }); */

  
  // Event listener for when the popup is loaded
  document.addEventListener("DOMContentLoaded", function () {
    // Update the selected text in the popup
    updateSelectedText();
  
    // Send a message to the background script to retrieve the initial tone (if set)
    sendMessageToBackground({ action: "getInitialTone" });
  });
  
  // Listener for messages from the background script
  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message && message.action === "initialTone") {
      // Handle the initial tone sent from the background script (if set)
      if (message.tone) {
        // Add the 'active' class to the corresponding tone button
        const selectedButton = document.getElementById(`tone-${message.tone}`);
        selectedButton.classList.add("active");
      }
    } else if (message && message.action === "rephrasedText") {
      // Handle the rephrased text sent from the background script
      handleResponse(message);
    }
  });
  