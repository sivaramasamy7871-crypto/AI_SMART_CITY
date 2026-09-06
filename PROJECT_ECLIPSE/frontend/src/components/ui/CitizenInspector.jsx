import React, { useState } from 'react';
import { UsersIcon, BuildingIcon, ZapIcon, ShieldIcon } from './Icons';

export function CitizenInspector({
  selectedEntity, // null, or { type: 'citizen' | 'building' | 'vehicle', ... }
  citizens = [],
  isRosterOpen = false,
  onClose,
  onSelectCitizen,
  onCloseRoster
}) {
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Full Roster Modal
  if (isRosterOpen) {
    const filtered = citizens.filter(
      (c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.job.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="modal-backdrop" onClick={onCloseRoster}>
        <div className="modal-card roster-card" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <div className="modal-title-group">
              <div className="icon-badge">
                <UsersIcon size={20} color="#a855f7" />
              </div>
              <div>
                <h3>AI Citizen Registry ({citizens.length} Agents)</h3>
                <p>Autonomous personas, daily schedules, and real-time thoughts</p>
              </div>
            </div>
            <button className="btn-close" onClick={onCloseRoster}>✕</button>
          </div>

          <div className="roster-search-bar">
            <input
              type="text"
              placeholder="Search citizens by name or occupation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="roster-grid">
            {filtered.map((c) => (
              <div
                key={c.id}
                className="citizen-roster-card"
                onClick={() => {
                  onSelectCitizen(c);
                  onCloseRoster();
                }}
              >
                <div className="c-card-top">
                  <div className="c-avatar">{c.name.charAt(0)}</div>
                  <div>
                    <div className="c-name">{c.name}</div>
                    <div className="c-job">{c.job}</div>
                  </div>
                  <span className="c-mood-tag">{c.mood}</span>
                </div>
                <div className="c-thought">"{c.thought}"</div>
                <div className="c-footer">
                  <span>Happiness: <b>{c.happiness}%</b></span>
                  <span>Salary: <b>${c.salary ? c.salary.toLocaleString() : '85,000'}/yr</b></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 2. Floating Inspector Card (for selected building or citizen)
  if (!selectedEntity) return null;

  const isCitizen = Boolean(selectedEntity.job || selectedEntity.thought);

  return (
    <div className="inspector-floating-card">
      <div className="inspector-header">
        <span className="inspector-badge">
          {isCitizen ? '👤 CITIZEN TELEMETRY' : '🏢 STRUCTURE TELEMETRY'}
        </span>
        <button className="btn-close-sm" onClick={onClose}>✕</button>
      </div>

      {isCitizen ? (
        <div className="inspector-content">
          <div className="inspector-main-title">{selectedEntity.name}</div>
          <div className="inspector-subtitle">{selectedEntity.job}</div>

          <div className="inspector-thought-box">
            <b>Live Thought:</b>
            <p>"{selectedEntity.thought || 'Navigating through the city grid.'}"</p>
          </div>

          <div className="inspector-stats-grid">
            <div>
              <span>MOOD</span>
              <b>{selectedEntity.mood || 'Content'}</b>
            </div>
            <div>
              <span>HAPPINESS</span>
              <b className="val-green">{selectedEntity.happiness || 90}%</b>
            </div>
            <div>
              <span>COORDINATES</span>
              <b>[{selectedEntity.current_pos ? selectedEntity.current_pos.join(', ') : '0, 0'}]</b>
            </div>
            <div>
              <span>STATUS</span>
              <b className="val-green">Active Simulation</b>
            </div>
          </div>
        </div>
      ) : (
        <div className="inspector-content">
          <div className="inspector-main-title">{selectedEntity.name || 'City Structure'}</div>
          <div className="inspector-subtitle">{selectedEntity.type ? selectedEntity.type.toUpperCase() : 'ZONED PROPERTY'}</div>

          <div className="inspector-stats-grid">
            <div>
              <span>FLOORS</span>
              <b>{selectedEntity.floors || 8} Levels</b>
            </div>
            <div>
              <span>HEIGHT</span>
              <b>{selectedEntity.height ? `${selectedEntity.height * 10}m` : '32m'}</b>
            </div>
            <div>
              <span>STATUS</span>
              <b className={selectedEntity.hazard ? 'val-alert' : 'val-green'}>
                {selectedEntity.hazard ? selectedEntity.hazard.toUpperCase() : 'Operational'}
              </b>
            </div>
            <div>
              <span>SECTOR</span>
              <b>Grid ({selectedEntity.world_x ? Math.round(selectedEntity.world_x) : 0}, {selectedEntity.world_z ? Math.round(selectedEntity.world_z) : 0})</b>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
