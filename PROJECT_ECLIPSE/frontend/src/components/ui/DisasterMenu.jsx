import React from 'react';
import { AlertIcon, ShieldIcon, ZapIcon, SparklesIcon } from './Icons';

export function DisasterMenu({
  isOpen,
  onClose,
  incidents = [],
  onTriggerEvent,
  onResolveAll
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card disaster-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="icon-badge badge-alert">
              <AlertIcon size={20} color="#ef4444" />
            </div>
            <div>
              <h3>Emergency Dispatch & Incidents</h3>
              <p>Trigger and manage city emergencies and public events</p>
            </div>
          </div>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* Active Incidents Section */}
          <div className="section-title">🚨 LIVE ACTIVE INCIDENTS ({incidents.length})</div>
          {incidents.length === 0 ? (
            <div className="empty-incidents">
              <span className="dot-green" /> All sectors nominal. No active municipal emergencies.
            </div>
          ) : (
            <div className="incidents-list">
              {incidents.map((inc) => (
                <div key={inc.id} className={`incident-row ${inc.severity}`}>
                  <div>
                    <div className="inc-title">{inc.title}</div>
                    <div className="inc-meta">
                      <span>Severity: <b>{inc.severity.toUpperCase()}</b></span> · 
                      <span>Duration: <b>{inc.duration_ticks}s remaining</b></span>
                    </div>
                  </div>
                  <span className="inc-badge">DISPATCHED</span>
                </div>
              ))}
            </div>
          )}

          {/* Trigger Emergency Simulators */}
          <div className="section-title" style={{ marginTop: '20px' }}>⚡ SIMULATE MUNICIPAL EVENTS</div>
          <div className="event-trigger-grid">
            <button className="btn-event btn-fire" onClick={() => onTriggerEvent('fire')}>
              <span className="event-icon">🔥</span>
              <div>
                <b>Structural Fire</b>
                <p>Ignites random skyscraper, dispatches Fire Engine with sirens</p>
              </div>
            </button>

            <button className="btn-event btn-blackout" onClick={() => onTriggerEvent('blackout')}>
              <span className="event-icon">⚡</span>
              <div>
                <b>Substation Blackout</b>
                <p>Grid failure shuts off building lights and elevators</p>
              </div>
            </button>

            <button className="btn-event btn-cyber" onClick={() => onTriggerEvent('cyber_attack')}>
              <span className="event-icon">🛡️</span>
              <div>
                <b>Cyber Infiltration</b>
                <p>Attacks municipal network, triggers emergency firewall</p>
              </div>
            </button>

            <button className="btn-event btn-festival" onClick={() => onTriggerEvent('festival')}>
              <span className="event-icon">🎉</span>
              <div>
                <b>Cyber Lights Festival</b>
                <p>Organizes downtown cultural rave, surges citizen happiness</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
