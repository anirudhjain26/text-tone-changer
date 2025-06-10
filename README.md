# Text Tone Changer Chrome Extension

The Text Tone Changer Chrome extension allows users to change the tone of selected text in webpages. With this extension, you can easily rephrase text to match different tones such as "Formal," "Casual," or "Friendly," making it useful for various communication scenarios.

## Objective

The primary objective of this project is to build a Chrome extension that enables users to rewrite selected text in different tones. By using OpenAI's GPT3.5 model, the extension performs tone analysis and text rewriting to provide rephrased versions of the selected text based on the user's chosen tone.

## Features

- Highlight text on any webpage and launch the extension to view the highlighted text in the input field.
- Select a tone from the available options: "Formal," "Casual," or "Friendly."
- The extension leverages OpenAI's GPT3.5 model to evaluate the tone and produce a rephrased version of the text in the chosen tone.
- Users can clear the text input to remove the highlighted text.
- Users can copy the rephrased text to the clipboard for easy use.

## Installation and Setup

1. Clone this repository to your local machine.
2. Install the required Python dependencies using `pip install -r backend/requirements.txt`.
3. Replace `"YOUR_BACKEND_URL"` in `frontend/js/background.js` with the actual URL of your Flask backend server.
4. Set up an account with OpenAI and obtain an API key to access the GPT3.5 model.
5. Use the API key in the `rephrase_text` function in `backend/app.py` to interact with the GPT3.5 model for tone analysis and text rewriting.

## How to Use

1. Load the extension in Google Chrome:

   - Open Google Chrome and go to `chrome://extensions/`.
   - Enable "Developer mode" in the top right corner.
   - Click on "Load unpacked" and select the project folder containing the `manifest.json` file.

2. Use the Text Tone Changer extension:
   - Visit any webpage and select the text you want to rephrase.
   - Click on the Text Tone Changer extension icon in the Chrome toolbar to open the popup.
   - The selected text will be displayed in the input field.
   - Choose the desired tone ("Formal," "Casual," or "Friendly") using the buttons in the popup.
   - The rephrased text will be displayed in the input field based on the chosen tone.
   - Click "Reset" to clear the text input and select new text for rephrasing.
   - Click "Save to Clipboard" to copy the rephrased text to your clipboard.

## Disclaimer

This project is for educational and experimental purposes. The accuracy and performance of the tone analysis and text rewriting heavily depend on the GPT3.5 model and its usage. OpenAI's API may have usage limitations and costs associated with it.

## Acknowledgments

- This project was inspired by the need for a convenient way to rephrase text with different tones in online communication.
- We thank OpenAI for providing access to the powerful GPT3.5 model, enabling the implementation of this extension.

## License

This project is licensed under the [MIT License](LICENSE).
