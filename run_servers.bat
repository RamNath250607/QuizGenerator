@echo off
echo ========================================================
echo       Starting QuizCraft AI Full-Stack Server
echo ========================================================

echo 1. Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "QuizCraft Backend (FastAPI)" cmd /k "cd /d %~dp0backend && python -m uvicorn main:app --reload --port 8000"

timeout /t 2 /nobreak >nul

echo 2. Starting React Vite Frontend on http://localhost:5173 ...
start "QuizCraft Frontend (Vite)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ========================================================
echo Both servers are launching in separate windows!
echo Open your browser at: http://localhost:5173
echo ========================================================
pause
