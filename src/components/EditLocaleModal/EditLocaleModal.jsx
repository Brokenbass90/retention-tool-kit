// import React, { useState, useEffect } from 'react';
// import './EditLocaleModal.css';
// import { appStore } from '../../stores/AppStore'; // добавляем импорт appStore

// const EditLocaleModal = ({ onClose, onSave, locale }) => {
//   const [keyName, setKeyName] = useState('');
//   const [content, setContent] = useState('');

//   useEffect(() => {
//     if (locale) {
//       const data = appStore.getLocaleData(locale); // Получаем данные локали
//       setKeyName(data.keyName || '');
//       setContent(data.content || '');
//     }
//   }, [locale]);

//   const handleSave = () => {
//     if (keyName && content) {
//       onSave({ locale, keyName, content });
//       onClose();
//     } else {
//       alert('Заполните все поля');
//     }
//   };

//   const handleOverlayClick = (e) => {
//     if (e.target === e.currentTarget) {
//       onClose();
//     }
//   };

//   return (
//     <div className="modal-overlay" onClick={handleOverlayClick}>
//       <div className="modal-content">
//         <button className="modal-close" onClick={onClose}>×</button>
//         <input
//           type="text"
//           placeholder="Введите имя ключа"
//           value={keyName}
//           onChange={(e) => setKeyName(e.target.value)}
//         />
//         <textarea
//           placeholder="Введите текст в формате {{...}}"
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//         />
//         <div className="modal-buttons">
//           <button className='modal-button mr10' onClick={handleSave}>Save</button>
//           <button className='modal-button' onClick={onClose}>Close</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditLocaleModal;




// import React, { useState, useEffect } from 'react';
// import { appStore } from '../../stores/AppStore';
// import './EditLocaleModal.css';

// const EditLocaleModal = ({ onClose, onSave, locale }) => {
//   const [keyName, setKeyName] = useState('');
//   const [content, setContent] = useState('');

//   useEffect(() => {
//     if (locale) {
//       const data = appStore.getLocaleData(locale);
//       setKeyName(data.keyName || '');
//       setContent(formatContentForDisplay(data.content || ''));
//     }
//   }, [locale]);

//   const formatContentForDisplay = (content) => {
//     return Object.values(content).map(value => `{{${value.replace(/<b>(.*?)<\/b>/g, '@@$1@@')}}}`).join('\n\n');
//   };

//   const handleSave = () => {
//     if (keyName && content) {
//       const formattedContent = parseContentForSaving(content);
//       onSave({ locale, keyName, content: formattedContent });
//       onClose();
//     } else {
//       alert('Заполните все поля');
//     }
//   };

//   const parseContentForSaving = (content) => {
//     const blocks = content.match(/\{\{([\s\S]*?)\}\}/g) || [];
//     return blocks.reduce((acc, block, index) => {
//       const key = `block_${String(index).padStart(2, '0')}`;
//       let value = block.replace(/\{\{|\}\}/g, '').trim();
//       value = value.replace(/@@(.*?)@@/g, '<b>$1</b>');
//       acc[key] = value || " ";
//       return acc;
//     }, {});
//   };

//   const handleOverlayClick = (e) => {
//     if (e.target === e.currentTarget) {
//       onClose();
//     }
//   };

//   return (
//     <div className="modal-overlay" onClick={handleOverlayClick}>
//       <div className="modal-content">
//         <button className="modal-close" onClick={onClose}>×</button>
//         <input
//           type="text"
//           placeholder="Введите имя ключа"
//           value={keyName}
//           onChange={(e) => setKeyName(e.target.value)}
//         />
//         <textarea
//           placeholder="Введите текст в формате {{...}}"
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//         />
//         <div className="modal-buttons">
//           <button className='modal-button mr10' onClick={handleSave}>Save</button>
//           <button className='modal-button' onClick={onClose}>Close</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditLocaleModal;
import React, { useState, useEffect } from 'react';
import './EditLocaleModal.css';
import { appStore } from '../../stores/AppStore';

const EditLocaleModal = ({ onClose, onSave, locale }) => {
  const [selectedPlaceholder, setSelectedPlaceholder] = useState(''); 
  const [placeholders, setPlaceholders] = useState([]); 
  const [content, setContent] = useState('');

  useEffect(() => {
    if (locale) {
      const data = appStore.getLocaleData(locale);
      const placeholderKeys = Object.keys(data.placeholders);
      setPlaceholders(placeholderKeys);
      setSelectedPlaceholder(placeholderKeys[0]);
      setContent(convertJsonToText(data.placeholders[placeholderKeys[0]]) || '');
    }
  }, [locale]);

  const convertJsonToText = (jsonContent) => {
    if (typeof jsonContent !== 'string') {
      // Преобразование JSON обратно в текст с блоками
      return Object.values(jsonContent)
        .map(value => `{{${value.replace(/<b>(.*?)<\/b>/g, '@@$1@@')}}}`)
        .join('\n\n'); // Разделяем блоки двойными переносами строк
    }
    return jsonContent;
  };

  const convertTextToJson = (text) => {
    const blocks = text.match(/{{[\s\S]*?}}/g) || []; // Ищем все блоки, заключенные в двойные фигурные скобки
    const jsonContent = {};
    blocks.forEach((block, index) => {
      const key = `block_${String(index).padStart(2, '0')}`;
      const cleanBlock = block
        .replace(/^{{|}}$/g, '') // Убираем внешние фигурные скобки
        .replace(/@@(.*?)@@/g, '<b>$1</b>'); // Конвертируем "@@" обратно в теги <b>
      jsonContent[key] = cleanBlock;
    });
    return jsonContent;
  };

  const handleSave = () => {
    if (selectedPlaceholder && content) {
      const jsonData = convertTextToJson(content);
      onSave({ locale, keyName: selectedPlaceholder, content: jsonData });
      onClose();
    } else {
      alert('Заполните все поля');
    }
  };

  const handlePlaceholderChange = (placeholder) => {
    setSelectedPlaceholder(placeholder);
    const content = appStore.getLocaleData(locale).placeholders[placeholder];
    setContent(convertJsonToText(content));
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
        <div className="placeholder-tabs">
          {placeholders.map((placeholder) => (
            <button
              key={placeholder}
              className={`placeholder-tab ${placeholder === selectedPlaceholder ? 'active' : ''}`}
              onClick={() => handlePlaceholderChange(placeholder)}
            >
              {placeholder}
            </button>
          ))}
        </div>
        <textarea
          placeholder="Введите текст в формате {{...}}"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="modal-buttons">
          <button className="modal-button mr10" onClick={handleSave}>Save</button>
          <button className="modal-button" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default EditLocaleModal;
