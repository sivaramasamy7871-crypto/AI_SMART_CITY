import asyncio
import json
from datetime import datetime
from typing import Dict, Any
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from simulation import simulation_engine
from routers import analytics, citizens, save_load

app = FastAPI(
    title="Project Nexus Simulation Engine API",
    description="Enterprise Multi-Agent City Simulator, Telemetry & WebSocket Engine",
    version="1.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse

# Include Modular Routers
app.include_router(analytics.router)
app.include_router(citizens.router)
app.include_router(save_load.router)

# Mount Static Assets for 3D Smart City frontend
STATIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static")
if os.path.exists(STATIC_DIR):
    assets_dir = os.path.join(STATIC_DIR, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

class BuildRequest(BaseModel):
    building_type: str
    grid_x: int
    grid_z: int

class TriggerEventRequest(BaseModel):
    event_type: str

class PolicyRequest(BaseModel):
    policy_id: str

class SimControlRequest(BaseModel):
    speed: float = 1.0
    paused: bool = False
    weather: str = "clear"
    time_hours: float = 14.5

class AdvisorQueryRequest(BaseModel):
    question: str

@app.get("/", response_class=HTMLResponse)
def root_index():
    index_path = os.path.join(STATIC_DIR, "index.html")
    if os.path.exists(index_path):
        with open(index_path, "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read())
    return HTMLResponse("<h1>PROJECT NEXUS — Smart City Simulation Engine Online</h1><p>Visit <a href='/docs'>/docs</a> for API.</p>")



@app.get("/api/health")
def health():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.get("/api/city/state")
def get_city_state():
    return simulation_engine.get_state().model_dump()

@app.post("/api/city/control")
def update_sim_control(req: SimControlRequest):
    simulation_engine.sim_speed = req.speed
    simulation_engine.is_paused = req.paused
    if req.weather in ["clear", "rain", "storm", "fog", "night_fog"]:
        simulation_engine.weather = req.weather
    if 0.0 <= req.time_hours <= 24.0:
        simulation_engine.sim_time_hours = req.time_hours
    return simulation_engine.get_state().model_dump()

@app.post("/api/city/build")
def build_structure(req: BuildRequest):
    b = simulation_engine.add_building(req.building_type, req.grid_x, req.grid_z)
    if not b:
        raise HTTPException(status_code=400, detail="Cannot build here or insufficient municipal treasury funds.")
    return {"status": "success", "building": b.model_dump(), "state": simulation_engine.get_state().model_dump()}

@app.post("/api/city/event/trigger")
def trigger_event(req: TriggerEventRequest):
    inc = simulation_engine.trigger_incident_manual(req.event_type)
    return {"status": "success", "incident": inc.model_dump(), "state": simulation_engine.get_state().model_dump()}

@app.post("/api/city/policy/toggle")
def toggle_policy(req: PolicyRequest):
    new_val = simulation_engine.toggle_policy(req.policy_id)
    return {"status": "success", "policy_id": req.policy_id, "enabled": new_val, "state": simulation_engine.get_state().model_dump()}

@app.post("/api/city/advisor/query")
def query_advisor(req: AdvisorQueryRequest):
    answer = simulation_engine.query_ai_advisor(req.question)
    return {"question": req.question, "answer": answer, "timestamp": datetime.now().isoformat()}

@app.websocket("/ws/simulation")
async def simulation_websocket(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            try:
                data = await asyncio.wait_for(websocket.receive_text(), timeout=0.1)
                cmd = json.loads(data)
                action = cmd.get("action")
                if action == "build":
                    simulation_engine.add_building(cmd["building_type"], cmd["grid_x"], cmd["grid_z"])
                elif action == "trigger_event":
                    simulation_engine.trigger_incident_manual(cmd["event_type"])
                elif action == "toggle_policy":
                    simulation_engine.toggle_policy(cmd["policy_id"])
                elif action == "set_speed":
                    simulation_engine.sim_speed = float(cmd.get("speed", 1.0))
                elif action == "set_paused":
                    simulation_engine.is_paused = bool(cmd.get("paused", False))
                elif action == "set_weather":
                    simulation_engine.weather = cmd.get("weather", "clear")
                elif action == "set_time":
                    simulation_engine.sim_time_hours = float(cmd.get("time_hours", 12.0))
            except asyncio.TimeoutError:
                pass
            
            state = simulation_engine.tick()
            await websocket.send_text(json.dumps(state.model_dump()))
            await asyncio.sleep(0.15)
            
    except WebSocketDisconnect:
        pass
    except Exception as e:
        print(f"WebSocket closed: {e}")