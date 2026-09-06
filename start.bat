@echo off
title PROJECT NEXUS - AI Smart City Launcher
color 0b

echo ========================================================
echo     PROJECT NEXUS - AI SMART CITY PYTHON ENGINE
echo ========================================================
echo.
echo Launching 100%% Python Smart City Simulator...
echo.

python "%~dp0run.py"

if errorlevel 1 (
    echo.
    echo [!] Python execution encountered an issue.
    echo [!] Trying virtual environment if available...
    if exist "%~dp0PROJECT_ECLIPSE\backend\.venv\Scripts\python.exe" (
        "%~dp0PROJECT_ECLIPSE\backend\.venv\Scripts\python.exe" "%~dp0run.py"
    )
    pause
)
