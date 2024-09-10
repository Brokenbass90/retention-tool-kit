import React from 'react';
import './ConfirmDeleteModal.css';

const ConfirmDeleteModal = ({ onClose, onConfirm, message }) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-overlay_modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <p>{message}</p>
        <div className="modal-buttons">
          <button className='modal-button mr10' onClick={onConfirm}>Yes</button>
          <button className='modal-button' onClick={onClose}>No</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
