import React, { useState, useEffect } from 'react';

export function CitizenSocialNetwork({
  isOpen,
  onClose,
  dialogues = [],
  citizens = []
}) {
  const [activeDialogues, setActiveDialogues] = useState(dialogues);

  useEffect(() => {
    if (dialogues && dialogues.length > 0) {
      setActiveDialogues(dialogues);
    }
  }, [dialogues]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card social-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="icon-badge">
              💬
            </div>
            <div>
              <h3>AI Citizen Social Feed & Dialogues</h3>
              <p>Autonomous multi-agent social interactions and street-level chatter</p>
            </div>
          </div>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="section-title">📡 LIVE CHATTER INTERCEPT ({activeDialogues.length} Conversations)</div>

          {activeDialogues.length === 0 ? (
            <div className="empty-dialogues">
              <span>Citizens are currently commuting. Live conversational chatter will stream here.</span>
            </div>
          ) : (
            <div className="dialogue-feed">
              {activeDialogues.map((dlg) => (
                <div key={dlg.id} className="dialogue-card">
                  <div className="dlg-meta">
                    <span className="dlg-time">🕒 {dlg.timestamp}</span>
                    <span className="dlg-tag">Encrypted Radio Feed</span>
                  </div>
                  
                  {/* Speaker 1 */}
                  <div className="dlg-turn speaker-1">
                    <div className="dlg-avatar">{dlg.speaker_1.charAt(0)}</div>
                    <div>
                      <span className="dlg-name">{dlg.speaker_1}</span>
                      <p className="dlg-line">"{dlg.line_1}"</p>
                    </div>
                  </div>

                  {/* Speaker 2 */}
                  <div className="dlg-turn speaker-2">
                    <div className="dlg-avatar avatar-2">{dlg.speaker_2.charAt(0)}</div>
                    <div>
                      <span className="dlg-name">{dlg.speaker_2}</span>
                      <p className="dlg-line">"{dlg.line_2}"</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
