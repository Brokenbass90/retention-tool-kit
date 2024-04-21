import React, { useState, useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import AceEditor from 'react-ace';
import { autorun } from 'mobx';
import { appStore } from '../../stores/AppStore';
import './PdfMaker.css';
import { FaCompress, FaExchangeAlt, FaArrowsAlt } from 'react-icons/fa';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/snippets/html';

const PdfMaker = observer(() => {
  const [wrapEnabled, setWrapEnabled] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => {
    const disposer = autorun(() => {
      const editor = editorRef.current?.editor;
      if (editor && appStore.highlightedText) {
        const found = editor.find(appStore.highlightedText, {
          wrap: true,
          caseSensitive: false,
          wholeWord: false,
          regExp: false,
        });

        if (found) {
          editor.scrollToLine(found.start.row, true, true, () => {});
          editor.focus();
        }
      }
    });

    return () => disposer();
  }, [appStore.highlightedText]);

  const handleCodeChange = (newHtml) => {
    appStore.setOriginalHtml(newHtml);
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
        <button onClick={toggleFullscreen} className="fullscreen-button">{isFullscreen ? <FaCompress /> : <FaArrowsAlt />}</button>
      </div>
      <AceEditor
        ref={editorRef}
        mode="html"
        theme="monokai"
        onChange={handleCodeChange}
        name="UNIQUE_ID_OF_DIV"
        value={appStore.html}
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
});

export default PdfMaker;
