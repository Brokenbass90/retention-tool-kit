import React, { useState, useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import AceEditor from 'react-ace';
import { autorun } from 'mobx';
import { appStore } from '../../stores/AppStore';
import './PdfMaker.css';
import { FaCompress, FaExchangeAlt, FaArrowsAlt, FaCopy } from 'react-icons/fa'; // Добавлен FaCopy
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/snippets/html';

const PdfMaker = observer(() => {
  const [wrapEnabled, setWrapEnabled] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => {
    const loadAndSetup = async () => {
      await appStore.loadInitialData();
      appStore.resetLocale();
    };
  
    loadAndSetup();
  }, []);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appStore.highlightedText]);

  const handleCodeChange = (newHtml) => {
    if (newHtml !== appStore.html) {
      appStore.setOriginalHtml(newHtml);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(prevState => !prevState);
  };

  const toggleWrap = () => {
    setWrapEnabled(prevState => !prevState);
  };

  const copyToClipboard = () => {
    const editor = editorRef.current?.editor;
    if (editor) {
      const text = editor.getValue();
      navigator.clipboard.writeText(text)
        .then(() => {
          setIsCopying(true);
          setTimeout(() => setIsCopying(false), 1000); // Подсветка кнопки на 1 секунду
        })
        .catch(() => {
          setIsCopying(false);
        });
    }
  };

  return (
    <div className={`pdf-maker ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="toolbar">
        <button onClick={toggleWrap} className="toolbar-button"><FaExchangeAlt /></button>
        <button onClick={toggleFullscreen} className="fullscreen-button">{isFullscreen ? <FaCompress /> : <FaArrowsAlt />}</button>
        <button onClick={copyToClipboard} className={`copy-button ${isCopying ? 'copying' : ''}`}><FaCopy /></button> {/* Кнопка копирования с классом индикации */}
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
