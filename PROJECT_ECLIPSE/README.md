# PROJECT NEXUS 🌍
**Autonomous AI Virtual City Simulator & Digital World — Next-Gen Platform**

PROJECT NEXUS is a state-of-the-art AI-driven smart city simulation platform featuring interactive 3D procedural environments, multi-agent AI citizens, smart traffic networks, dynamic day/night & weather engines, city management, disaster dispatch, and real-time backend synchronization.

---

## ✨ Features

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

---

## 🚀 Getting Started

### 1. Run Frontend
```bash
cd frontend
npm install
npm run dev
```
Open **http://localhost:5173** in your browser.

### 2. Run Backend (FastAPI + WebSockets)
```bash
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
API Documentation will be available at **http://localhost:8000/docs**.

*Note: The frontend also features a built-in client-side simulation engine that runs seamlessly even without the backend active.*
