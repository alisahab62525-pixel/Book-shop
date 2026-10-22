import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 left-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg shadow-lg text-xs sm:text-sm font-medium transition-all transform animate-in fade-in slide-in-from-bottom-2 ${
            toast.type === 'success'
              ? 'bg-[#1b3022] text-[#f4edd9] border border-[#2d4d38]'
              : toast.type === 'error'
              ? 'bg-rose-900 text-rose-100 border border-rose-800'
              : 'bg-slate-900 text-slate-100 border border-slate-800'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />}
          <span className="flex-1 leading-snug">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="opacity-70 hover:opacity-100 transition-opacity p-0.5"
            aria-label="Dismiss toast"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
