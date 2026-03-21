import os
from flask import Flask, request, jsonify
import joblib
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

model = joblib.load("../model/privacy_model.pkl")
vectorizer = joblib.load("../model/tfidf_vectorizer.pkl")

def get_risk_score(result):
    return {"High": 80, "Medium": 50, "Low": 20}[result]

def get_reasons(text):
    text = text.lower()
    reasons = []

    if "third party" in text or "share" in text:
        reasons.append("Shares data with third parties")

    if "cookies" in text or "tracking" in text:
        reasons.append("Uses cookies or tracking")

    if "advertising" in text:
        reasons.append("Used for advertising")

    if "store" in text or "retain" in text:
        reasons.append("Stores user data")

    return reasons if reasons else ["No major risks detected"]

def get_explanation(result, reasons):
    return f"This policy is {result} risk because: " + ", ".join(reasons)

@app.route("/")
def home():
    return "Zentriq API Running"

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()
    text = data.get("text", "")

    vec = vectorizer.transform([text])
    result = model.predict(vec)[0]

    reasons = get_reasons(text)
    score = get_risk_score(result)
    explanation = get_explanation(result, reasons)

    return jsonify({
        "result": result,
        "score": score,
        "reasons": reasons,
        "explanation": explanation
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)