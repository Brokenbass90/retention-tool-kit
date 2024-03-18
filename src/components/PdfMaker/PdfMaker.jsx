import React from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/theme-monokai';

const PdfMaker = ({ html, setHtml }) => {
  const handleCodeChange = (newValue) => {
    setHtml(newValue);
  };

  return (
    <div className="pdf-maker">
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

    </div>
  );
};

export default PdfMaker;
