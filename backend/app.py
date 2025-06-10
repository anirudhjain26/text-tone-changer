from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI

import os
from dotenv import load_dotenv

load_dotenv()


OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=OPENAI_API_KEY)

app = Flask(__name__)
CORS(app)


@app.route("/rephrase", methods=["POST"])
def rephrase():
    data = request.json
    text = data.get("text")
    tone = data.get("tone")

    tones = {
        "tone-formal": "Dear Sir/Madam,",
        "tone-casual": "Hey there,",
        "tone-friendly": "Hi,",
    }

    # Construct the message for the OpenAI API
    messages = [
        {
            "role": "system",
            "content": "You are a helpful assistant trying to rephrase this sentence into the desired tone.",
        },
        {"role": "user", "content": f"Rewrite '{text}' in tone: {tone}."},
    ]

    # Call the OpenAI API to get the rephrased text
    try:
        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",  # Assuming you're using GPT-3.5-turbo or GPT-4
            messages=messages,
        )
        rephrased_text = completion.choices[0].message.content
    except Exception as e:
        print(f"Error: {e}")
        rephrased_text = f"Error generating response from OpenAI. {e}"

    return jsonify({"rephrased_text": rephrased_text})


if __name__ == "__main__":
    app.run(debug=True)
