import React from 'react';
import { 
  SunIcon, MoonIcon, RainIcon, ZapIcon, CloudIcon, 
  VolumeIcon, CameraIcon, ShieldIcon, BuildingIcon, UsersIcon, SparklesIcon, PlusIcon, AlertIcon 
} from './Icons';

export function HUD({
  currentCityName = "Chennai (Marina Coast)",
  currentCityTemp = "32°C",
  simTimeFormatted = "14:30 PM",
  simTimeHours = 14.5,
  simSpeed = 1.0,
  isPaused = false,
  weather = 'clear',
  isMuted = true,
  cameraMode = 'orbit',
  population = 1850,
  treasury = 250000,
  happiness = 88,
  powerGridLoad = 58,
  powerGridCap = 120,
  airQuality = 24,
  crimeRate = 5,
  incidents = [],
  dialoguesCount = 0,
  onTogglePause,
  onSetSpeed,
  onSetWeather,
  onSetTimeHours,
  onToggleMute,
  onToggleCameraMode,
  onToggleFPV,
  onOpenMayor,
  onOpenBuild,
  onOpenDisasters,
  onOpenCitizens,
  onOpenAnalytics,
  onOpenSocial,
  onOpenSaves,
  onOpenMapSelector
}) {
  const isNight = simTimeHours < 6.0 || simTimeHours > 18.5;
  const activeFireCount = incidents.filter(i => i.type === 'fire').length;
  const powerPercent = Math.min(100, Math.round((powerGridLoad / Math.max(1, powerGridCap)) * 100));

  return (
    <header className="hud-container">
      {/* Top Header Bar */}
      <div className="top-bar">
        {/* Brand & City Map Selector */}
        <div className="brand-group">
          <div className="brand-title">
            <span className="brand-dot" />
            PROJECT NEXUS
          </div>
          
          {/* Real Map Location Pill */}
          <button className="city-pill-btn" onClick={onOpenMapSelector} title="Click to Switch Real-World City Map">
            <span className="globe-icon">🌍</span>
            <span className="city-pill-name">{currentCityName}</span>
            <span className="city-pill-temp">{currentCityTemp}</span>
          </button>
        </div>

        {/* Center Time & Weather Controls */}
        <div className="controls-group">
          <div className="clock-pill">
            {isNight ? <MoonIcon size={14} color="#93c5fd" /> : <SunIcon size={14} color="#fde047" />}
            <span className="time-text">{simTimeFormatted}</span>
          </div>

          <div className="time-slider-wrapper">
            <input 
              type="range" 
              min="0" 
              max="24" 
              step="0.5" 
              value={simTimeHours} 
              onChange={(e) => onSetTimeHours && onSetTimeHours(parseFloat(e.target.value))}
              className="time-slider"
              title="Drag to adjust Time of Day"
            />
          </div>

          <div className="speed-buttons">
            <button 
              className={`btn-icon ${isPaused ? 'active-warn' : ''}`} 
              onClick={onTogglePause}
              title={isPaused ? "Resume Simulation" : "Pause Simulation"}
            >
              {isPaused ? "▶" : "Ⅱ"}
            </button>
            {[1, 2, 5].map((spd) => (
              <button
                key={spd}
                className={`btn-speed ${!isPaused && simSpeed === spd ? 'active' : ''}`}
                onClick={() => onSetSpeed && onSetSpeed(spd)}
              >
                {spd}x
              </button>
            ))}
          </div>

          <div className="weather-buttons">
            <button
              className={`btn-icon ${weather === 'clear' ? 'active' : ''}`}
              onClick={() => onSetWeather && onSetWeather('clear')}
              title="Clear Sky"
            >
              <SunIcon size={14} />
            </button>
            <button
              className={`btn-icon ${weather === 'rain' ? 'active' : ''}`}
              onClick={() => onSetWeather && onSetWeather('rain')}
              title="Rainy Weather"
            >
              <RainIcon size={14} />
            </button>
            <button
              className={`btn-icon ${weather === 'storm' ? 'active-alert' : ''}`}
              onClick={() => onSetWeather && onSetWeather('storm')}
              title="Thunderstorm"
            >
              <ZapIcon size={14} />
            </button>
            <button
              className={`btn-icon ${weather === 'fog' ? 'active' : ''}`}
              onClick={() => onSetWeather && onSetWeather('fog')}
              title="Atmospheric Fog"
            >
              <CloudIcon size={14} />
            </button>
          </div>
        </div>

        {/* Right Tools & Modals */}
        <div className="tools-group">
          <button 
            className={`btn-icon ${!isMuted ? 'active-neon' : ''}`} 
            onClick={onToggleMute}
            title={isMuted ? "Unmute City Soundscape (Web Audio)" : "Mute Sound"}
          >
            <VolumeIcon size={15} muted={isMuted} />
          </button>
          <button 
            className={`btn-icon ${cameraMode === 'topdown' ? 'active' : ''}`} 
            onClick={onToggleCameraMode}
            title="Toggle 2D Tactical / 3D Orbit Camera"
          >
            <CameraIcon size={15} />
          </button>
          <button 
            className={`btn-action btn-fpv ${cameraMode === 'fpv' ? 'active-neon' : ''}`} 
            onClick={onToggleFPV}
            title="Switch into WASD Street Walking Mode"
          >
            <span>🚶 {cameraMode === 'fpv' ? 'Exit FPV' : 'FPV Walk'}</span>
          </button>

          <button className="btn-action btn-analytics" onClick={onOpenAnalytics}>
            <span>📊 Analytics</span>
          </button>
          <button className="btn-action btn-social" onClick={onOpenSocial}>
            <span>💬 Feed {dialoguesCount > 0 ? `(${dialoguesCount})` : ''}</span>
          </button>
          <button className="btn-action btn-mayor" onClick={onOpenMayor}>
            <SparklesIcon size={13} color="#38bdf8" />
            <span>Mayor</span>
          </button>
          <button className="btn-action btn-build" onClick={onOpenBuild}>
            <PlusIcon size={13} color="#4ade80" />
            <span>Build</span>
          </button>
          <button className={`btn-action btn-disaster ${activeFireCount > 0 ? 'pulse-alert' : ''}`} onClick={onOpenDisasters}>
            <AlertIcon size={13} color={activeFireCount > 0 ? "#ef4444" : "#f59e0b"} />
            <span>Events</span>
          </button>
          <button className="btn-action btn-citizens" onClick={onOpenCitizens}>
            <UsersIcon size={13} color="#a855f7" />
            <span>Citizens</span>
          </button>
          <button className="btn-action btn-save" onClick={onOpenSaves} title="Save/Load SQLite Snapshots">
            <span>💾 Saves</span>
          </button>
        </div>
      </div>

      {/* FPV Mode Active Overlay */}
      {cameraMode === 'fpv' && (
        <div className="fpv-overlay-banner">
          <span>🎮 <b>FPV WALKING MODE:</b> Use <b>W, A, S, D</b> or Arrow Keys to walk through the streets · Press <b>ESC</b> or click "Exit FPV" to return</span>
        </div>
      )}

      {/* Emergency Active Alert Banner */}
      {incidents.length > 0 && cameraMode !== 'fpv' && (
        <div className="incident-alert-banner">
          <AlertIcon size={16} color="#f87171" />
          <span><b>EMERGENCY ACTIVE:</b> {incidents[0].title} — Emergency responders dispatched!</span>
        </div>
      )}

      {/* Bottom Telemetry Bar */}
      <footer className="telemetry-bar">
        <div className="telemetry-card">
          <span className="telemetry-label">POPULATION</span>
          <div className="telemetry-val">
            <UsersIcon size={15} color="#60a5fa" />
            <b>{population.toLocaleString()}</b>
          </div>
        </div>

        <div className="telemetry-card">
          <span className="telemetry-label">CITY TREASURY</span>
          <div className="telemetry-val">
            <span className="currency-sign">$</span>
            <b className="val-green">{Math.round(treasury).toLocaleString()}</b>
          </div>
        </div>

        <div className="telemetry-card">
          <span className="telemetry-label">HAPPINESS</span>
          <div className="telemetry-val">
            <span className="emoji-icon">{happiness >= 80 ? '😊' : happiness >= 60 ? '😐' : '⚠️'}</span>
            <b className={happiness >= 80 ? 'val-green' : 'val-warn'}>{happiness}%</b>
          </div>
        </div>

        <div className="telemetry-card">
          <span className="telemetry-label">POWER GRID LOAD</span>
          <div className="telemetry-val">
            <ZapIcon size={15} color="#fbbf24" />
            <b>{powerGridLoad} / {powerGridCap} MW</b>
            <span className="sub-badge">{powerPercent}%</span>
          </div>
        </div>

        <div className="telemetry-card">
          <span className="telemetry-label">AIR QUALITY (AQI)</span>
          <div className="telemetry-val">
            <span className={`status-dot ${airQuality <= 50 ? 'dot-green' : 'dot-warn'}`} />
            <b>{airQuality} AQI</b>
          </div>
        </div>

        <div className="telemetry-card">
          <span className="telemetry-label">SAFETY RATING</span>
          <div className="telemetry-val">
            <ShieldIcon size={15} color="#34d399" />
            <b className="val-green">{100 - crimeRate}%</b>
          </div>
        </div>
      </footer>
    </header>
  );
}
