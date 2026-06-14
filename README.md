# LogShield 🛡️
> AI-powered web log analysis platform for threat detection and security monitoring

LogShield ingests web server logs, runs them through a large language model, and surfaces structured threat intelligence — all through a dark-themed web dashboard. Built as a full-stack cybersecurity tool that bridges the gap between raw log data and actionable security insights.

---

## What It Does

Most security tools either dump raw logs at you or charge enterprise prices for analysis. LogShield sits in the middle — upload a log file, get back a structured breakdown of threats, suspicious IPs, and attack patterns, powered by AI.

- 📁 Upload web server log files through the dashboard
- 🤖 AI analysis via **LLaMA 3.3 70B** (Groq) classifies threats and extracts IOCs
- 🗄️ Results stored in PostgreSQL with full metadata tracking
- 📊 Visual dashboard with threat distribution, recent logs, and active alerts
- 🔐 User authentication with secure password hashing and session management

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (TypeScript), Tailwind CSS |
| Backend | FastAPI (Python) |
| Database | PostgreSQL (Neon) |
| AI Model | LLaMA 3.3 70B via Groq API |
| Auth | bcrypt password hashing, JWT |

---

## Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   Next.js       │  REST   │   FastAPI        │  SQL    │   PostgreSQL    │
│   Frontend      │ ──────► │   Backend        │ ──────► │   Database      │
│   (TypeScript)  │         │   (Python)       │         │                 │
└─────────────────┘         └────────┬────────┘         └─────────────────┘
                                     │
                                     │ Groq API
                                     ▼
                            ┌─────────────────┐
                            │  LLaMA 3.3 70B  │
                            │  Threat Analysis│
                            └─────────────────┘
```

**Database Schema (4 tables):**
- `users` — authentication and user management
- `log_files` — uploaded file metadata and status
- `analysis_results` — AI-generated analysis per file
- `threat_records` — individual threats with `jsonb` structured data

---

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- PostgreSQL
- Groq API key (free at [console.groq.com](https://console.groq.com))

### Frontend Setup

```bash
cd LogShield
npm install
```

Create a `.env.local` file in the root:

```env
DATABASE_URL=your_neon_postgresql_connection_string
```

```bash
npm run dev
```

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate       # Windows
source venv/bin/activate    # Mac/Linux

pip install -r requirements.txt
```

Create a `Keys.env` file in the backend folder:

```env
GROQ_API_KEY=your_groq_api_key
DATABASE_URL=your_postgresql_connection_string
SECRET_KEY=your_jwt_secret
```

```bash
uvicorn main:app --reload
```

---

## Project Structure

```
LogShield/
├── app/                    # Next.js pages
│   ├── dashboard/
│   ├── upload/
│   ├── logs/
│   ├── threats/
│   └── analytics/
├── components/
│   ├── dashboard/          # Charts, stat cards, alerts
│   ├── layout/             # Sidebar, header
│   └── ui/                 # Reusable UI components
├── backend/
│   ├── main.py             # FastAPI entry point
│   ├── routes/             # API route handlers
│   │   ├── auth.py
│   │   ├── logs.py
│   │   ├── threats.py
│   │   └── analytics.py
│   ├── services/
│   │   ├── ai_service.py   # Groq/LLaMA integration
│   │   ├── database.py     # Neon PostgreSQL connection
│   │   └── log_parser.py   # Log file parsing logic
│   └── requirements.txt
└── README.md
```

---

## Security Considerations

- Passwords hashed with **bcrypt** before storage
- Parameterized queries throughout to prevent SQL injection
- CORS configured on the FastAPI backend
- Environment variables used for all secrets — nothing hardcoded
- `.env` files excluded from version control

---

## Status

> ⚠️ Active development — core log analysis pipeline is functional. Frontend dashboard and backend API are connected. Some UI pages are still being built out.

---

## Author

**Keshav** · [github.com/deIorean](https://github.com/deIorean)
