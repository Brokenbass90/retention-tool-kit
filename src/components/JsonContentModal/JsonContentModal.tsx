import React from 'react';
import { JsonContentModalProps } from '../../types';
import './JsonContentModal.css';

const JsonContentModal: React.FC<JsonContentModalProps> = ({ isVisible, onClose, content }) => {
  if (!isVisible) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <pre>{JSON.stringify(content, null, 2)}</pre>
      </div>
    </div>
  );
};

export default JsonContentModal;
