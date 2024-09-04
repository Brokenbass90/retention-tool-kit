import React, { useState } from 'react';
import './AddLocaleModal.css';

const AddLocaleModal = ({ onClose, onSave }) => {
  const [locale, setLocale] = useState('');
  const [keyName, setKeyName] = useState('');
  const [content, setContent] = useState('');

  const handleSave = () => {
    if (locale && keyName && content) {
      onSave({ locale, keyName, content });
      onClose();
    } else {
      alert('Заполните все поля');
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
        <div className='modal-inputds'>
            <input
            type="text"
            placeholder="Enter the locale (e.g. en)"
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
            />
            <input
            type="text"
            placeholder="Enter the name of the placeholder"
            value={keyName}
            onChange={(e) => setKeyName(e.target.value)}
            />
        </div>
        <textarea
          placeholder="Enter text in the format {{...}}"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="modal-buttons">
          <button className='modal-button mr10' onClick={handleSave}>Add</button>
          <button className='modal-button' onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default AddLocaleModal;
