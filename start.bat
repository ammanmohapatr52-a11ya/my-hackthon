@echo off
setlocal enabledelayedexpansion
title Neurobridge Launcher

:: Ensure working directory is project root
cd /d "%~dp0"

:: If a command line parameter was passed (e.g. start.bat 1), jump directly
if "%1"=="1" goto START_ALL
if "%1"=="2" goto START_FRONTEND
if "%1"=="3" goto START_BACKEND
if "%1"=="4" goto START_EBOOK
if "%1"=="5" goto RUN_TESTS
if "%1"=="6" goto EXIT_SCRIPT

:MENU
cls
echo ===============================================================================
echo       NEUROBRIDGE -- ACCESSIBLE ACADEMIC PROBLEM SOLVER
echo       Team Neurobridge  *  NextTech 2.0  *  "Make It Accessible"
echo ===============================================================================
echo.
echo   [1] Start Full Platform (FastAPI Backend + Vite Frontend) [RECOMMENDED]
echo   [2] Start Frontend Only (React + Vite on http://localhost:5173)
echo   [3] Start Backend Only  (FastAPI on http://localhost:8000)
echo   [4] Start E-Book Agent  (Streamlit on http://localhost:8501)
echo   [5] Run Backend Verification Tests and GK Evaluator
echo   [6] Exit Launcher
echo.
echo ===============================================================================
echo   Auto-starting [1] in 5 seconds... Press 1-6 to choose immediately.
echo ===============================================================================

choice /c 123456 /t 5 /d 1 /n /m "Select option (1-6) [Default: 1]: " 2>nul
if errorlevel 6 goto EXIT_SCRIPT
if errorlevel 5 goto RUN_TESTS
if errorlevel 4 goto START_EBOOK
if errorlevel 3 goto START_BACKEND
if errorlevel 2 goto START_FRONTEND
if errorlevel 1 goto START_ALL
goto START_ALL

:START_ALL
cls
echo ===============================================================================
echo   Starting Neurobridge Platform (Full Stack)...
echo ===============================================================================
echo.

:: 1. Launch Backend in separate window
echo [1/2] Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "Neurobridge Backend (FastAPI)" cmd /k "title Neurobridge Backend (FastAPI :8000) && python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload"

:: 2. Launch Frontend in separate window
echo [2/2] Starting Vite React Frontend on http://localhost:5173 ...
start "Neurobridge Frontend (Vite)" cmd /k "cd frontend && title Neurobridge Frontend (Vite :5173) && npm run dev"

echo.
echo Waiting for servers to initialize...
ping 127.0.0.1 -n 4 >nul

:: 3. Open browser
echo Opening Neurobridge in your default web browser...
start http://localhost:5173

cls
echo ===============================================================================
echo   NEUROBRIDGE IS RUNNING!
echo ===============================================================================
echo.
echo   * Web Application:     http://localhost:5173
echo   * Backend REST Docs:   http://localhost:8000/api/v1/docs
echo   * Backend Health:      http://localhost:8000/api/v1/health
echo   * AI Status / Models:  http://localhost:8000/api/v1/ai/status
echo.
echo   Dedicated console windows have been launched for each service.
echo   You can monitor real-time server logs and HMR updates there.
echo.
echo   To stop a service: Close its respective console window or press Ctrl+C.
echo ===============================================================================
echo.
pause
goto MENU

:START_FRONTEND
cls
echo ===============================================================================
echo   Starting Frontend Only (Vite Dev Server)...
echo ===============================================================================
echo.
start "Neurobridge Frontend (Vite)" cmd /k "cd frontend && title Neurobridge Frontend (Vite :5173) && npm run dev"
ping 127.0.0.1 -n 3 >nul
start http://localhost:5173
echo Frontend launched on http://localhost:5173
pause
goto MENU

:START_BACKEND
cls
echo ===============================================================================
echo   Starting Backend Only (FastAPI + Uvicorn)...
echo ===============================================================================
echo.
start "Neurobridge Backend (FastAPI)" cmd /k "title Neurobridge Backend (FastAPI :8000) && python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload"
ping 127.0.0.1 -n 3 >nul
start http://127.0.0.1:8000/api/v1/docs
echo Backend launched on http://127.0.0.1:8000
echo OpenAPI Documentation: http://127.0.0.1:8000/api/v1/docs
pause
goto MENU

:START_EBOOK
cls
echo ===============================================================================
echo   Starting E-Book Intelligence & Multilingual Briefing Agent...
echo ===============================================================================
echo.
python -c "import streamlit" 2>nul
if errorlevel 1 (
    echo Streamlit is not installed in the current environment.
    echo Installing dependencies from ebook_agent\requirements.txt ...
    pip install -r ebook_agent\requirements.txt
)
start "Neurobridge E-Book Agent (Streamlit)" cmd /k "cd ebook_agent && title Neurobridge E-Book Agent (:8501) && streamlit run app.py"
ping 127.0.0.1 -n 4 >nul
start http://localhost:8501
pause
goto MENU

:RUN_TESTS
cls
echo ===============================================================================
echo   Running Backend Verification Tests & GK Benchmark...
echo ===============================================================================
echo.
python -m pytest backend/tests
echo.
echo Running Document 06 Section 10 GK Benchmark (Deterministic Test Provider)...
python backend/scripts/eval_gk.py fake
echo.
pause
goto MENU

:EXIT_SCRIPT
echo.
echo Exiting Neurobridge Launcher. Goodbye!
exit /b 0
