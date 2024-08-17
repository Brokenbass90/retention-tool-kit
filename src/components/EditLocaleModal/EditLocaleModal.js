import React, { useState, useEffect } from 'react';
import './EditLocaleModal.css';
import { appStore } from '../../stores/AppStore'; // добавляем импорт appStore

const EditLocaleModal = ({ onClose, onSave, locale }) => {
  const [keyName, setKeyName] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (locale) {
      const data = appStore.getLocaleData(locale); // Получаем данные локали
      setKeyName(data.keyName || '');
      setContent(data.content || '');
    }
  }, [locale]);

  const handleSave = () => {
    if (keyName && content) {
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
        <input
          type="text"
          placeholder="Введите имя ключа"
          value={keyName}
          onChange={(e) => setKeyName(e.target.value)}
        />
        <textarea
          placeholder="Введите текст в формате {{...}}"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="modal-buttons">
          <button className='modal-button mr10' onClick={handleSave}>Save</button>
          <button className='modal-button' onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default EditLocaleModal;
