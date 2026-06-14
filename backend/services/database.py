import psycopg2
import os
from dotenv import load_dotenv
from pathlib import Path

dotenv_path = Path(__file__).resolve().parent.parent / "Keys.env"
load_dotenv(dotenv_path=dotenv_path)

def get_connection():
    try:
        conn = psycopg2.connect(os.getenv("DATABASE_URL"))
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        raise e

def test_connection():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM users")
    result = cur.fetchone()
    cur.close()
    conn.close()
    return {"status": "connected", "users_count": result[0]}