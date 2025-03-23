import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { EditorView } from '@codemirror/view';
import { darkTheme, syntaxHighlighting } from '../CodeEditor/syntaxHighlighting';
import { AddLocaleModalProps } from '../../types';
import './AddLocaleModal.css';

const AddLocaleModal: React.FC<AddLocaleModalProps> = ({ onClose, onSave }) => {
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

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
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

        <div className="editor-container">
          <CodeMirror
            value={content}
            height="300px"
            basicSetup={{ lineNumbers: true, tabSize: 2 }}
            onChange={(value) => setContent(value)}
            theme={darkTheme}
            extensions={[
              EditorView.lineWrapping,
              syntaxHighlighting
            ]}
          />
        </div>

        <div className="modal-buttons">
          <button className='modal-button mr10' onClick={handleSave}>Add</button>
          <button className='modal-button' onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default AddLocaleModal;
