// Modal.jsx
import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="rounded shadow-lg w-full max-w-md bg-gray-800 px-2">
        <button onClick={onClose} className="text-white float-right">
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
