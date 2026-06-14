from groq import Groq
import os
import json
from dotenv import load_dotenv
from pathlib import Path

dotenv_path = Path(__file__).resolve().parent.parent / "Keys.env"
load_dotenv(dotenv_path=dotenv_path)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def analyze_logs(log_content: str) -> dict:
    prompt = f"""
    You are a cybersecurity expert. Analyze the following log file and return a JSON object only, with no extra text or markdown.

    The JSON must follow this exact structure:
    {{
        "summary": "A plain English summary of what happened in the logs",
        "stats": {{
            "total_logs_analyzed": <int>,
            "total_threats_detected": <int>,
            "high_severity_count": <int>,
            "medium_severity_count": <int>,
            "low_severity_count": <int>
        }},
        "threat_type_breakdown": {{
            "Brute Force": <float percentage>,
            "SQL Injection": <float percentage>,
            "Port Scanning": <float percentage>,
            "Anomalous Activity": <float percentage>
        }},
        "threats": [
            {{
                "suspicious_ip": "<ip address>",
                "threat_type": "<type>",
                "severity": "High" or "Medium" or "Low",
                "ai_risk_score": <float 0-100>,
                "description": "<what this threat is>",
                "recommendation": "<what to do about it>"
            }}
        ]
    }}

    Log file content:
    {log_content}
    """

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
    )

    text = response.choices[0].message.content.strip()

    # Remove markdown code blocks if present
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]

    return json.loads(text.strip())