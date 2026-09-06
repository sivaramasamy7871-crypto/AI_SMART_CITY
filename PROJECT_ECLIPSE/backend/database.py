import json
import os
import sqlite3
import time
from typing import List, Dict, Any, Optional

DB_FILE = os.path.join(os.path.dirname(__file__), "eclipse_city.db")

def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    # City Saves Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS city_saves (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            population INTEGER,
            treasury REAL,
            happiness INTEGER,
            buildings_json TEXT,
            citizens_json TEXT,
            policies_json TEXT,
            weather TEXT,
            sim_time_hours REAL
        )
    """)
    
    # Telemetry History Table for Analytics
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS telemetry_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp REAL,
            sim_time_hours REAL,
            population INTEGER,
            treasury REAL,
            happiness INTEGER,
            power_load REAL,
            crime_rate INTEGER,
            air_quality INTEGER
        )
    """)
    
    # Agent Dialogues Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS agent_dialogues (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp REAL,
            speaker_1 TEXT,
            speaker_2 TEXT,
            topic TEXT,
            dialogue_text TEXT
        )
    """)
    
    conn.commit()
    conn.close()

def save_city_snapshot(save_id: str, name: str, state_data: Dict[str, Any]):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT OR REPLACE INTO city_saves 
        (id, name, population, treasury, happiness, buildings_json, citizens_json, policies_json, weather, sim_time_hours)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        save_id,
        name,
        state_data.get("population", 0),
        state_data.get("treasury", 0.0),
        state_data.get("happiness", 80),
        json.dumps([b if isinstance(b, dict) else b.model_dump() for b in state_data.get("buildings", [])]),
        json.dumps([c if isinstance(c, dict) else c.model_dump() for c in state_data.get("citizens", [])]),
        json.dumps(state_data.get("policies", {})),
        state_data.get("weather", "clear"),
        state_data.get("sim_time_hours", 12.0)
    ))
    conn.commit()
    conn.close()

def list_city_saves() -> List[Dict[str, Any]]:
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, created_at, population, treasury, happiness FROM city_saves ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()
    return [
        {
            "id": r[0],
            "name": r[1],
            "created_at": r[2],
            "population": r[3],
            "treasury": r[4],
            "happiness": r[5]
        }
        for r in rows
    ]

def load_city_snapshot(save_id: str) -> Optional[Dict[str, Any]]:
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, name, population, treasury, happiness, buildings_json, citizens_json, policies_json, weather, sim_time_hours
        FROM city_saves WHERE id = ?
    """, (save_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        return None
    return {
        "id": row[0],
        "name": row[1],
        "population": row[2],
        "treasury": row[3],
        "happiness": row[4],
        "buildings": json.loads(row[5]),
        "citizens": json.loads(row[6]),
        "policies": json.loads(row[7]),
        "weather": row[8],
        "sim_time_hours": row[9]
    }

def log_telemetry_point(state_data: Dict[str, Any]):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO telemetry_history 
        (timestamp, sim_time_hours, population, treasury, happiness, power_load, crime_rate, air_quality)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        time.time(),
        state_data.get("sim_time_hours", 12.0),
        state_data.get("population", 0),
        state_data.get("treasury", 0.0),
        state_data.get("happiness", 80),
        state_data.get("power_grid_load", 50.0),
        state_data.get("crime_rate", 5),
        state_data.get("air_quality_aqi", 30)
    ))
    conn.commit()
    conn.close()

def get_telemetry_history(limit: int = 50) -> List[Dict[str, Any]]:
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("""
        SELECT timestamp, sim_time_hours, population, treasury, happiness, power_load, crime_rate, air_quality
        FROM telemetry_history ORDER BY id DESC LIMIT ?
    """, (limit,))
    rows = cursor.fetchall()
    conn.close()
    history = [
        {
            "timestamp": r[0],
            "sim_time": r[1],
            "population": r[2],
            "treasury": r[3],
            "happiness": r[4],
            "power_load": r[5],
            "crime_rate": r[6],
            "air_quality": r[7]
        }
        for r in reversed(rows)
    ]
    return history

init_db()
