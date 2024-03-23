import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import './PdfMaker.css';
import { FaCompress, FaExchangeAlt, FaArrowsAlt } from 'react-icons/fa';

import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/snippets/html';

const PdfMaker = ({ html, setHtml }) => {
  const [wrapEnabled, setWrapEnabled] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [localHtml, setLocalHtml] = useState(html);

  useEffect(() => {
    setLocalHtml(html);
  }, [html]);

  const handleCodeChange = (newHtml) => {
    setLocalHtml(newHtml);
    setHtml(newHtml); // Update external state immediately for real-time rendering
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const toggleWrap = () => {
    setWrapEnabled(!wrapEnabled);
  };

  return (
    <div className={`pdf-maker ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="toolbar">
        <button onClick={toggleWrap} className="toolbar-button">
          {wrapEnabled ? <FaExchangeAlt /> : <FaExchangeAlt />}
        </button>
        <button className="fullscreen-button" onClick={toggleFullscreen}>
          {isFullscreen ? <FaCompress /> : <FaArrowsAlt />}
        </button>
      </div>
      <AceEditor
        mode="html"
        theme="monokai"
        onChange={handleCodeChange}
        name="UNIQUE_ID_OF_DIV"
        value={localHtml}
        editorProps={{ $blockScrolling: true }}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          useWorker: false,
          wrap: wrapEnabled
        }}
        width="100%"
        height="100%"
      />
      {/* HTML Preview */}
      <div className="html-preview">
        <iframe srcDoc={localHtml} style={{ width: '100%', height: '100%' }} title="Preview"></iframe>
      </div>
    </div>
  );
};

export default PdfMaker;
