chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "copyToClipboard" && request.rephrasedText) {
        // Copy the rephrased text to the clipboard
        navigator.clipboard.writeText(request.rephrasedText).then(() => {
            console.log("Text copied to clipboard:", request.rephrasedText);
        }).catch(err => {
            console.error("Failed to copy text to clipboard:", err);
        });
    }
});