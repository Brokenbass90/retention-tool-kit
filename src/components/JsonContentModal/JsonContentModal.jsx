// JsonContentModal.jsx
import React from 'react';

const JsonContentModal = ({ isVisible, onClose, content }) => {
  if (!isVisible) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <pre>{JSON.stringify(content, null, 2)}</pre>
      </div>
    </div>
  );
};

export default JsonContentModal;
