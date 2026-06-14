from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import logs, threats, analytics, auth

app = FastAPI(title="LogShield API", version="1.0.0")

# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_headers=["*", "X-User-Id"],
    expose_headers=["X-User-Id"],
    allow_methods=["*"],
)

# Register routes
app.include_router(logs.router, prefix="/api/v1")
app.include_router(threats.router, prefix="/api/v1")
app.include_router(analytics.router, prefix="/api/v1")
app.include_router(auth.router, prefix="/api/v1")

@app.get("/")
def root():
    return {"message": "LogShield API is running!"}

from services.database import test_connection

@app.get("/api/v1/health")
def health_check():
    return test_connection()