// background.js
// Function to send a message to the backend server (Flask)
function sendMessageToBackend(message, callback) {
  // Replace "YOUR_BACKEND_URL" with the actual URL of your Flask server
  fetch("http://127.0.0.1:5000/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  })
    .then((response) => response.json())
    .then((data) => {
      callback(data); // Changed from sendResponse(data);
    })
    .catch((error) => {
      console.error("Error sending message to backend:", error);
      callback(null); // Changed from callback(null);
    });
}

// Function to handle messages from the frontend (popup)
function handlePopupMessage(request, sender, sendResponse) {
  if (request && request.action === "changeTone") {
    // Send the selected text and tone to the backend for processing
    const { selectedText, tone } = request;
    sendMessageToBackend({ action: "changeTone", selectedText, tone }, (response) => {
      // Send the rephrased text back to the popup
      if (response && response.rephrasedText) {
        chrome.tabs.sendMessage(sender.tab.id, {
          action: "rephrasedText",
          rephrasedText: response.rephrasedText,
        });
      }
    });
  } else if (request && request.action === "getInitialTone") {
    // Fetch the initial tone from the backend and send it back to the popup
    sendMessageToBackend({ action: "getInitialTone" }, (response) => {
      if (response && response.initialTone) {
        sendResponse({ action: "initialTone", tone: response.initialTone });
      }
    });

    // Return true to indicate that we'll send a response asynchronously
    return true;
  }
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(handlePopupMessage);
