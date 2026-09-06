import React, { useState } from 'react';
import { REAL_CITIES } from '../../data/realCityMaps';
import { getUserLiveLocation } from '../../services/liveGeolocationService';

export function CityMapSelectorModal({
  isOpen,
  onClose,
  selectedCityId = 'eclipse',
  onSelectCity,
  onSelectLiveGPS
}) {
  const [isLocating, setIsLocating] = useState(false);
  const [gpsError, setGpsError] = useState(null);

  if (!isOpen) return null;

  const handleDetectGPS = async () => {
    setIsLocating(true);
    setGpsError(null);
    try {
      const live = await getUserLiveLocation();
      const customCity = {
        id: 'user_live_gps',
        name: `${live.cityName} (Live GPS)`,
        country: `${live.country} 📍`,
        lat: live.lat,
        lng: live.lng,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'auto',
        description: `Your exact live geographic location (${live.lat.toFixed(4)}°N, ${live.lng.toFixed(4)}°E) with real OpenStreetMap street grid and live weather synchronization.`,
        waterSide: 'none',
        landmarkType: 'gps_beacon',
        ambientTemp: 'Live',
        buildings: null
      };
      onSelectCity(customCity);
      onClose();
    } catch (err) {
      setGpsError("Could not access browser GPS. Please allow location permissions in your browser bar.");
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card map-selector-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="icon-badge">
              🌍
            </div>
            <div>
              <h3>Real-World Map Locations & Live GPS</h3>
              <p>Stream real OpenStreetMap street tiles, live weather, and satellite coordinates</p>
            </div>
          </div>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* Prominent Live GPS Button */}
          <div className="live-gps-hero-card">
            <div>
              <div className="live-gps-title">📍 DETECT MY CURRENT LIVE LOCATION</div>
              <p className="live-gps-desc">
                Automatically load your exact home city / neighborhood map with real GPS coordinates, local OpenStreetMap tiles, and live temperature!
              </p>
            </div>
            <button 
              className="btn-detect-gps" 
              onClick={handleDetectGPS} 
              disabled={isLocating}
            >
              {isLocating ? "📡 Detecting GPS..." : "📍 USE MY LIVE LOCATION"}
            </button>
          </div>

          {gpsError && <div className="gps-error-banner">⚠️ {gpsError}</div>}

          <div className="section-title" style={{ marginTop: '16px' }}>
            🏙️ GLOBAL CITY MAP PRESETS
          </div>

          <div className="city-maps-grid">
            {REAL_CITIES.map((city) => {
              const isSelected = selectedCityId === city.id;
              return (
                <div 
                  key={city.id} 
                  className={`city-map-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    onSelectCity(city);
                    onClose();
                  }}
                >
                  <div className="city-card-header">
                    <div className="city-name-box">
                      <div className="city-title">{city.name}</div>
                      <div className="city-country">{city.country}</div>
                    </div>
                    <span className="city-gps">
                      📍 {city.lat.toFixed(2)}°N, {city.lng.toFixed(2)}°E
                    </span>
                  </div>

                  <p className="city-desc">{city.description}</p>

                  <div className="city-card-footer">
                    <span className="tag-temp">🌡️ {city.ambientTemp}</span>
                    <span className="tag-tz">🕒 {city.timezone}</span>
                    <button className="btn-load-city">
                      {isSelected ? '✓ ACTIVE' : 'LOAD MAP ▶'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
