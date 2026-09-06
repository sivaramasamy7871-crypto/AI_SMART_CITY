import React, { useState } from 'react';
import { SparklesIcon, ShieldIcon, ZapIcon, UsersIcon } from './Icons';

export function MayorModal({
  isOpen,
  onClose,
  policies = {},
  advisorMessage = "",
  treasury = 250000,
  taxRate = 0.12,
  onTogglePolicy,
  onQueryAdvisor
}) {
  const [activeTab, setActiveTab] = useState('advisor');
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      role: 'assistant',
      text: `Greetings Mayor. ${advisorMessage || "All municipal sensor feeds are online. How can I assist with city strategy today?"}`
    }
  ]);
  const [isThinking, setIsThinking] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (customText) => {
    const textToSend = customText || query;
    if (!textToSend.trim()) return;

    setChatHistory((prev) => [...prev, { role: 'user', text: textToSend }]);
    setQuery('');
    setIsThinking(true);

    try {
      if (onQueryAdvisor) {
        const reply = await onQueryAdvisor(textToSend);
        setChatHistory((prev) => [...prev, { role: 'assistant', text: reply }]);
      } else {
        setTimeout(() => {
          setChatHistory((prev) => [
            ...prev,
            {
              role: 'assistant',
              text: `Neural telemetry analysis for "${textToSend}": All municipal metrics are stable. Recommended action: Expand commercial sectors and sustain green subsidies for +6% citizen satisfaction.`
            }
          ]);
        }, 400);
      }
    } catch (e) {
      setChatHistory((prev) => [
        ...prev,
        { role: 'assistant', text: "Telemetry link busy. Municipal systems are running on local autopilot." }
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card mayor-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="icon-badge">
              <SparklesIcon size={20} color="#38bdf8" />
            </div>
            <div>
              <h3>AI Mayor Advisor & Council</h3>
              <p>Municipal Intelligence Core & City Directives</p>
            </div>
          </div>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        {/* Tab Navigation */}
        <div className="modal-tabs">
          <button 
            className={`tab-btn ${activeTab === 'advisor' ? 'active' : ''}`}
            onClick={() => setActiveTab('advisor')}
          >
            🧠 AI Advisor Chat
          </button>
          <button 
            className={`tab-btn ${activeTab === 'policies' ? 'active' : ''}`}
            onClick={() => setActiveTab('policies')}
          >
            📜 Municipal Policies
          </button>
          <button 
            className={`tab-btn ${activeTab === 'finances' ? 'active' : ''}`}
            onClick={() => setActiveTab('finances')}
          >
            📊 Budget & Taxes
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {activeTab === 'advisor' && (
            <div className="advisor-chat-pane">
              {/* Quick Prompts */}
              <div className="quick-prompts">
                <button onClick={() => handleSend("Analyze current city health and bottleneck risks")}>
                  📈 City Health Diagnostic
                </button>
                <button onClick={() => handleSend("Evaluate power grid capacity and solar output")}>
                  ⚡ Energy Grid Status
                </button>
                <button onClick={() => handleSend("What is the traffic congestion level across sectors?")}>
                  🚦 Traffic Assessment
                </button>
                <button onClick={() => handleSend("How can we maximize treasury revenue?")}>
                  💰 Revenue Optimization
                </button>
              </div>

              {/* Chat Message Stream */}
              <div className="chat-stream">
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`chat-bubble ${msg.role}`}>
                    <div className="bubble-sender">{msg.role === 'assistant' ? '🏛️ AI MAYOR CORE' : '👤 MAYOR'}</div>
                    <div className="bubble-text">{msg.text}</div>
                  </div>
                ))}
                {isThinking && (
                  <div className="chat-bubble assistant thinking">
                    <div className="bubble-sender">🏛️ AI MAYOR CORE</div>
                    <div className="bubble-text">Synthesizing municipal telemetry...</div>
                  </div>
                )}
              </div>

              {/* Input Box */}
              <form className="chat-input-row" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
                <input 
                  type="text" 
                  placeholder="Ask the AI Advisor anything about city management..." 
                  value={query} 
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit" disabled={isThinking || !query.trim()}>Send</button>
              </form>
            </div>
          )}

          {activeTab === 'policies' && (
            <div className="policies-pane">
              <div className="policy-item">
                <div className="policy-info">
                  <div className="policy-title">🌱 Green Energy Subsidies</div>
                  <div className="policy-desc">Grants tax credits for solar plants and reduces air pollution index by 40%.</div>
                </div>
                <button 
                  className={`btn-toggle ${policies.green_subsidy ? 'enabled' : 'disabled'}`}
                  onClick={() => onTogglePolicy && onTogglePolicy('green_subsidy')}
                >
                  {policies.green_subsidy ? 'ACTIVE' : 'OFF'}
                </button>
              </div>

              <div className="policy-item">
                <div className="policy-info">
                  <div className="policy-title">🤖 AI Smart Grid & Traffic Balancing</div>
                  <div className="policy-desc">Optimizes intersection signals and dynamically redistributes power during peak hours.</div>
                </div>
                <button 
                  className={`btn-toggle ${policies.smart_grid_ai ? 'enabled' : 'disabled'}`}
                  onClick={() => onTogglePolicy && onTogglePolicy('smart_grid_ai')}
                >
                  {policies.smart_grid_ai ? 'ACTIVE' : 'OFF'}
                </button>
              </div>

              <div className="policy-item">
                <div className="policy-info">
                  <div className="policy-title">🛡️ Autonomous Drone Patrol Fleet</div>
                  <div className="policy-desc">Dispatches AI quadcopters to reduce crime rate by 60% across outer sectors.</div>
                </div>
                <button 
                  className={`btn-toggle ${policies.drone_patrols ? 'enabled' : 'disabled'}`}
                  onClick={() => onTogglePolicy && onTogglePolicy('drone_patrols')}
                >
                  {policies.drone_patrols ? 'ACTIVE' : 'OFF'}
                </button>
              </div>

              <div className="policy-item">
                <div className="policy-info">
                  <div className="policy-title">🚍 Universal Free Public Transit</div>
                  <div className="policy-desc">Zero fare for all buses and maglev lines. Citizen happiness +8%, minor treasury upkeep.</div>
                </div>
                <button 
                  className={`btn-toggle ${policies.free_transit ? 'enabled' : 'disabled'}`}
                  onClick={() => onTogglePolicy && onTogglePolicy('free_transit')}
                >
                  {policies.free_transit ? 'ACTIVE' : 'OFF'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'finances' && (
            <div className="finances-pane">
              <div className="finance-metric-grid">
                <div className="f-card">
                  <span>MUNICIPAL TREASURY</span>
                  <b>${Math.round(treasury).toLocaleString()}</b>
                </div>
                <div className="f-card">
                  <span>TAX RATE</span>
                  <b className="val-green">{Math.round(taxRate * 100)}%</b>
                </div>
                <div className="f-card">
                  <span>ESTIMATED INCOME / TICK</span>
                  <b className="val-green">+${Math.round(treasury * 0.004).toLocaleString()}</b>
                </div>
                <div className="f-card">
                  <span>MUNICIPAL CREDIT RATING</span>
                  <b>AAA (Prime)</b>
                </div>
              </div>
              <p className="finance-note">
                💡 <b>Mayor Tip:</b> Keeping tax rates between 10% and 14% maintains high commercial growth without triggering citizen discontent.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
