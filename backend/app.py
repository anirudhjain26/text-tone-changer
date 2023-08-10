# app.py
from flask import Flask, request, jsonify

app = Flask(__name__)


# Sample function for tone analysis and text rewriting
def rephrase_text(selected_text, tone):
    # Implement your tone analysis and text rewriting logic here
    # For demonstration purposes, we'll just return the text with the selected tone added as a prefix
    print(f"Request for tone: {tone}")
    tones = {
        "formal": "Dear Sir/Madam,",
        "casual": "Hey there,",
        "friendly": "Hi,",
    }
    rephrased_text = f"{tones.get(tone, '')} {selected_text}"
    return rephrased_text


@app.route("/", methods=["POST"])
def change_tone():
    # adding comments
    print("REQUEST RECEIVED")
    data = request.get_json()
    if not data or "selectedText" not in data or "tone" not in data:
        return jsonify({"error": "Invalid request data"}), 400

    selected_text = data["selectedText"]
    tone = data["tone"]

    rephrased_text = rephrase_text(selected_text, tone)
    print(rephrased_text)

    return jsonify({"rephrasedText": rephrased_text})


if __name__ == "__main__":
    app.run(debug=True)
