import React, { useState } from 'react';
import AceEditor from 'react-ace';
import './PdfMaker.css';
import { FaExpand, FaCompress } from 'react-icons/fa'; 

import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/theme-monokai';

const PdfMaker = ({ html, setHtml }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCodeChange = (newValue) => {
    setHtml(newValue);
  };

  return (
    <div className={`pdf-maker ${isExpanded ? 'expanded' : ''}`}>
      <AceEditor
        mode="html"
        theme="monokai"
        onChange={handleCodeChange}
        name="UNIQUE_ID_OF_DIV"
        value={html}
        editorProps={{ $blockScrolling: true }}
        setOptions={{
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
