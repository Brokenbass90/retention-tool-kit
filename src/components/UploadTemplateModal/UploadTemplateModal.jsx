import React, { useState } from 'react';
import './UploadTemplateModal.css';

const UploadTemplateModal = ({ onClose, onSave }) => {
  const [templateName, setTemplateName] = useState('');
  const [templateContent, setTemplateContent] = useState('');

  const handleSave = () => {
    if (templateName && templateContent) {
      onSave({ name: templateName, content: templateContent });
      onClose();
    } else {
      alert('Please fill in all fields');
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <input
          type="text"
          placeholder="Enter the template name"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
        />
        <textarea
          placeholder="Enter the template HTML code"
          value={templateContent}
          onChange={(e) => setTemplateContent(e.target.value)}
        />
        <div className="modal-buttons">
          <button className="modal-button" onClick={handleSave}>Add</button>
          <button className="modal-button" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default UploadTemplateModal;
