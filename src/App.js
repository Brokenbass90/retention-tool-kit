import React, { useState } from 'react';
import PdfMaker from './components/PdfMaker/PdfMaker';
import HtmlWindow from './components/HtmlWindow/HtmlWindow';
import ConvertButton from './components/ConvertButton/ConvertButton';
import TxtToJson from './components/TxtToJson/TxtToJson';
import './App.css';

const App = () => {
  const [html, setHtml] = useState('');
  const [showTxtToJson, setShowTxtToJson] = useState(false);

  return (
    <div className="App">
      <div className="content-area">
        <PdfMaker html={html} setHtml={setHtml} />
        <HtmlWindow htmlContent={html} />
      </div>
      <div className="buttons-area">
        <ConvertButton html={html} />
        <button className="convert-button txt-to-json-toggle" onClick={() => setShowTxtToJson(!showTxtToJson)}>
  {showTxtToJson ? 'Close Txt to JSON' : 'Txt to JSON'}
</button>

      </div>
      <TxtToJson onClose={() => setShowTxtToJson(false)} isVisible={showTxtToJson} />
    </div>
  );
};

export default App;
