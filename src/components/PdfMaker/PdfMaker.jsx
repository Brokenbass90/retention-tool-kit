import React, { useState, useEffect, useRef } from 'react';
import AceEditor from 'react-ace';
import './PdfMaker.css';
import { FaCompress, FaExchangeAlt, FaArrowsAlt } from 'react-icons/fa';

import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/snippets/html';

const PdfMaker = ({ html, setHtml, highlightedText }) => {
  const [wrapEnabled, setWrapEnabled] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [localHtml, setLocalHtml] = useState(html);
  const editorRef = useRef(null);

  useEffect(() => {
    setLocalHtml(html);
  }, [html]);

  useEffect(() => {
    const editor = editorRef.current?.editor;
    if (editor && highlightedText) {
      const session = editor.getSession();

      if (typeof session.removeAllMarkers === 'function') {
        session.removeAllMarkers();
      }

      editor.find(highlightedText, {
        wrap: true,
        caseSensitive: false,
        wholeWord: false,
        regExp: false,
      });

      const selectionRange = editor.getSelectionRange();
      if (selectionRange && typeof session.addMarker === 'function') {
        session.addMarker(selectionRange, "highlighted-code", "text");
      }

      editor.scrollToLine(selectionRange.start.row, true, true, function () {});

      editor.focus();
    }
  }, [highlightedText]);

  const handleCodeChange = (newHtml) => {
    setLocalHtml(newHtml);
    setHtml(newHtml);
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
        <button onClick={toggleWrap} className="toolbar-button"><FaExchangeAlt /></button>
        <button className="fullscreen-button" onClick={toggleFullscreen}>{isFullscreen ? <FaCompress /> : <FaArrowsAlt />}</button>
      </div>
      <AceEditor
        ref={editorRef}
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
    </div>
  );
};

export default PdfMaker;
