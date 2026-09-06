from fastapi import APIRouter
import database
from simulation import simulation_engine

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])

@router.get("/history")
def get_history(limit: int = 50):
    history = database.get_telemetry_history(limit=limit)
    if not history:
        # Generate baseline history if fresh db
        state = simulation_engine.get_state()
        history = [
            {
                "timestamp": i,
                "sim_time": (state.sim_time_hours - (50 - i) * 0.1) % 24.0,
                "population": state.population - (50 - i) * 5,
                "treasury": state.treasury - (50 - i) * 200,
                "happiness": min(100, max(70, state.happiness - (i % 5))),
                "power_load": state.power_grid_load + (i % 7) - 3,
                "crime_rate": max(2, state.crime_rate + (i % 3) - 1),
                "air_quality": max(15, state.air_quality_aqi + (i % 4) - 2)
            }
            for i in range(50)
        ]
    return {"status": "success", "history": history}

@router.get("/summary")
def get_summary():
    state = simulation_engine.get_state()
    return {
        "population": state.population,
        "treasury": state.treasury,
        "happiness": state.happiness,
        "power_grid_load": state.power_grid_load,
        "power_grid_capacity": state.power_grid_capacity,
        "active_incidents": len(state.incidents),
        "total_buildings": len(state.buildings)
    }
