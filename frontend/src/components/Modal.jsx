// Modal.jsx
import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <button onClick={onClose} className="text-black float-right">
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
