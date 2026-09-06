@echo off
title PROJECT NEXUS - Smart City Launcher
color 0b

echo ========================================================
echo         PROJECT NEXUS - SMART CITY AUTO LAUNCHER
echo ========================================================
echo.

echo [1/3] Starting Backend Server (Port 8000)...
start "NEXUS Backend" "%~dp0start_backend.bat"

echo [2/3] Starting Frontend Server (Port 5173)...
start "NEXUS Frontend" "%~dp0start_frontend.bat"

echo [3/3] Waiting 4 seconds for servers to initialize...
timeout /t 4 /nobreak >nul

echo Opening browser at http://localhost:5173 ...
start http://localhost:5173

echo.
echo ========================================================
echo  All systems active!
echo  - Frontend: http://localhost:5173
echo  - Backend:  http://localhost:8000/docs
echo ========================================================
echo.
pause
