chrome.contextMenus.create({
    id: "rephraseText",
    title: "Rephrase Text",
    contexts: ["selection"]  // Only show when text is selected
});

chrome.contextMenus.onClicked.addListener((info, tab) => {

    console.log(tab.url);

    // Check if the tab URL is accessible
    if (tab.url.startsWith("chrome://") || tab.url.startsWith("https://chrome.google.com/webstore")) {
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'images/icons/icon48.png',
            title: 'Action Not Allowed',
            message: 'Rephrasing is not allowed on this page.'
        });
        return;
    }

    if (info.menuItemId === "rephraseText" && info.selectionText) {
        // Fetch the rephrased text from the server
        fetch("http://127.0.0.1:5000/rephrase", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: info.selectionText,
                tone: "formal"
            })
        })
        .then(response => response.json())
        .then(data => {
            // Send the rephrased text to the content script to copy it to the clipboard
            chrome.tabs.sendMessage(tab.id, {
                action: "copyToClipboard",
                rephrasedText: data.rephrased_text
            });

            // Optionally, notify the user
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'images/icons/icon48.png',
                title: 'Text Rephrased',
                message: 'The text has been rephrased and copied to your clipboard.'
            });
        })
        .catch(error => {
            console.error("Error:", error);
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'images/icons/icon48.png',
                title: 'Rephrase Failed',
                message: 'Failed to rephrase text. Please try again.'
            });
        });
    }
});