import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, title, children, onClose, actions }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {children}
        </div>

        {actions && (
          <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
