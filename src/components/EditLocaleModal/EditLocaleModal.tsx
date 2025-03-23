import React, { useState, useEffect } from 'react';
import { EditLocaleModalProps, AppStoreData } from '../../types';
import { appStore } from '../../stores/AppStore';
import CodeMirror from '@uiw/react-codemirror';
import { EditorView, Decoration } from '@codemirror/view';
import './EditLocaleModal.css';

const darkTheme = EditorView.theme({
  '&': {
    backgroundColor: '#1e1e1e',
    color: '#d4d4d4'
  },
  '.cm-content': {
    caretColor: '#569cd6',
    fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
    padding: '10px'
  },
  '.cm-line': {
    padding: '0 4px'
  },
  '.cm-gutters': {
    backgroundColor: '#1e1e1e',
    color: '#858585',
    border: 'none'
  },
  '.cm-double-token': {
    color: '#569cd6 !important',
    fontWeight: 'bold !important'
  },
  '.cm-single-token': {
    color: '#f44336 !important',
    fontWeight: 'bold !important'
  }
}, { dark: true });

// Простое регулярное выражение для поиска токенов
const tokenRegex = /{{|}}|@@|[{}@]/g;

// Создаем расширение для подсветки
const syntaxHighlighting = EditorView.decorations.compute(["doc"], state => {
  const decorations = [];
  const doc = state.doc.toString();
  let match;

  while ((match = tokenRegex.exec(doc)) !== null) {
    const from = match.index;
    const to = from + match[0].length;
    const token = match[0];

    if (token === '{{' || token === '}}' || token === '@@') {
      // Двойные символы - синим
      decorations.push(
        Decoration.mark({class: 'cm-double-token'}).range(from, to)
      );
    } else {
      // Одиночные символы - красным
      decorations.push(
        Decoration.mark({class: 'cm-single-token'}).range(from, to)
      );
    }
  }

  return Decoration.set(decorations);
});

const EditLocaleModal: React.FC<EditLocaleModalProps> = ({ onClose, onSave, locale }) => {
  const [selectedPlaceholder, setSelectedPlaceholder] = useState<string>(''); 
  const [placeholders, setPlaceholders] = useState<string[]>([]); 
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    if (locale) {
      const data: AppStoreData = appStore.getLocaleData(locale);
      const placeholderKeys = Object.keys(data.placeholders);
      setPlaceholders(placeholderKeys);
      if (placeholderKeys.length > 0) {
        setSelectedPlaceholder(placeholderKeys[0]);
        setContent(convertJsonToText(data.placeholders[placeholderKeys[0]]));
      }
    }
  }, [locale]);

  const convertJsonToText = (jsonContent: Record<string, string> | string): string => {
    if (typeof jsonContent !== 'string') {
      return Object.values(jsonContent)
        .map(value => `{{${value.replace(/<b>(.*?)<\/b>/g, '@@$1@@')}}}`)
        .join('\n\n');
    }
    return jsonContent;
  };

  const convertTextToJson = (text: string): Record<string, string> => {
    const blocks = text.match(/{{[\s\S]*?}}/g) || [];
    const jsonContent: Record<string, string> = {};
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      const key = `block_${String(i).padStart(2, '0')}`;
      const cleanBlock = block
        .replace(/^{{|}}$/g, '')
        .replace(/@@(.*?)@@/g, '<b>$1</b>');
      jsonContent[key] = cleanBlock;
    }
    return jsonContent;
  };

  const handleSave = () => {
    if (selectedPlaceholder && content) {
      onSave({ locale, keyName: selectedPlaceholder, content: convertTextToJson(content) });
      onClose();
    } else {
      alert('Заполните все поля');
    }
  };

  const handlePlaceholderChange = (placeholder: string) => {
    setSelectedPlaceholder(placeholder);
    const data: AppStoreData = appStore.getLocaleData(locale);
    if (data.placeholders[placeholder]) {
      setContent(convertJsonToText(data.placeholders[placeholder]));
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
        <div className="editor-container">
          <CodeMirror
            value={content}
            height="300px"
            basicSetup={{
              lineNumbers: true,
              highlightActiveLine: true,
              highlightSelectionMatches: false,
              foldGutter: true,
              dropCursor: true,
              allowMultipleSelections: true,
              indentOnInput: true,
              closeBrackets: true,
              autocompletion: true,
              rectangularSelection: true,
              crosshairCursor: true,
              highlightActiveLineGutter: true,
              tabSize: 2
            }}
            onChange={(value) => setContent(value)}
            theme={darkTheme}
            extensions={[
              EditorView.lineWrapping,
              syntaxHighlighting
            ]}
          />
        </div>
        <div className="modal-buttons">
          <button className="modal-button mr10" onClick={handleSave}>Save</button>
          <button className="modal-button" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default EditLocaleModal;
