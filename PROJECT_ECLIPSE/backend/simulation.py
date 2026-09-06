import random
import math
import time
from typing import Dict, List, Optional, Any
from pydantic import BaseModel
import database

FIRST_NAMES = ["Aria", "Kael", "Nyx", "Cyrus", "Zara", "Elena", "Dax", "Vance", "Kira", "Orion", "Sloan", "Nova", "Tarek", "Maya", "Cassian", "Zuri"]
LAST_NAMES = ["Vance", "Mercer", "Chen", "Kowalski", "Sterling", "Cross", "Nakamura", "Vargas", "Sinclair", "Thorne", "Solano", "Blackwood"]
JOBS = [
    {"title": "Cyber Security Specialist", "workplace": "Commercial"},
    {"title": "Urban Vertical Farmer", "workplace": "Green Zone"},
    {"title": "Quantum Neuro-Surgeon", "workplace": "Hospital"},
    {"title": "Transit AI Engineer", "workplace": "Industrial"},
    {"title": "Robo-Bistro Chef", "workplace": "Commercial"},
    {"title": "Clean Energy Architect", "workplace": "Power Plant"},
    {"title": "Autonomous Drone Pilot", "workplace": "Commercial"},
    {"title": "Cyber Crimes Detective", "workplace": "Police Station"},
]
THOUGHTS = [
    "Enjoying the skyline view from the upper deck.",
    "Taking the elevated maglev transit to the central hub.",
    "Grabbing synthetic noodle bowl downtown.",
    "Monitoring the solar energy grid metrics.",
    "Heading to Central Bio-Park for fresh air.",
    "Checking out the new holographic billboard in Sector 2.",
    "Hoping the city council sustains the green energy subsidy.",
    "Glad the emergency services responded so quickly today.",
    "Rain sounds soothing against the balcony glass.",
    "Watching cargo ships dock at Neo-Harbor."
]

SAMPLE_DIALOGUES = [
    ("Did you see the new solar array in Sector 3?", "Yeah, it boosted our clean energy reserves by another 30 MW!"),
    ("The autonomous maglev train cut my commute in half.", "Agreed, public transit automation has been a game changer."),
    ("Is the Cyber Lights Festival happening tonight at the plaza?", "Yes! Holographic fireworks start at 20:00!"),
    ("I heard the Mayor is reviewing commercial tax incentives.", "That should attract more synthetic tech startups downtown."),
    ("The air quality index is down to 24 AQI today.", "Thanks to the vertical aeroponic towers across the green arc.")
]

class Citizen(BaseModel):
    id: str
    name: str
    job: str
    mood: str
    happiness: int
    home_pos: List[float]
    current_pos: List[float]
    target_pos: List[float]
    thought: str
    salary: int

class Building(BaseModel):
    id: str
    type: str # residential, commercial, industrial, hospital, police, solar_plant, park
    name: str
    grid_x: int
    grid_z: int
    world_x: float
    world_z: float
    width: float
    depth: float
    height: float
    floors: int
    occupants: int
    max_occupants: int
    power_draw: float
    revenue_per_tick: float
    hazard: Optional[str] = None

class EmergencyIncident(BaseModel):
    id: str
    type: str
    title: str
    location_x: float
    location_z: float
    building_id: Optional[str] = None
    severity: str
    duration_ticks: int
    resolved: bool = False

class AgentDialogue(BaseModel):
    id: str
    timestamp: str
    speaker_1: str
    speaker_2: str
    line_1: str
    line_2: str

class CityState(BaseModel):
    sim_time_hours: float
    sim_time_formatted: str
    sim_speed: float
    is_paused: bool
    weather: str
    
    population: int
    treasury: float
    tax_rate: float
    happiness: int
    power_grid_load: float
    power_grid_capacity: float
    air_quality_aqi: int
    crime_rate: int
    
    buildings: List[Building]
    citizens: List[Citizen]
    incidents: List[EmergencyIncident]
    policies: Dict[str, bool]
    dialogues: List[AgentDialogue]
    
    advisor_message: str

class CitySimulationEngine:
    def __init__(self):
        self.sim_time_hours = 14.5
        self.sim_speed = 1.0
        self.is_paused = False
        self.weather = "clear"
        self.tick_count = 0
        
        self.treasury = 250000.0
        self.tax_rate = 0.12
        self.happiness = 88
        self.policies = {
            "green_subsidy": True,
            "smart_grid_ai": True,
            "free_transit": False,
            "drone_patrols": True
        }
        
        self.buildings: List[Building] = []
        self.citizens: List[Citizen] = []
        self.incidents: List[EmergencyIncident] = []
        self.dialogues: List[AgentDialogue] = []
        self.advisor_message = "All municipal systems nominal. Elevated maglev network and clean solar grid online."
        
        self._initialize_default_city()
        self._initialize_citizens(count=28)

    def _initialize_default_city(self):
        self.buildings = []
        types_pool = [
            ("residential", "Apex Habitat Tower", 18, 120, 2.4, 450),
            ("commercial", "OmniCorp Cyber Center", 28, 260, 4.8, 1200),
            ("residential", "Neo-Haven Lofts", 12, 80, 1.8, 300),
            ("commercial", "Quantum Commerce Hub", 22, 190, 3.5, 950),
            ("industrial", "Synth-Tech Fabrication", 8, 50, 6.2, 800),
            ("hospital", "Metropolis Bio-Clinic", 10, 140, 3.1, -150),
            ("police", "Enforcement Precinct 01", 7, 60, 2.0, -100),
            ("solar_plant", "Sol-Grid Solar Array", 3, 10, -25.0, 600),
            ("park", "Zenith Bio-Park", 1, 0, 0.2, -50),
        ]
        
        idx = 0
        for gx in range(-3, 4):
            for gz in range(-3, 4):
                if (abs(gx) + abs(gz)) % 3 == 0:
                    continue
                
                t_info = types_pool[idx % len(types_pool)]
                idx += 1
                
                s = abs((gx * 92821 + gz * 68917) % 100) / 100.0
                h = 1.4 + s * 4.6
                floors = int(h * 4)
                
                b = Building(
                    id=f"bldg_{gx}_{gz}",
                    type=t_info[0],
                    name=f"{t_info[1]} {chr(65 + abs(gx))}{abs(gz)}",
                    grid_x=gx,
                    grid_z=gz,
                    world_x=gx * 1.7,
                    world_z=gz * 1.7,
                    width=0.95 + s * 0.3,
                    depth=0.95 + (1 - s) * 0.3,
                    height=round(h, 2),
                    floors=floors,
                    occupants=int(t_info[3] * (0.7 + s * 0.5)),
                    max_occupants=int(t_info[3] * 1.3),
                    power_draw=round(t_info[4] * (0.8 + s * 0.4), 1),
                    revenue_per_tick=round(t_info[5] * (0.8 + s * 0.4), 1),
                    hazard=None
                )
                self.buildings.append(b)

    def _initialize_citizens(self, count: int = 28):
        self.citizens = []
        for i in range(count):
            name = f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}"
            job_info = random.choice(JOBS)
            start_x = (random.random() * 8.0) - 4.0
            start_z = (random.random() * 8.0) - 4.0
            
            c = Citizen(
                id=f"cit_{i+1:03d}",
                name=name,
                job=job_info["title"],
                mood=random.choice(["Ecstatic", "Inspired", "Content", "Relaxed"]),
                happiness=random.randint(82, 99),
                home_pos=[round(start_x, 2), round(start_z, 2)],
                current_pos=[round(start_x, 2), round(start_z, 2)],
                target_pos=[round((random.random() * 8.0) - 4.0, 2), round((random.random() * 8.0) - 4.0, 2)],
                thought=random.choice(THOUGHTS),
                salary=random.randint(65000, 185000)
            )
            self.citizens.append(c)

    def tick(self) -> CityState:
        if not self.is_paused:
            self.tick_count += 1
            
            # Advance simulation time
            delta_time = 0.04 * self.sim_speed
            self.sim_time_hours = (self.sim_time_hours + delta_time) % 24.0
            
            # Weather transition occasionally
            if self.tick_count % 120 == 0:
                roll = random.random()
                if roll < 0.55:
                    self.weather = "clear"
                elif roll < 0.75:
                    self.weather = "rain"
                elif roll < 0.88:
                    self.weather = "fog"
                else:
                    self.weather = "storm"
            
            # Update economic balance
            total_rev = sum(b.revenue_per_tick for b in self.buildings if b.hazard != "blackout")
            tax_income = total_rev * self.tax_rate * 0.1
            self.treasury += tax_income
            
            # Citizen movement & dynamic social encounter
            for i, c in enumerate(self.citizens):
                dx = c.target_pos[0] - c.current_pos[0]
                dz = c.target_pos[1] - c.current_pos[1]
                dist = math.hypot(dx, dz)
                if dist < 0.15:
                    c.target_pos = [round((random.random() * 9.0) - 4.5, 2), round((random.random() * 9.0) - 4.5, 2)]
                    if random.random() < 0.3:
                        c.thought = random.choice(THOUGHTS)
                else:
                    speed = 0.05 * self.sim_speed
                    c.current_pos[0] += (dx / dist) * min(dist, speed)
                    c.current_pos[1] += (dz / dist) * min(dist, speed)
                    c.current_pos[0] = round(c.current_pos[0], 2)
                    c.current_pos[1] = round(c.current_pos[1], 2)
            
            # Trigger occasional AI conversation between random citizens
            if self.tick_count % 25 == 0 and len(self.citizens) >= 2:
                c1, c2 = random.sample(self.citizens, 2)
                pair = random.choice(SAMPLE_DIALOGUES)
                dlg = AgentDialogue(
                    id=f"dlg_{int(time.time()*1000)}",
                    timestamp=self.get_formatted_time(),
                    speaker_1=c1.name,
                    speaker_2=c2.name,
                    line_1=pair[0],
                    line_2=pair[1]
                )
                self.dialogues.insert(0, dlg)
                if len(self.dialogues) > 15:
                    self.dialogues.pop()

            # Update incidents
            for inc in list(self.incidents):
                inc.duration_ticks -= 1
                if inc.duration_ticks <= 0:
                    inc.resolved = True
                    if inc.building_id:
                        for b in self.buildings:
                            if b.id == inc.building_id:
                                b.hazard = None
                    self.incidents.remove(inc)
                    self.advisor_message = f"Emergency resolved: {inc.title} cleared."

            # Log periodic telemetry to SQLite
            if self.tick_count % 20 == 0:
                try:
                    database.log_telemetry_point(self.get_state().model_dump())
                except Exception:
                    pass
        
        return self.get_state()

    def get_formatted_time(self) -> str:
        h_int = int(self.sim_time_hours)
        m_int = int((self.sim_time_hours - h_int) * 60)
        am_pm = "AM" if h_int < 12 else "PM"
        disp_h = h_int if (1 <= h_int <= 12) else (h_int - 12 if h_int > 12 else 12)
        return f"{disp_h:02d}:{m_int:02d} {am_pm}"

    def trigger_incident_manual(self, inc_type: str) -> EmergencyIncident:
        target_b = random.choice(self.buildings) if self.buildings else None
        if not target_b:
            target_b = Building(id="bldg_0_0", type="commercial", name="Downtown Plaza", grid_x=0, grid_z=0, world_x=0, world_z=0, width=1, depth=1, height=3, floors=12, occupants=100, max_occupants=100, power_draw=5, revenue_per_tick=100)
        
        loc_x = target_b.world_x
        loc_z = target_b.world_z
        
        if inc_type == "fire":
            target_b.hazard = "fire"
            inc = EmergencyIncident(
                id=f"inc_{int(time.time()*1000)}",
                type="fire",
                title=f"Fire Emergency at {target_b.name}",
                location_x=loc_x,
                location_z=loc_z,
                building_id=target_b.id,
                severity="critical",
                duration_ticks=30
            )
            self.incidents.append(inc)
            self.advisor_message = f"🚨 Fire dispatched to {target_b.name}."
            return inc
        elif inc_type == "blackout":
            target_b.hazard = "blackout"
            inc = EmergencyIncident(
                id=f"inc_{int(time.time()*1000)}",
                type="blackout",
                title=f"Grid Outage at {target_b.name}",
                location_x=loc_x,
                location_z=loc_z,
                building_id=target_b.id,
                severity="medium",
                duration_ticks=25
            )
            self.incidents.append(inc)
            self.advisor_message = f"⚡ Power repair team dispatched to {target_b.name}."
            return inc
        elif inc_type == "cyber_attack":
            inc = EmergencyIncident(
                id=f"inc_{int(time.time()*1000)}",
                type="cyber_attack",
                title="Municipal Network Quantum Infiltration",
                location_x=0.0,
                location_z=0.0,
                severity="critical",
                duration_ticks=30
            )
            self.incidents.append(inc)
            self.advisor_message = "🛡️ Quantum firewall deployed. Neutralizing network cyber-threat."
            return inc
        else:
            inc = EmergencyIncident(
                id=f"inc_{int(time.time()*1000)}",
                type="festival",
                title="Holographic Sound Festival",
                location_x=0.0,
                location_z=0.0,
                severity="low",
                duration_ticks=30
            )
            self.incidents.append(inc)
            self.advisor_message = "🎉 Holographic festival started!"
            return inc

    def add_building(self, b_type: str, grid_x: int, grid_z: int) -> Optional[Building]:
        for b in self.buildings:
            if b.grid_x == grid_x and b.grid_z == grid_z:
                return None
        
        cost_map = {
            "residential": (15000, 18, 120, 2.4, 450, 3.2),
            "commercial": (25000, 26, 220, 4.5, 900, 4.2),
            "industrial": (20000, 8, 40, 5.8, 750, 1.8),
            "hospital": (35000, 10, 150, 3.0, -100, 2.4),
            "police": (22000, 6, 50, 1.8, -80, 1.6),
            "solar_plant": (30000, 2, 5, -30.0, 500, 0.8),
            "park": (8000, 1, 0, 0.1, -20, 0.4)
        }
        
        cost, floors, occ, p_draw, rev, h = cost_map.get(b_type, (15000, 12, 100, 2.0, 300, 2.0))
        if self.treasury < cost:
            return None
        
        self.treasury -= cost
        new_b = Building(
            id=f"bldg_{grid_x}_{grid_z}_{int(time.time())}",
            type=b_type,
            name=f"New {b_type.title()} Sector ({grid_x}, {grid_z})",
            grid_x=grid_x,
            grid_z=grid_z,
            world_x=grid_x * 1.7,
            world_z=grid_z * 1.7,
            width=1.1,
            depth=1.1,
            height=h,
            floors=floors,
            occupants=occ,
            max_occupants=int(occ * 1.2),
            power_draw=p_draw,
            revenue_per_tick=rev,
            hazard=None
        )
        self.buildings.append(new_b)
        self.advisor_message = f"Construction complete: {new_b.name} is now operational."
        return new_b

    def toggle_policy(self, policy_id: str) -> bool:
        if policy_id in self.policies:
            self.policies[policy_id] = not self.policies[policy_id]
            status = "enabled" if self.policies[policy_id] else "disabled"
            self.advisor_message = f"Policy update: {policy_id.replace('_', ' ').title()} is now {status}."
            return self.policies[policy_id]
        return False

    def query_ai_advisor(self, question: str) -> str:
        q_lower = question.lower()
        if "traffic" in q_lower or "road" in q_lower:
            return f"Traffic flow is operating at 94% throughput. The elevated maglev lines are diverting 40% of commuter loads from street level."
        elif "power" in q_lower or "energy" in q_lower or "grid" in q_lower:
            load = sum(b.power_draw for b in self.buildings)
            cap = 140.0 + (30.0 if self.policies.get("green_subsidy") else 0.0)
            return f"Power grid load is {load:.1f} MW out of {cap:.1f} MW capacity ({load/cap*100:.0f}% load). Clean solar distribution is stable."
        elif "economy" in q_lower or "tax" in q_lower or "budget" in q_lower or "money" in q_lower:
            return f"Treasury stands at ${self.treasury:,.0f} with a {self.tax_rate*100:.0f}% tax rate. Commercial revenue yields stable surplus per tick."
        elif "citizen" in q_lower or "happiness" in q_lower or "people" in q_lower:
            return f"Citizen satisfaction index is {self.happiness}%. High approval for clean energy, zero-congestion transit, and bio-parks."
        else:
            return f"Mayor, our neural monitoring systems report all primary metrics are in optimal thresholds. Recommendation: Expand commercial zones in open perimeter plots to boost quarterly municipal reserves."

    def get_state(self) -> CityState:
        total_pop = sum(b.occupants for b in self.buildings)
        total_power_load = max(10.0, sum(b.power_draw for b in self.buildings if b.power_draw > 0))
        solar_gen = sum(abs(b.power_draw) for b in self.buildings if b.power_draw < 0)
        power_cap = 120.0 + solar_gen * 1.5
        
        has_fire = any(b.hazard == "fire" for b in self.buildings)
        has_blackout = any(b.hazard == "blackout" for b in self.buildings)
        
        eff_happiness = self.happiness
        if has_fire: eff_happiness -= 12
        if has_blackout: eff_happiness -= 8
        if self.weather == "storm": eff_happiness -= 5
        eff_happiness = max(10, min(100, eff_happiness))
        
        return CityState(
            sim_time_hours=round(self.sim_time_hours, 2),
            sim_time_formatted=self.get_formatted_time(),
            sim_speed=self.sim_speed,
            is_paused=self.is_paused,
            weather=self.weather,
            population=total_pop,
            treasury=round(self.treasury, 2),
            tax_rate=self.tax_rate,
            happiness=eff_happiness,
            power_grid_load=round(total_power_load, 1),
            power_grid_capacity=round(power_cap, 1),
            air_quality_aqi=24 if self.policies.get("green_subsidy") else 46,
            crime_rate=5 if self.policies.get("drone_patrols") else 15,
            buildings=self.buildings,
            citizens=self.citizens,
            incidents=self.incidents,
            policies=self.policies,
            dialogues=self.dialogues,
            advisor_message=self.advisor_message
        )

simulation_engine = CitySimulationEngine()
