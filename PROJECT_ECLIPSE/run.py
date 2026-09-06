"""
PROJECT NEXUS / ECLIPSE — AI Smart City Simulator
Unified Python Launcher
"""

import os
import sys
import subprocess
import time
import webbrowser

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")
if not os.path.exists(BACKEND_DIR):
    BACKEND_DIR = os.path.join(ROOT_DIR, "PROJECT_ECLIPSE", "backend")

# Add backend directory to sys.path so modules can be imported
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

def check_and_install_dependencies():
    required_packages = ["fastapi", "uvicorn", "pydantic", "websockets"]
    missing = []
    for pkg in required_packages:
        try:
            __import__(pkg)
        except ImportError:
            missing.append(pkg)
    
    if missing:
        print(f"[*] Installing required Python packages: {', '.join(missing)}...")
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", *missing])
            print("[✓] All Python dependencies installed successfully!")
        except Exception as e:
            print(f"[!] Warning: Failed to auto-install dependencies: {e}")
            print(f"[!] Please run: pip install -r {os.path.join(BACKEND_DIR, 'requirements.txt')}")

def print_banner():
    banner = r"""
========================================================================
   ____  ____   ___       _ _____ ____ _____   _   _ _______  ___   _ ____  
  |  _ \|  _ \ / _ \     | | ____/ ___|_   _| | \ | | ____\ \/ / | | / ___| 
  | |_) | |_) | | | | _  | |  _|| |     | |   |  \| |  _|  \  /| | | \___ \ 
  |  __/|  _ <| |_| || |_| | |__| |___  | |   | |\  | |___ /  \| |_| |___) |
  |_|   |_| \_\\___/  \___/|_____\____| |_|   |_| \_|_____/_/\_\\___/|____/ 
                                                                             
      >> AUTONOMOUS AI SMART CITY SIMULATION & DIGITAL WORLD <<
========================================================================
  * 100% Python Engine: FastAPI + WebSockets + Multi-Agent AI
  * 3D Procedural City: Three.js WebGL + Dynamic Day/Night & Weather
  * Live Citizen Telemetry & Autonomous Traffic
  * Web & API Dashboard: http://localhost:8000
========================================================================
"""
    print(banner)

def main():
    print_banner()
    check_and_install_dependencies()
    
    # Initialize database
    try:
        import database
        database.init_db()
        print("[✓] SQLite City State Database initialized.")
    except Exception as e:
        print(f"[!] Note on DB init: {e}")

    # Launch browser after a short delay
    def open_browser():
        time.sleep(1.8)
        print("\n[*] Launching 3D Smart City in browser -> http://localhost:8000 ...")
        try:
            webbrowser.open("http://localhost:8000")
        except Exception:
            pass

    import threading
    threading.Thread(target=open_browser, daemon=True).start()

    # Run Uvicorn server
    print("\n[+] Starting Python Simulation Engine on http://localhost:8000 ...")
    print("[+] Press CTRL+C to stop the simulator.\n")
    
    import uvicorn
    # Change working directory to backend so relative paths work
    os.chdir(BACKEND_DIR)
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False, log_level="info")

if __name__ == "__main__":
    main()
