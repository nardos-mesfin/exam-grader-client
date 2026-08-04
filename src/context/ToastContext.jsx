// src/context/ToastContext.jsx
import React, { createContext, useContext, useState } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success', duration = 4000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  };

  const hideToast = () => setToast(null);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toast && (
        <div
          className="fixed top-5 right-5 z-50 flex items-start gap-3 rounded-2xl p-4 shadow-2xl backdrop-blur-md max-w-md border text-sm font-bold transition-all animate-bounce-in"
          style={{
            backgroundColor:
              toast.type === 'error'
                ? 'rgba(220, 38, 38, 0.95)'
                : toast.type === 'warning'
                ? 'rgba(217, 119, 6, 0.95)'
                : 'rgba(22, 163, 74, 0.95)',
            color: '#ffffff',
            borderColor: 'rgba(255,255,255,0.2)',
          }}
        >
          <span className="material-symbols-outlined text-xl shrink-0">
            {toast.type === 'error'
              ? 'error'
              : toast.type === 'warning'
              ? 'warning'
              : 'check_circle'}
          </span>
          <div className="flex-1 whitespace-pre-line leading-relaxed">{toast.message}</div>
          <button onClick={hideToast} className="text-white/80 hover:text-white">
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);