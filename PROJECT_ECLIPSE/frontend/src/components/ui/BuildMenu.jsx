import React from 'react';
import { BuildingIcon, ZapIcon, ShieldIcon, PlusIcon } from './Icons';

const BUILD_CATALOG = [
  {
    type: 'residential',
    title: 'Apex Habitat Tower',
    category: 'Residential',
    cost: 15000,
    pop: '+120 Citizens',
    power: '2.4 MW',
    desc: 'High-density vertical living space with integrated aeroponic gardens.'
  },
  {
    type: 'commercial',
    title: 'OmniCorp Cyber Plaza',
    category: 'Commercial',
    cost: 25000,
    pop: '+$900 / tick',
    power: '4.8 MW',
    desc: 'Bustling commercial complex for tech enterprises, retail, and synthetic cafes.'
  },
  {
    type: 'industrial',
    title: 'Synth-Tech Fabricator',
    category: 'Industrial',
    cost: 20000,
    pop: '+$750 / tick',
    power: '5.8 MW',
    desc: 'Advanced robotic manufacturing hub boosting city economic output.'
  },
  {
    type: 'solar_plant',
    title: 'Sol-Grid Solar Array',
    category: 'Energy',
    cost: 30000,
    pop: '+30 MW Power',
    power: 'Zero Emission',
    desc: 'Photovoltaic array providing clean, renewable energy to surrounding sectors.'
  },
  {
    type: 'hospital',
    title: 'Metropolis Bio-Clinic',
    category: 'Healthcare',
    cost: 35000,
    pop: '+Health Index',
    power: '3.0 MW',
    desc: 'Equipped with cyber-surgery bays and emergency triage units.'
  },
  {
    type: 'police',
    title: 'Enforcement Precinct',
    category: 'Security',
    cost: 22000,
    pop: '-Crime Rate',
    power: '1.8 MW',
    desc: 'Automated dispatch station for cruisers and aerial surveillance drones.'
  },
  {
    type: 'park',
    title: 'Zenith Bio-Park',
    category: 'Ecology',
    cost: 8000,
    pop: '+Happiness & AQI',
    power: '0.1 MW',
    desc: 'Lush green sanctuary improving air quality and mental wellness.'
  }
];

export function BuildMenu({
  isOpen,
  onClose,
  activeBuildType,
  treasury = 250000,
  onSelectBuildType,
  onCancelBuild
}) {
  if (!isOpen && !activeBuildType) return null;

  return (
    <div className="build-menu-drawer">
      <div className="build-menu-header">
        <div className="build-title-row">
          <BuildingIcon size={18} color="#4ade80" />
          <b>CONSTRUCTION & ZONING</b>
        </div>
        <button className="btn-close-sm" onClick={onClose}>✕</button>
      </div>

      {activeBuildType ? (
        <div className="active-placement-banner">
          <span className="pulsing-dot" />
          <span><b>PLACING:</b> {activeBuildType.toUpperCase()} — Click any open grid tile in 3D to construct</span>
          <button className="btn-cancel-placement" onClick={onCancelBuild}>Cancel</button>
        </div>
      ) : (
        <div className="build-catalog-grid">
          {BUILD_CATALOG.map((item) => {
            const canAfford = treasury >= item.cost;
            return (
              <div 
                key={item.type} 
                className={`build-card ${canAfford ? '' : 'disabled'}`}
                onClick={() => {
                  if (canAfford) {
                    onSelectBuildType(item.type);
                    onClose();
                  }
                }}
              >
                <div className="build-card-top">
                  <span className="build-category-tag">{item.category}</span>
                  <span className="build-cost">${item.cost.toLocaleString()}</span>
                </div>
                <div className="build-card-title">{item.title}</div>
                <div className="build-card-desc">{item.desc}</div>
                <div className="build-card-footer">
                  <span className="tag-benefit">{item.pop}</span>
                  <span className="tag-power">{item.power}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
