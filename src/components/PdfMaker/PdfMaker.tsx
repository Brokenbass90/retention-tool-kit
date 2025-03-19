import React, { useState, useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import AceEditor from 'react-ace';
import { autorun } from 'mobx';
import { appStore } from '../../stores/AppStore';
import { PdfMakerProps } from '../../types';
import './PdfMaker.css';
import { FaCompress, FaExchangeAlt, FaArrowsAlt, FaCopy } from 'react-icons/fa';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-searchbox';
import 'ace-builds/src-noconflict/snippets/html';

const PdfMaker: React.FC<PdfMakerProps> = observer(({ selectedTemplate }) => {
  const [wrapEnabled, setWrapEnabled] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isCopying, setIsCopying] = useState<boolean>(false);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    const loadAndSetup = async (): Promise<void> => {
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
    // eslint-disable-next-line
  }, [appStore.highlightedText]);

  useEffect(() => {
    if (selectedTemplate) {
      appStore.setOriginalHtml(selectedTemplate);
    }
  }, [selectedTemplate]);

  useEffect(() => {
    if (appStore.highlightedText) {
      const editor = editorRef.current?.editor;
      if (editor) {
        editor.find(appStore.highlightedText);
      }
    }
    // eslint-disable-next-line 
  }, [appStore.highlightedText]);

  const handleCodeChange = (newHtml: string): void => {
    if (newHtml !== appStore.html) {
      appStore.setOriginalHtml(newHtml);
    }
  };

  const toggleFullscreen = (): void => {
    setIsFullscreen(prevState => !prevState);
  };

  const toggleWrap = (): void => {
    setWrapEnabled(prevState => !prevState);
  };

  const copyToClipboard = (): void => {
    const editor = editorRef.current?.editor;
    if (editor) {
      const text = editor.getValue();
      navigator.clipboard.writeText(text)
        .then(() => {
          setIsCopying(true);
          setTimeout(() => setIsCopying(false), 1000);
        })
        .catch(() => {
          setIsCopying(false);
        });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.metaKey && e.key === 'f') {
      e.preventDefault();
      const editor = editorRef.current?.editor;
      if (editor) {
        editor.execCommand('find');
      }
    }
  };

  return (
    <div 
      className={`pdf-maker ${isFullscreen ? 'fullscreen' : ''}`}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="toolbar">
        <button onClick={toggleWrap} className="toolbar-button"><FaExchangeAlt /></button>
        <button onClick={toggleFullscreen} className="fullscreen-button">{isFullscreen ? <FaCompress /> : <FaArrowsAlt />}</button>
        <button onClick={copyToClipboard} className={`copy-button ${isCopying ? 'copying' : ''}`}><FaCopy /></button>
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
