import React, { useState, useEffect } from 'react';
import PdfMaker from './components/PdfMaker/PdfMaker.jsx';
import HtmlWindow from './components/HtmlWindow/HtmlWindow.jsx';
import ConvertButton from './components/ConvertButton/ConvertButton';
import TxtToJson from './components/TxtToJson/TxtToJson.jsx';
import FileUploader from './components/FileUploader/FileUploader.jsx';
import LocaleManager from './components/LocaleManager/LocaleManager.jsx';
import { processFiles } from './utils/processFiles';
import { replacePlaceholders } from './utils/replacePlaceholders';
import './App.css';

const App = () => {
  const [originalHtml, setOriginalHtml] = useState('');
  const [html, setHtml] = useState('');
  const [locales, setLocales] = useState([]);
  const [localesContent, setLocalesContent] = useState({});
  const [folderName, setFolderName] = useState('');
  const [showTxtToJson, setShowTxtToJson] = useState(false);

  useEffect(() => {
    
    setHtml(originalHtml);
  }, [originalHtml]);

  const handleFilesUploaded = (files) => {
    if (files.length > 0) {
      clearData(); 
      const folderPath = files[0].webkitRelativePath;
      const folderName = folderPath.split('/')[0];
      setFolderName(folderName);
      processFiles(files, setLocales, setLocalesContent);
      setOriginalHtml(''); 
    }
  };

  const handleLocaleChange = (locale) => {
    const localeData = localesContent[locale];
    if (localeData) {

      const dataForReplacement = Object.values(localeData)[0]; 
      const updatedHtml = replacePlaceholders(originalHtml, dataForReplacement);
      setHtml(updatedHtml); 
    }
  };

  const resetLocale = () => {
    setHtml(originalHtml); 
  };

  const clearData = () => {
    setLocales([]);
    setLocalesContent({});
    setFolderName('');
    setHtml('');
    setOriginalHtml('');
  };

  return (
    <div className="App">
      <div className="top-bar">
        <FileUploader onFilesUploaded={handleFilesUploaded} />
        <LocaleManager locales={locales} onLocaleChange={handleLocaleChange} />
        {folderName && (
          <div>
            <button onClick={resetLocale}>{`Original (${folderName})`}</button>
            <button onClick={clearData} style={{ marginLeft: '10px' }}>✖</button> 
          </div>
        )}
      </div>
      <div className="content-area">
        <PdfMaker html={html} setHtml={setOriginalHtml} /> 
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
