# PROJECT NEXUS 🌍 — AI Smart City Simulator
**Autonomous AI Virtual City Simulator & Digital World — 100% Python-Powered**

PROJECT NEXUS is a state-of-the-art AI-driven smart city simulation platform featuring interactive 3D procedural environments, multi-agent AI citizens, smart traffic networks, dynamic day/night & weather engines, city management, disaster dispatch, and real-time backend synchronization — running completely via Python.

---

## ⚡ Instant 1-Click Launch

### Option A: Via Python Command
```bash
python run.py
```

### Option B: Via Windows Batch File
Double-click `start.bat` in the project root directory.

That's it! Python will:
1. Verify and auto-install any missing dependencies (`fastapi`, `uvicorn`, `pydantic`, `websockets`)
2. Initialize the SQLite city state database
3. Launch the FastAPI server with real-time WebSockets on port **8000**
4. Automatically open your browser to **http://localhost:8000**

---

## ✨ Core Features

### 🌆 3D World & Dynamic Environment
- **Procedural City Generation**: High-density skyscrapers, commercial plazas, industrial plants, hospitals, police stations, solar arrays, and green bio-parks.
- **Day / Night Cycle & Dynamic Lighting**: Orbiting sun/moon with shadows, night window glow, streetlights, and vehicle headlights.
- **Weather Engine**: Real-time Clear, Rain (particle engine), Thunderstorm (lightning flashes), and Atmospheric Fog.
- **Interactive Infrastructure**: Animated traffic lights switching signals, streetlamps, and aerial delivery drones.

### 👥 Multi-Agent AI Citizens & Smart Traffic
- **Autonomous Citizens**: 3D animated walking agents with unique occupations, live thoughts, moods, salaries, and daily routines.
- **Traffic Network**: Sedans, Cyber-Taxis, Transit Buses, and Emergency Responders (Police Cruisers, Ambulances, Fire Trucks) with flashing strobe beacons.
- **Entity Inspector & Roster**: Click any citizen, building, or vehicle in 3D to inspect telemetry or track them.

### 🏗️ Build & Zoning Mode
- Construct new Residential towers, Commercial plazas, Solar power plants, Hospitals, Police stations, and Bio-parks on the 3D grid with real-time budget deduction.

### 🚨 Emergency Dispatch & Incident Management
- Trigger and manage Structural Fires, Power Grid Blackouts, Municipal Cyber Infiltrations, and Cultural Festivals.
- Autonomous emergency responders rush to incident coordinates.

### 🎛️ AI Mayor Advisor & Cyberpunk HUD
- **AI Mayor Advisor**: Interactive chatbot to analyze city health, optimize traffic, and evaluate energy capacity.
- **Municipal Policies**: Toggle Green Energy Subsidies, AI Smart Grid, Autonomous Drone Patrols, and Free Transit.
- **Web Audio Engine**: Native browser-synthesized ambient city soundscape, rain storm audio, emergency sirens, and UI sound effects.
- **Interactive Analytics**: Real-time telemetry charts for population, treasury, satisfaction, and grid loads.

---

## 🛠️ Architecture & Technology Stack

- **Backend / Core Engine**: Python 3 (FastAPI, Uvicorn, Pydantic, WebSockets)
- **Database**: SQLite3 (`eclipse_city.db`) with automatic persistence and save/load
- **3D Graphics Engine**: Three.js WebGL with dynamic shadows, particle weather, and procedural city generation
- **Real-Time Streaming**: Full-duplex WebSockets delivering 60 FPS state sync between Python simulation and 3D frontend
