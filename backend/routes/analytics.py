from fastapi import APIRouter, HTTPException
from services.database import get_connection
import json

router = APIRouter()

@router.get("/analytics/result/{analysis_id}")
def get_analysis_result(analysis_id: str):
    conn = get_connection()
    cur = conn.cursor()

    try:
        cur.execute("""
            SELECT total_logs_analyzed, total_threats_detected,
                   high_severity_count, medium_severity_count,
                   low_severity_count, threat_type_breakdown
            FROM analysis_results
            WHERE id = %s
        """, (analysis_id,))
        row = cur.fetchone()

        if not row:
            raise HTTPException(status_code=404, detail="Analysis not found")

        breakdown = row[5] if isinstance(row[5], dict) else json.loads(row[5])

        cur.execute("""
            SELECT suspicious_ip, threat_type, severity, ai_risk_score, description
            FROM threat_records
            WHERE analysis_id = %s
            ORDER BY ai_risk_score DESC
        """, (analysis_id,))
        threats = cur.fetchall()

        return {
            "total_logs_analyzed": int(row[0]),
            "total_threats_detected": int(row[1]),
            "high_severity_count": int(row[2]),
            "medium_severity_count": int(row[3]),
            "low_severity_count": int(row[4]),
            "threat_type_breakdown": breakdown,
            "threats": [
                {
                    "suspicious_ip": t[0],
                    "threat_type": t[1],
                    "severity": t[2],
                    "ai_risk_score": float(t[3]),
                    "description": t[4]
                } for t in threats
            ]
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

@router.get("/analytics/dashboard")
def get_dashboard_stats(user_id: str = None):
    conn = get_connection()
    cur = conn.cursor()

    try:
        cur.execute("""
            SELECT 
                COALESCE(SUM(ar.total_logs_analyzed), 0),
                COALESCE(SUM(ar.total_threats_detected), 0),
                COALESCE(SUM(ar.high_severity_count), 0),
                COALESCE(SUM(ar.medium_severity_count), 0),
                COALESCE(SUM(ar.low_severity_count), 0)
            FROM analysis_results ar
            JOIN log_files lf ON ar.log_file_id = lf.id
            WHERE lf.user_id = %s
        """, (user_id,))
        stats = cur.fetchone()

        cur.execute("""
            SELECT ar.threat_type_breakdown
            FROM analysis_results ar
            JOIN log_files lf ON ar.log_file_id = lf.id
            WHERE lf.user_id = %s
        """, (user_id,))
        rows = cur.fetchall()

        combined = {}
        for row in rows:
            if row[0]:
                breakdown = row[0] if isinstance(row[0], dict) else json.loads(row[0])
                for key, val in breakdown.items():
                    combined[key] = combined.get(key, 0) + val

        return {
            "total_logs_analyzed": int(stats[0]),
            "total_threats_detected": int(stats[1]),
            "high_severity_count": int(stats[2]),
            "medium_severity_count": int(stats[3]),
            "low_severity_count": int(stats[4]),
            "threat_type_breakdown": combined
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()