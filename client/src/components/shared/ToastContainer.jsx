import React from 'react';
import useNotificationStore from '../../store/notificationStore';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

const iconMap = {
  success: <CheckCircle size={18} className="text-status-success" />,
  error: <AlertCircle size={18} className="text-status-danger" />,
  warning: <AlertTriangle size={18} className="text-status-warning" />,
  info: <Info size={18} className="text-brand-primary" />,
};

const bgMap = {
  success: 'border-status-success/30 bg-green-50',
  error: 'border-status-danger/30 bg-red-50',
  warning: 'border-status-warning/30 bg-amber-50',
  info: 'border-brand-primary/30 bg-blue-50',
};

const ToastContainer = () => {
  const { toasts, removeToast } = useNotificationStore();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg animate-in slide-in-from-right ${bgMap[toast.type] || bgMap.info}`}
        >
          {iconMap[toast.type] || iconMap.info}
          <p className="text-sm text-slate-800 flex-1">{toast.message}</p>
          <button onClick={() => removeToast(toast.id)} className="text-slate-400 hover:text-slate-600">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
