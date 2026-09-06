import React from 'react';

export function ToastContainer({ toasts = [], onDismiss }) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-card toast-${toast.type || 'info'}`}>
          <span className="toast-icon">
            {toast.type === 'success' ? '✅' : toast.type === 'alert' ? '🚨' : 'ℹ️'}
          </span>
          <div className="toast-message">{toast.message}</div>
          <button className="toast-close" onClick={() => onDismiss(toast.id)}>✕</button>
        </div>
      ))}
    </div>
  );
}
