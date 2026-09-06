import React, { useState, useEffect } from 'react';

export function SaveLoadModal({
  isOpen,
  onClose,
  cityState,
  onLoadState,
  onNotify
}) {
  const [saveName, setSaveName] = useState('');
  const [savesList, setSavesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSaves = () => {
    fetch('http://localhost:8000/api/saves/')
      .then(res => res.json())
      .then(data => {
        if (data.saves) setSavesList(data.saves);
      })
      .catch(() => {
        // Local storage fallback
        try {
          const local = JSON.parse(localStorage.getItem('eclipse_saves') || '[]');
          setSavesList(local);
        } catch (e) {}
      });
  };

  useEffect(() => {
    if (isOpen) fetchSaves();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    const name = saveName.trim() || `Metropolis Save ${new Date().toLocaleTimeString()}`;
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:8000/api/saves/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      if (res.ok) {
        onNotify && onNotify(`City snapshot "${name}" saved to SQLite database!`, 'success');
        setSaveName('');
        fetchSaves();
      }
    } catch (err) {
      // Local storage fallback
      const newSave = {
        id: `local_save_${Date.now()}`,
        name,
        created_at: new Date().toLocaleString(),
        population: cityState.population,
        treasury: cityState.treasury,
        happiness: cityState.happiness,
        fullState: cityState
      };
      const existing = JSON.parse(localStorage.getItem('eclipse_saves') || '[]');
      const updated = [newSave, ...existing];
      localStorage.setItem('eclipse_saves', JSON.stringify(updated));
      setSavesList(updated);
      onNotify && onNotify(`City snapshot "${name}" saved locally!`, 'success');
      setSaveName('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoad = async (save) => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/saves/load/${save.id}`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        onLoadState && onLoadState(data.state);
        onNotify && onNotify(`Loaded snapshot "${save.name}"!`, 'success');
        onClose();
        return;
      }
    } catch (e) {}

    // Fallback to local
    if (save.fullState) {
      onLoadState && onLoadState(save.fullState);
      onNotify && onNotify(`Loaded local snapshot "${save.name}"!`, 'success');
      onClose();
    }
    setIsLoading(false);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card save-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="icon-badge">
              💾
            </div>
            <div>
              <h3>City Snapshot & Database Persistence</h3>
              <p>Save and restore municipal simulation states to SQLite database</p>
            </div>
          </div>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* Save Input Form */}
          <form className="save-form" onSubmit={handleSave}>
            <input 
              type="text" 
              placeholder="Enter snapshot name (e.g. Neo-City Peak Boom)..." 
              value={saveName} 
              onChange={(e) => setSaveName(e.target.value)}
            />
            <button type="submit" disabled={isLoading} className="btn-save-submit">
              💾 Save Snapshot
            </button>
          </form>

          {/* Saved Snapshots List */}
          <div className="section-title" style={{ marginTop: '20px' }}>
            📁 STORED SNAPSHOTS ({savesList.length})
          </div>

          {savesList.length === 0 ? (
            <div className="empty-saves">
              <span>No snapshots recorded yet. Enter a name above to create your first save.</span>
            </div>
          ) : (
            <div className="saves-list">
              {savesList.map((s) => (
                <div key={s.id} className="save-item-card">
                  <div>
                    <div className="save-name">{s.name}</div>
                    <div className="save-meta">
                      <span>👥 {s.population ? s.population.toLocaleString() : 1850} citizens</span> · 
                      <span className="val-green">💰 ${s.treasury ? Math.round(s.treasury).toLocaleString() : '250,000'}</span> · 
                      <span>Recorded: {s.created_at}</span>
                    </div>
                  </div>
                  <button className="btn-load-save" onClick={() => handleLoad(s)}>
                    Load ▶
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
