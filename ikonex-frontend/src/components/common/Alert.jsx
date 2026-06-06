import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

const Alert = ({ type = 'info', message, onClose }) => {
  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const icons = {
    success: <CheckCircle size={20} className="flex-shrink-0" />,
    error: <AlertCircle size={20} className="flex-shrink-0" />,
    warning: <AlertCircle size={20} className="flex-shrink-0" />,
    info: <Info size={20} className="flex-shrink-0" />,
  };

  return (
    <div className={`p-4 border rounded-lg flex items-start gap-3 ${styles[type]}`}>
      {icons[type]}
      <div className="flex-1">
        <p>{message}</p>
      </div>
      {onClose && (
        <button onClick={onClose} className="flex-shrink-0">
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default Alert;
