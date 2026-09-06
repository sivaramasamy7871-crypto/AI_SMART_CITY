import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { CityScene } from './components/world/CityScene';
import { HUD } from './components/ui/HUD';
import { MayorModal } from './components/ui/MayorModal';
import { BuildMenu } from './components/ui/BuildMenu';
import { DisasterMenu } from './components/ui/DisasterMenu';
import { CitizenInspector } from './components/ui/CitizenInspector';
import { CityAnalyticsDashboard } from './components/analytics/CityAnalyticsDashboard';
import { CitizenSocialNetwork } from './components/agents/CitizenSocialNetwork';
import { SaveLoadModal } from './components/save/SaveLoadModal';
import { CityMapSelectorModal } from './components/ui/CityMapSelectorModal';
import { ToastContainer } from './services/notificationService.jsx';
import { soundEngine } from './audio/soundEngine';
import { REAL_CITIES } from './data/realCityMaps';
import { fetchLiveCityWeather } from './services/realWeatherService';

const INITIAL_CITIZENS = [
  { id: 'cit_001', name: 'Aria Vance', job: 'Cyber Security Specialist', mood: 'Ecstatic', happiness: 96, home_pos: [1.2, -1.2], current_pos: [1.2, -1.2], target_pos: [-2.0, 2.0], thought: 'Monitoring the municipal quantum firewall for intrusions.', salary: 145000 },
  { id: 'cit_002', name: 'Kael Chen', job: 'Quantum Neuro-Surgeon', mood: 'Inspired', happiness: 92, home_pos: [-2.0, 1.5], current_pos: [-2.0, 1.5], target_pos: [2.5, -1.0], thought: 'Heading to Metropolis Bio-Clinic for scheduled bio-prosthetic surgery.', salary: 185000 },
  { id: 'cit_003', name: 'Zara Mercer', job: 'Clean Energy Architect', mood: 'Content', happiness: 89, home_pos: [0.0, 2.5], current_pos: [0.0, 2.5], target_pos: [-1.5, -2.5], thought: 'Solar grid telemetry is producing surplus clean energy.', salary: 130000 },
  { id: 'cit_004', name: 'Dax Kowalski', job: 'Autonomous Drone Pilot', mood: 'Relaxed', happiness: 85, home_pos: [-1.8, -1.8], current_pos: [-1.8, -1.8], target_pos: [1.8, 1.8], thought: 'Delivering urgent medical supplies across Sector 3.', salary: 98000 },
  { id: 'cit_005', name: 'Elena Cross', job: 'Urban Vertical Farmer', mood: 'Inspired', happiness: 94, home_pos: [2.5, 0.5], current_pos: [2.5, 0.5], target_pos: [0.0, 0.0], thought: 'Harvesting aeroponic strawberries at Zenith Bio-Park.', salary: 78000 },
  { id: 'cit_006', name: 'Orion Blackwood', job: 'Cyber Crimes Detective', mood: 'Focused', happiness: 88, home_pos: [-3.0, 0.0], current_pos: [-3.0, 0.0], target_pos: [2.0, -2.0], thought: 'Patrolling Sector 1 intersections with autonomous squad cruiser.', salary: 115000 },
  { id: 'cit_007', name: 'Nova Sinclair', job: 'Robo-Bistro Chef', mood: 'Ecstatic', happiness: 98, home_pos: [0.5, -2.5], current_pos: [0.5, -2.5], target_pos: [-1.0, 1.0], thought: 'Serving steaming synthetic ramen bowls in Cyber Plaza.', salary: 88000 },
  { id: 'cit_008', name: 'Tarek Thorne', job: 'Transit AI Engineer', mood: 'Content', happiness: 91, home_pos: [-1.5, -3.0], current_pos: [-1.5, -3.0], target_pos: [3.0, 3.0], thought: 'Optimizing traffic light cycle timings for emergency vehicles.', salary: 125000 }
];

function generateDefaultBuildings() {
  const b = [];
  const types = [
    { type: 'residential', name: 'Apex Habitat Tower', h: 3.8, fl: 16, occ: 140, p: 2.4, rev: 450 },
    { type: 'commercial', name: 'OmniCorp Cyber Center', h: 4.8, fl: 22, occ: 260, p: 4.8, rev: 1100 },
    { type: 'residential', name: 'Neo-Haven Lofts', h: 2.6, fl: 10, occ: 90, p: 1.8, rev: 320 },
    { type: 'commercial', name: 'Quantum Commerce Hub', h: 4.2, fl: 18, occ: 200, p: 3.5, rev: 950 },
    { type: 'industrial', name: 'Synth-Tech Fabrication', h: 2.0, fl: 6, occ: 45, p: 5.8, rev: 800 },
    { type: 'hospital', name: 'Metropolis Bio-Clinic', h: 2.8, fl: 10, occ: 120, p: 3.0, rev: -100 },
    { type: 'police', name: 'Enforcement Precinct 01', h: 1.8, fl: 6, occ: 50, p: 1.8, rev: -80 },
    { type: 'solar_plant', name: 'Sol-Grid Solar Array', h: 0.8, fl: 2, occ: 5, p: -25.0, rev: 500 },
    { type: 'park', name: 'Zenith Bio-Park', h: 0.4, fl: 1, occ: 0, p: 0.1, rev: -20 }
  ];

  let idx = 0;
  for (let x = -3; x <= 3; x++) {
    for (let z = -3; z <= 3; z++) {
      if ((Math.abs(x) + Math.abs(z)) % 3 === 0) continue;
      const t = types[idx % types.length];
      idx++;
      const s = Math.abs((x * 92821 + z * 68917) % 100) / 100.0;
      const h = t.h * (0.85 + s * 0.3);

      b.push({
        id: `bldg_${x}_${z}`,
        type: t.type,
        name: `${t.name} ${chr(65 + Math.abs(x))}${Math.abs(z)}`,
        grid_x: x,
        grid_z: z,
        world_x: x * 1.7,
        world_z: z * 1.7,
        width: 0.95 + s * 0.25,
        depth: 0.95 + (1 - s) * 0.25,
        height: Math.round(h * 10) / 10,
        floors: t.fl,
        occupants: t.occ,
        max_occupants: Math.round(t.occ * 1.2),
        power_draw: t.p,
        revenue_per_tick: t.rev,
        hazard: null
      });
    }
  }
  return b;
}

function chr(code) {
  return String.fromCharCode(code);
}

export default function App() {
  // Real-World City & Map Selection State (Default to New York Manhattan)
  const [selectedCity, setSelectedCity] = useState(REAL_CITIES[2]); 
  const [currentCityTemp, setCurrentCityTemp] = useState(REAL_CITIES[2].ambientTemp);

  // Simulation State
  const [simTimeHours, setSimTimeHours] = useState(14.5);
  const [simSpeed, setSimSpeed] = useState(1.0);
  const [isPaused, setIsPaused] = useState(false);
  const [weather, setWeather] = useState('clear');
  const [population, setPopulation] = useState(1850);
  const [treasury, setTreasury] = useState(250000);
  const [taxRate, setTaxRate] = useState(0.12);
  const [happiness, setHappiness] = useState(91);
  const [powerGridLoad, setPowerGridLoad] = useState(58.4);
  const [powerGridCap, setPowerGridCap] = useState(120.0);
  const [airQuality, setAirQuality] = useState(24);
  const [crimeRate, setCrimeRate] = useState(5);

  const [buildings, setBuildings] = useState(() => selectedCity.buildings || generateDefaultBuildings());
  const [citizens, setCitizens] = useState(INITIAL_CITIZENS);
  const [incidents, setIncidents] = useState([]);
  const [dialogues, setDialogues] = useState([
    {
      id: 'dlg_init',
      timestamp: '02:30 PM',
      speaker_1: 'Aria Vance',
      speaker_2: 'Kael Chen',
      line_1: 'The coastal transit line along Marina beach has zero traffic today!',
      line_2: 'Great! And the solar array is producing surplus clean energy.'
    }
  ]);
  const [policies, setPolicies] = useState({
    green_subsidy: true,
    smart_grid_ai: true,
    free_transit: false,
    drone_patrols: true
  });
  const [advisorMessage, setAdvisorMessage] = useState("All municipal systems operational. Clean energy output nominal.");

  // Modals & UI Toggles
  const [isMuted, setIsMuted] = useState(true);
  const [cameraMode, setCameraMode] = useState('orbit');
  const [activeBuildType, setActiveBuildType] = useState(null);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [isMayorOpen, setIsMayorOpen] = useState(false);
  const [isBuildOpen, setIsBuildOpen] = useState(false);
  const [isDisastersOpen, setIsDisastersOpen] = useState(false);
  const [isRosterOpen, setIsRosterOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isSocialOpen, setIsSocialOpen] = useState(false);
  const [isSavesOpen, setIsSavesOpen] = useState(false);
  const [isMapSelectorOpen, setIsMapSelectorOpen] = useState(false);

  // Toast Notifications
  const [toasts, setToasts] = useState([]);
  const addToast = (message, type = 'info') => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const wsRef = useRef(null);

  // Initial Real City Weather Sync
  useEffect(() => {
    fetchLiveCityWeather(selectedCity.lat, selectedCity.lng, selectedCity.timezone)
      .then((data) => {
        if (data) {
          setCurrentCityTemp(data.temperature);
          setWeather(data.simWeather);
          soundEngine.setWeather(data.simWeather);
          setSimTimeHours(data.localHours);
        }
      })
      .catch(() => {});
  }, [selectedCity]);

  // Handle Changing Real City Map
  const handleSelectCityMap = async (city) => {
    setSelectedCity(city);
    soundEngine.playClick();
    addToast(`Loading real-world map: ${city.name}...`, "info");

    // Load city buildings layout
    if (city.buildings) {
      setBuildings(city.buildings);
    } else {
      setBuildings(generateDefaultBuildings());
    }

    // Fetch Live Real-World Weather & Local Time
    const weatherData = await fetchLiveCityWeather(city.lat, city.lng, city.timezone);
    if (weatherData) {
      setCurrentCityTemp(weatherData.temperature);
      setWeather(weatherData.simWeather);
      soundEngine.setWeather(weatherData.simWeather);
      setSimTimeHours(weatherData.localHours);
      addToast(`Synced live weather for ${city.name}: ${weatherData.temperature}, ${weatherData.simWeather.toUpperCase()}`, "success");
    } else {
      setCurrentCityTemp(city.ambientTemp);
    }
  };

  // WebSocket Integration with Backend
  useEffect(() => {
    let ws;
    const connect = () => {
      try {
        ws = new WebSocket('ws://localhost:8000/ws/simulation');
        wsRef.current = ws;

        ws.onopen = () => {
          addToast("Connected to Python Simulation Engine backend!", "success");
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            setPopulation(data.population);
            setTreasury(data.treasury);
            setTaxRate(data.tax_rate);
            setHappiness(data.happiness);
            setPowerGridLoad(data.power_grid_load);
            setPowerGridCap(data.power_grid_capacity);
            setAirQuality(data.air_quality_aqi);
            setCrimeRate(data.crime_rate);
            if (data.dialogues && data.dialogues.length > 0) setDialogues(data.dialogues);
            if (data.advisor_message) setAdvisorMessage(data.advisor_message);
          } catch (e) {}
        };
      } catch (e) {}
    };

    connect();
    return () => {
      if (ws) ws.close();
    };
  }, []);

  // Client Simulation Loop Fallback
  useEffect(() => {
    const interval = setInterval(() => {
      if (isPaused) return;

      setSimTimeHours((prev) => (prev + 0.04 * simSpeed) % 24.0);
      setTreasury((prev) => prev + (buildings.length * 15 * taxRate * simSpeed));

      setCitizens((prevCitizens) =>
        prevCitizens.map((c) => {
          const dx = c.target_pos[0] - c.current_pos[0];
          const dz = c.target_pos[1] - c.current_pos[1];
          const dist = Math.hypot(dx, dz);
          if (dist < 0.2) {
            return {
              ...c,
              target_pos: [
                Math.round(((Math.random() * 8) - 4) * 100) / 100,
                Math.round(((Math.random() * 8) - 4) * 100) / 100
              ]
            };
          }
          const speed = 0.04 * simSpeed;
          return {
            ...c,
            current_pos: [
              Math.round((c.current_pos[0] + (dx / dist) * Math.min(dist, speed)) * 100) / 100,
              Math.round((c.current_pos[1] + (dz / dist) * Math.min(dist, speed)) * 100) / 100
            ]
          };
        })
      );

      setIncidents((prev) =>
        prev
          .map((inc) => ({ ...inc, duration_ticks: inc.duration_ticks - 1 }))
          .filter((inc) => {
            if (inc.duration_ticks <= 0) {
              if (inc.building_id) {
                setBuildings((bList) =>
                  bList.map((b) => (b.id === inc.building_id ? { ...b, hazard: null } : b))
                );
              }
              return false;
            }
            return true;
          })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, simSpeed, buildings.length, taxRate]);

  const sendCommand = (cmd) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(cmd));
    }
  };

  const handleTogglePause = () => {
    soundEngine.playClick();
    const next = !isPaused;
    setIsPaused(next);
    sendCommand({ action: 'set_paused', paused: next });
  };

  const handleSetSpeed = (spd) => {
    soundEngine.playClick();
    setSimSpeed(spd);
    sendCommand({ action: 'set_speed', speed: spd });
  };

  const handleSetWeather = (w) => {
    soundEngine.playClick();
    setWeather(w);
    soundEngine.setWeather(w);
    sendCommand({ action: 'set_weather', weather: w });
  };

  const handleSetTimeHours = (h) => {
    setSimTimeHours(h);
    sendCommand({ action: 'set_time', time_hours: h });
  };

  const handleToggleMute = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
    addToast(muted ? "Soundscape Muted" : "Web Audio Synthesizer Active 🔊", "info");
  };

  const handleToggleCameraMode = () => {
    soundEngine.playClick();
    setCameraMode((prev) => (prev === 'orbit' ? 'topdown' : 'orbit'));
  };

  const handleToggleFPV = () => {
    soundEngine.playClick();
    setCameraMode((prev) => (prev === 'fpv' ? 'orbit' : 'fpv'));
    if (cameraMode !== 'fpv') {
      addToast("Entered FPV Street Walking Mode! Use WASD to walk.", "success");
    }
  };

  const handlePlaceBuilding = (bType, gridX, gridZ) => {
    soundEngine.playBuildSound();
    const costMap = {
      residential: 15000,
      commercial: 25000,
      industrial: 20000,
      solar_plant: 30000,
      hospital: 35000,
      police: 22000,
      park: 8000
    };
    const cost = costMap[bType] || 15000;
    if (treasury < cost) {
      addToast("Insufficient municipal treasury funds to construct!", "alert");
      return;
    }

    setTreasury((prev) => prev - cost);
    setActiveBuildType(null);

    const newB = {
      id: `bldg_${gridX}_${gridZ}_${Date.now()}`,
      type: bType,
      name: `New ${bType.replace('_', ' ').toUpperCase()} (${gridX}, ${gridZ})`,
      grid_x: gridX,
      grid_z: gridZ,
      world_x: gridX * 1.7,
      world_z: gridZ * 1.7,
      width: 1.05,
      depth: 1.05,
      height: bType === 'solar_plant' ? 0.8 : (bType === 'park' ? 0.3 : 3.2),
      floors: 12,
      occupants: 120,
      max_occupants: 150,
      power_draw: bType === 'solar_plant' ? -25 : 3.0,
      revenue_per_tick: 500,
      hazard: null
    };

    setBuildings((prev) => [...prev, newB]);
    addToast(`Constructed ${newB.name}! -$${cost.toLocaleString()}`, "success");
    sendCommand({ action: 'build', building_type: bType, grid_x: gridX, grid_z: gridZ });
  };

  const handleTriggerEvent = (eventType) => {
    soundEngine.playClick();
    if (eventType === 'fire') soundEngine.triggerSiren(5);

    const targetB = buildings.length > 0 ? buildings[Math.floor(Math.random() * buildings.length)] : null;
    const newInc = {
      id: `inc_${Date.now()}`,
      type: eventType,
      title: eventType === 'fire' ? `Structural Fire at ${targetB?.name || 'Downtown'}` :
             eventType === 'blackout' ? `Grid Outage at ${targetB?.name || 'Sector 2'}` :
             eventType === 'cyber_attack' ? 'Municipal Quantum Infiltration' : 'Cyber Lights Cultural Festival',
      location_x: targetB?.world_x || 0,
      location_z: targetB?.world_z || 0,
      building_id: targetB?.id || null,
      severity: eventType === 'fire' || eventType === 'cyber_attack' ? 'critical' : 'medium',
      duration_ticks: 25
    };

    if (targetB && (eventType === 'fire' || eventType === 'blackout')) {
      setBuildings((bList) =>
        bList.map((b) => (b.id === targetB.id ? { ...b, hazard: eventType } : b))
      );
    }

    setIncidents((prev) => [newInc, ...prev]);
    setIsDisastersOpen(false);
    addToast(`Incident Alert: ${newInc.title}! Emergency units dispatched.`, "alert");
    sendCommand({ action: 'trigger_event', event_type: eventType });
  };

  const handleTogglePolicy = (policyId) => {
    soundEngine.playClick();
    setPolicies((prev) => {
      const updated = { ...prev, [policyId]: !prev[policyId] };
      addToast(`Policy ${policyId.replace('_', ' ').toUpperCase()} updated!`, "info");
      return updated;
    });
    sendCommand({ action: 'toggle_policy', policy_id: policyId });
  };

  const handleQueryAdvisor = async (queryText) => {
    try {
      const res = await fetch('http://localhost:8000/api/city/advisor/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: queryText })
      });
      if (res.ok) {
        const data = await res.json();
        return data.answer;
      }
    } catch (e) {}

    const q = queryText.toLowerCase();
    if (q.includes('traffic')) return `Traffic flow in ${selectedCity.name} is operating at 94% efficiency. Coastal transit lines are clear.`;
    if (q.includes('power') || q.includes('energy')) return `Energy grid load is ${powerGridLoad} MW out of ${powerGridCap} MW. Clean solar distribution is stable.`;
    if (q.includes('money') || q.includes('treasury') || q.includes('tax')) return `Municipal treasury stands at $${Math.round(treasury).toLocaleString()} with a ${Math.round(taxRate * 100)}% tax rate.`;
    return `Mayor of ${selectedCity.name}, all primary metrics are operating in optimal thresholds. Recommendation: Sustain clean energy incentives.`;
  };

  // Format Sim Time
  const hInt = Math.floor(simTimeHours);
  const mInt = Math.floor((simTimeHours - hInt) * 60);
  const ampm = hInt < 12 ? 'AM' : 'PM';
  const dispH = hInt === 0 ? 12 : (hInt > 12 ? hInt - 12 : hInt);
  const formattedTime = `${dispH.toString().padStart(2, '0')}:${mInt.toString().padStart(2, '0')} ${ampm}`;

  return (
    <main className="app-container">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      {/* 3D Canvas */}
      <div className="canvas-wrapper">
        <Canvas shadows camera={{ position: [12, 11, 12], fov: 48 }}>
          <CityScene
            cityId={selectedCity.id}
            lat={selectedCity.lat}
            lng={selectedCity.lng}
            simTimeHours={simTimeHours}
            weather={weather}
            buildings={buildings}
            citizens={citizens}
            incidents={incidents}
            activeBuildType={activeBuildType}
            selectedEntity={selectedEntity}
            cameraMode={cameraMode}
            onSelectBuilding={(b) => setSelectedEntity({ ...b, category: 'building' })}
            onSelectCitizen={(c) => setSelectedEntity({ ...c, category: 'citizen' })}
            onSelectVehicle={(v) => setSelectedEntity({ ...v, category: 'vehicle' })}
            onPlaceBuilding={handlePlaceBuilding}
            onExitFPV={() => setCameraMode('orbit')}
          />
        </Canvas>
      </div>

      {/* HUD Bar */}
      <HUD
        currentCityName={selectedCity.name}
        currentCityTemp={currentCityTemp}
        simTimeFormatted={formattedTime}
        simTimeHours={simTimeHours}
        simSpeed={simSpeed}
        isPaused={isPaused}
        weather={weather}
        isMuted={isMuted}
        cameraMode={cameraMode}
        population={population}
        treasury={treasury}
        happiness={happiness}
        powerGridLoad={powerGridLoad}
        powerGridCap={powerGridCap}
        airQuality={airQuality}
        crimeRate={crimeRate}
        incidents={incidents}
        dialoguesCount={dialogues.length}
        onTogglePause={handleTogglePause}
        onSetSpeed={handleSetSpeed}
        onSetWeather={handleSetWeather}
        onSetTimeHours={handleSetTimeHours}
        onToggleMute={handleToggleMute}
        onToggleCameraMode={handleToggleCameraMode}
        onToggleFPV={handleToggleFPV}
        onOpenMayor={() => setIsMayorOpen(true)}
        onOpenBuild={() => setIsBuildOpen(true)}
        onOpenDisasters={() => setIsDisastersOpen(true)}
        onOpenCitizens={() => setIsRosterOpen(true)}
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
        onOpenSocial={() => setIsSocialOpen(true)}
        onOpenSaves={() => setIsSavesOpen(true)}
        onOpenMapSelector={() => setIsMapSelectorOpen(true)}
      />

      {/* Real-World City Map Selector Modal */}
      <CityMapSelectorModal
        isOpen={isMapSelectorOpen}
        onClose={() => setIsMapSelectorOpen(false)}
        selectedCityId={selectedCity.id}
        onSelectCity={handleSelectCityMap}
      />

      {/* Floating Inspector */}
      <CitizenInspector
        selectedEntity={selectedEntity}
        citizens={citizens}
        isRosterOpen={isRosterOpen}
        onClose={() => setSelectedEntity(null)}
        onSelectCitizen={(c) => setSelectedEntity({ ...c, category: 'citizen' })}
        onCloseRoster={() => setIsRosterOpen(false)}
      />

      {/* Mayor AI Modal */}
      <MayorModal
        isOpen={isMayorOpen}
        onClose={() => setIsMayorOpen(false)}
        policies={policies}
        advisorMessage={advisorMessage}
        treasury={treasury}
        taxRate={taxRate}
        onTogglePolicy={handleTogglePolicy}
        onQueryAdvisor={handleQueryAdvisor}
      />

      {/* Build Menu Drawer */}
      <BuildMenu
        isOpen={isBuildOpen}
        onClose={() => setIsBuildOpen(false)}
        activeBuildType={activeBuildType}
        treasury={treasury}
        onSelectBuildType={(type) => setActiveBuildType(type)}
        onCancelBuild={() => setActiveBuildType(null)}
      />

      {/* Disaster Management Menu */}
      <DisasterMenu
        isOpen={isDisastersOpen}
        onClose={() => setIsDisastersOpen(false)}
        incidents={incidents}
        onTriggerEvent={handleTriggerEvent}
      />

      {/* Analytics Dashboard */}
      <CityAnalyticsDashboard
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        population={population}
        treasury={treasury}
        happiness={happiness}
        powerGridLoad={powerGridLoad}
        powerGridCap={powerGridCap}
        airQuality={airQuality}
        crimeRate={crimeRate}
      />

      {/* Citizen Social Network */}
      <CitizenSocialNetwork
        isOpen={isSocialOpen}
        onClose={() => setIsSocialOpen(false)}
        dialogues={dialogues}
        citizens={citizens}
      />

      {/* SQLite Save/Load Modal */}
      <SaveLoadModal
        isOpen={isSavesOpen}
        onClose={() => setIsSavesOpen(false)}
        cityState={{
          population,
          treasury,
          happiness,
          powerGridLoad,
          weather,
          simTimeHours,
          buildings,
          citizens,
          policies
        }}
        onLoadState={(st) => {
          if (st.population) setPopulation(st.population);
          if (st.treasury) setTreasury(st.treasury);
          if (st.happiness) setHappiness(st.happiness);
          if (st.weather) setWeather(st.weather);
          if (st.sim_time_hours) setSimTimeHours(st.sim_time_hours);
          if (st.buildings) setBuildings(st.buildings);
          if (st.citizens) setCitizens(st.citizens);
          if (st.policies) setPolicies(st.policies);
        }}
        onNotify={addToast}
      />

      {/* Interactive Controls Hint */}
      {cameraMode !== 'fpv' && (
        <div className="controls-hint">
          <span>🖱️ <b>Left Click + Drag:</b> Orbit Camera · <b>Right Click:</b> Pan · <b>Scroll:</b> Zoom · <b>🚶 FPV Walk:</b> Walk around</span>
        </div>
      )}
    </main>
  );
}