import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import './PdfMaker.css';
import { FaExpand, FaCompress } from 'react-icons/fa';

import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/snippets/html';

const PdfMaker = ({ html, setHtml }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [editorHtml, setEditorHtml] = useState(html);

  useEffect(() => {
    // Эффект для синхронизации внешнего состояния с локальным при изменении внешнего
    setEditorHtml(html);
  }, [html]);

  const handleCodeChange = (newValue) => {
    // Обновляем только локальное состояние, чтобы избежать перерендеров
    setEditorHtml(newValue);
  };

  const handleBlur = () => {
    // Обновляем внешнее состояние только при потере фокуса редактором
    setHtml(editorHtml);
  };

  return (
    <div className={`pdf-maker ${isExpanded ? 'expanded' : ''}`}>
      <AceEditor
        mode="html"
        theme="monokai"
        onChange={handleCodeChange}
        onBlur={handleBlur} // Добавляем обработчик onBlur
        name="UNIQUE_ID_OF_DIV"
        value={editorHtml} // Привязываем к локальному состоянию
        editorProps={{ $blockScrolling: true }}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          useWorker: false
        }}
        width="100%"
        height="100%" 
      />
      <button className="expand-button" onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? <FaCompress /> : <FaExpand />}
      </button>
    </div>
  );
};

export default PdfMaker;
