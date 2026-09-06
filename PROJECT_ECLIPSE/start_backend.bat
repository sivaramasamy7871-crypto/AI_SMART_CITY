@echo off
title NEXUS Backend
cd /d "%~dp0backend"
call .venv\Scripts\activate.bat
uvicorn main:app --reload --port 8000
