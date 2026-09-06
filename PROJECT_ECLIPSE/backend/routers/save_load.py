import time
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
import database
from simulation import simulation_engine, Building, Citizen

router = APIRouter(prefix="/api/saves", tags=["SaveLoad"])

class SaveRequest(BaseModel):
    name: str

@router.get("/")
def list_saves():
    return {"saves": database.list_city_saves()}

@router.post("/save")
def create_save(req: SaveRequest):
    save_id = f"save_{int(time.time()*1000)}"
    state = simulation_engine.get_state().model_dump()
    database.save_city_snapshot(save_id, req.name, state)
    return {"status": "success", "save_id": save_id, "name": req.name}

@router.post("/load/{save_id}")
def load_save(save_id: str):
    data = database.load_city_snapshot(save_id)
    if not data:
        raise HTTPException(status_code=404, detail="Save snapshot not found.")
    
    # Restore state into simulation engine
    simulation_engine.treasury = data["treasury"]
    simulation_engine.happiness = data["happiness"]
    simulation_engine.weather = data["weather"]
    simulation_engine.sim_time_hours = data["sim_time_hours"]
    simulation_engine.policies = data["policies"]
    
    # Rebuild buildings and citizens
    simulation_engine.buildings = [Building(**b) for b in data["buildings"]]
    simulation_engine.citizens = [Citizen(**c) for c in data["citizens"]]
    simulation_engine.advisor_message = f"City snapshot '{data['name']}' loaded successfully."
    
    return {"status": "success", "state": simulation_engine.get_state().model_dump()}
