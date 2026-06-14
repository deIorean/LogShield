from fastapi import APIRouter, UploadFile, File, HTTPException
from services.log_parser import parse_log_content
from services.ai_service import analyze_logs
from services.database import get_connection
import uuid

router = APIRouter()

@router.post("/logs/upload")
async def upload_log(file: UploadFile = File(...), user_id: str = None):
    # Read file content
    content = await file.read()
    log_content = content.decode("utf-8")

    # Parse log lines
    lines = parse_log_content(log_content)
    if not lines:
        raise HTTPException(status_code=400, detail="Log file is empty or unreadable")

    # Send to Gemini AI for analysis
    try:
        analysis = analyze_logs(log_content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {str(e)}")

    # Save to database
    conn = get_connection()
    cur = conn.cursor()

    try:
        # For now use a default user id (we'll add auth later)
        log_file_id = str(uuid.uuid4())
        analysis_id = str(uuid.uuid4())

        # Save log file record
        cur.execute("""
            INSERT INTO log_files (id, user_id, original_filename, file_path, file_type, file_size_bytes, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (
            log_file_id, user_id, file.filename,
            f"/uploads/{user_id}/{file.filename}",
            file.filename.split(".")[-1],
            len(content), "completed"
        ))

        # Save analysis result
        stats = analysis["stats"]
        cur.execute("""
            INSERT INTO analysis_results (id, log_file_id, total_logs_analyzed, total_threats_detected,
                high_severity_count, medium_severity_count, low_severity_count, threat_type_breakdown)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            analysis_id, log_file_id,
            stats["total_logs_analyzed"], stats["total_threats_detected"],
            stats["high_severity_count"], stats["medium_severity_count"], stats["low_severity_count"],
            str(analysis["threat_type_breakdown"]).replace("'", '"')
        ))

        # Save individual threat records
        for threat in analysis.get("threats", []):
            cur.execute("""
                INSERT INTO threat_records (analysis_id, suspicious_ip, threat_type, severity, ai_risk_score, description)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (
                analysis_id, threat["suspicious_ip"], threat["threat_type"],
                threat["severity"], threat["ai_risk_score"], threat["description"]
            ))

        conn.commit()

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        cur.close()
        conn.close()

    return {
        "message": "Log file analyzed successfully",
        "log_file_id": log_file_id,
        "analysis_id": analysis_id,
        "analysis": analysis
    }