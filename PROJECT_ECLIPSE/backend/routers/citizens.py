from fastapi import APIRouter
from simulation import simulation_engine

router = APIRouter(prefix="/api/citizens", tags=["Citizens"])

@router.get("/")
def list_citizens():
    return {"citizens": [c.model_dump() for c in simulation_engine.citizens]}

@router.get("/dialogues")
def get_dialogues():
    return {"dialogues": [d.model_dump() for d in simulation_engine.dialogues]}
