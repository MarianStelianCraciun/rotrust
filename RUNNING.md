# Running the RoTrust Application

This document provides a quick reference for running the RoTrust application.

## Prerequisites

- Python 3.11 (required)
- Poetry (Python dependency management)
- Node.js 14+ (for frontend)
- Docker and Docker Compose (for blockchain network)

## Running the Backend

### Option 1: Using Poetry directly

```bash
poetry run uvicorn backend.main:app --reload
```

### Option 2: Using Makefile

```bash
make run-backend
```

### Option 3: Using Batch File (Windows)

```bash
run_backend.bat
```

The backend will be available at http://localhost:8000.
API documentation is available at http://localhost:8000/docs.

## Running the Frontend

### Option 1: Using npm directly

```bash
cd frontend
npm start
```

### Option 2: Using Makefile

```bash
make run-frontend
```

### Option 3: Using Batch File (Windows)

```bash
run_frontend.bat
```

The frontend will be available at http://localhost:3000.

## Running Both Backend and Frontend

### Option 1: Using Makefile

Run these commands in separate terminals:
```bash
make run-backend
make run-frontend
```

### Option 2: Using Batch File (Windows)

```bash
run_all.bat
```

This will start both the backend and frontend in separate windows.

## Troubleshooting

If you encounter any issues:

1. Make sure Poetry is properly installed and in your PATH
2. Verify that all dependencies are installed with `poetry install`
3. Check that environment variables are properly set in `.env`
4. For Windows users, ensure you're using PowerShell or Command Prompt
5. If using WSL on Windows, adjust paths accordingly