from fastapi import APIRouter, HTTPException
from services.database import get_connection
from pydantic import BaseModel
import bcrypt
import uuid

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    full_name: str
    email: str
    password: str

@router.post("/auth/login")
def login(req: LoginRequest):
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("SELECT id, full_name, password_hash FROM users WHERE email = %s", (req.email,))
        user = cur.fetchone()

        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        password_matches = bcrypt.checkpw(req.password.encode("utf-8"), user[2].encode("utf-8"))
        if not password_matches:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        return {"id": str(user[0]), "full_name": user[1], "email": req.email}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

@router.post("/auth/register")
def register(req: RegisterRequest):
    conn = get_connection()
    cur = conn.cursor()
    try:
        # Check if email already exists
        cur.execute("SELECT id FROM users WHERE email = %s", (req.email,))
        if cur.fetchone():
            raise HTTPException(status_code=400, detail="An account with this email already exists")

        # Hash the password
        salt = bcrypt.gensalt(10)
        hashed = bcrypt.hashpw(req.password.encode("utf-8"), salt).decode("utf-8")

        # Insert new user
        user_id = str(uuid.uuid4())
        cur.execute(
            "INSERT INTO users (id, full_name, email, password_hash) VALUES (%s, %s, %s, %s)",
            (user_id, req.full_name, req.email, hashed)
        )
        conn.commit()

        return {"id": user_id, "full_name": req.full_name, "email": req.email}

    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()