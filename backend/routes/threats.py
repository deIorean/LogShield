from fastapi import APIRouter, HTTPException
from services.database import get_connection

router = APIRouter()

@router.get("/threats")
def get_threats(user_id: str = None):
    conn = get_connection()
    cur = conn.cursor()

    try:
        cur.execute("""
            SELECT t.id, t.suspicious_ip, t.threat_type, t.severity, 
                   t.ai_risk_score, t.description, t.detected_at
            FROM threat_records t
            JOIN analysis_results ar ON t.analysis_id = ar.id
            JOIN log_files lf ON ar.log_file_id = lf.id
            WHERE lf.user_id = %s
            ORDER BY t.detected_at DESC
            LIMIT 50
        """, (user_id,))
        rows = cur.fetchall()

        threats = []
        for row in rows:
            threats.append({
                "id": str(row[0]),
                "suspicious_ip": row[1],
                "threat_type": row[2],
                "severity": row[3],
                "ai_risk_score": float(row[4]),
                "description": row[5],
                "detected_at": str(row[6])
            })

        return {"threats": threats}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()