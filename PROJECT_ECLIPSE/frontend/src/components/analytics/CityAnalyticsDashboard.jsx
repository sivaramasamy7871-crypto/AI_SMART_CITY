import React, { useState, useEffect } from 'react';

// Lightweight interactive SVG Sparkline Chart
function SparklineChart({ data = [], color = '#38bdf8', height = 90, unit = '' }) {
  if (data.length === 0) return <div className="no-data">No data</div>;

  const min = Math.min(...data);
  const max = Math.max(...data) || 1;
  const range = max - min || 1;
  const width = 360;

  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 20) - 10;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="sparkline-wrapper">
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        {/* Area fill */}
        <polygon 
          points={`0,${height} ${points} ${width},${height}`} 
          fill={`url(#grad-${color.replace('#', '')})`} 
        />
        {/* Line */}
        <polyline 
          points={points} 
          fill="none" 
          stroke={color} 
          strokeWidth="2.5" 
          strokeLinecap="round" 
        />
      </svg>
      <div className="chart-min-max">
        <span>Min: {Math.round(min).toLocaleString()}{unit}</span>
        <span style={{ color }}>Latest: {Math.round(data[data.length - 1]).toLocaleString()}{unit}</span>
        <span>Max: {Math.round(max).toLocaleString()}{unit}</span>
      </div>
    </div>
  );
}

export function CityAnalyticsDashboard({
  isOpen,
  onClose,
  population = 1850,
  treasury = 250000,
  happiness = 88,
  powerGridLoad = 58,
  powerGridCap = 120,
  airQuality = 24,
  crimeRate = 5
}) {
  const [historyData, setHistoryData] = useState({
    popHistory: [1400, 1480, 1530, 1610, 1690, 1750, 1810, 1850],
    treasuryHistory: [180000, 195000, 210000, 225000, 238000, 246000, 250000],
    powerHistory: [42, 48, 55, 62, 59, 64, 58],
    happinessHistory: [78, 82, 85, 87, 89, 90, 88],
    aqiHistory: [45, 38, 34, 30, 28, 26, 24]
  });

  useEffect(() => {
    if (!isOpen) return;
    // Attempt fetching historical analytics from backend SQLite
    fetch('http://localhost:8000/api/analytics/history?limit=30')
      .then(res => res.json())
      .then(data => {
        if (data.history && data.history.length > 0) {
          setHistoryData({
            popHistory: data.history.map(h => h.population),
            treasuryHistory: data.history.map(h => h.treasury),
            powerHistory: data.history.map(h => h.power_load),
            happinessHistory: data.history.map(h => h.happiness),
            aqiHistory: data.history.map(h => h.air_quality)
          });
        }
      })
      .catch(() => {});
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card analytics-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="icon-badge">
              📊
            </div>
            <div>
              <h3>Municipal Analytics & Data Telemetry</h3>
              <p>Real-time macroeconomic KPIs, demographic trends, and resource curves</p>
            </div>
          </div>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body analytics-body">
          {/* Top KPI Cards */}
          <div className="analytics-kpi-grid">
            <div className="kpi-box">
              <span className="kpi-label">POPULATION GROWTH</span>
              <div className="kpi-val">{population.toLocaleString()}</div>
              <span className="kpi-sub val-green">↑ +8.4% this quarter</span>
            </div>
            <div className="kpi-box">
              <span className="kpi-label">CITY GDP / TREASURY</span>
              <div className="kpi-val val-green">${Math.round(treasury).toLocaleString()}</div>
              <span className="kpi-sub val-green">↑ Budget Surplus</span>
            </div>
            <div className="kpi-box">
              <span className="kpi-label">CLEAN ENERGY RATIO</span>
              <div className="kpi-val">{Math.round((powerGridLoad / Math.max(1, powerGridCap)) * 100)}%</div>
              <span className="kpi-sub val-green">Peak Solar Grid</span>
            </div>
            <div className="kpi-box">
              <span className="kpi-label">PUBLIC SATISFACTION</span>
              <div className="kpi-val">{happiness}%</div>
              <span className="kpi-sub val-green">High Wellbeing</span>
            </div>
          </div>

          {/* SVG Sparkline Charts Grid */}
          <div className="charts-grid">
            <div className="chart-card">
              <div className="chart-header">
                <b>👥 Population Demographic Growth</b>
                <span>30-Day Trend</span>
              </div>
              <SparklineChart data={historyData.popHistory} color="#38bdf8" />
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <b>💰 Municipal Revenue & Treasury ($)</b>
                <span>Cashflow Surplus</span>
              </div>
              <SparklineChart data={historyData.treasuryHistory} color="#4ade80" unit="$" />
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <b>⚡ Power Grid Consumption (MW)</b>
                <span>Load vs Capacity</span>
              </div>
              <SparklineChart data={historyData.powerHistory} color="#fbbf24" unit=" MW" />
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <b>🌱 Air Quality Index (Lower is cleaner)</b>
                <span>Vertical Bio-Parks Impact</span>
              </div>
              <SparklineChart data={historyData.aqiHistory} color="#34d399" unit=" AQI" />
            </div>
          </div>

          {/* District Economic Summary Table */}
          <div className="district-table-wrapper">
            <div className="section-title">🏙️ DISTRICT ECONOMIC BREAKDOWN</div>
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Sector District</th>
                  <th>Primary Zone</th>
                  <th>Residents</th>
                  <th>Power Draw</th>
                  <th>Tax Yield / Tick</th>
                  <th>Safety Rating</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><b>Downtown Core</b></td>
                  <td>Commercial & Civic</td>
                  <td>680</td>
                  <td>28.4 MW</td>
                  <td className="val-green">+$1,450</td>
                  <td><span className="badge-safe">98% Prime</span></td>
                </tr>
                <tr>
                  <td><b>Cyber Tech Hub</b></td>
                  <td>High-Tech R&D</td>
                  <td>520</td>
                  <td>22.1 MW</td>
                  <td className="val-green">+$1,120</td>
                  <td><span className="badge-safe">96% Prime</span></td>
                </tr>
                <tr>
                  <td><b>Bio-Green Enclave</b></td>
                  <td>Eco-Residential</td>
                  <td>410</td>
                  <td>6.2 MW</td>
                  <td className="val-green">+$680</td>
                  <td><span className="badge-safe">99% Prime</span></td>
                </tr>
                <tr>
                  <td><b>Neo-Harbor Docks</b></td>
                  <td>Industrial & Logistics</td>
                  <td>240</td>
                  <td>14.8 MW</td>
                  <td className="val-green">+$890</td>
                  <td><span className="badge-safe">94% Nominal</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
