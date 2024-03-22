import React, { useState, useEffect } from 'react';
import PdfMaker from './components/PdfMaker/PdfMaker.jsx';
import HtmlWindow from './components/HtmlWindow/HtmlWindow.jsx';
import ConvertButton from './components/ConvertButton/ConvertButton';
import TxtToJson from './components/TxtToJson/TxtToJson.jsx';
import FileUploader from './components/FileUploader/FileUploader.jsx';
import { processFiles } from './utils/processFiles';
import { replacePlaceholders } from './utils/replacePlaceholders';
import './App.css';

const App = () => {
  const [originalHtml, setOriginalHtml] = useState('');
  const [html, setHtml] = useState('');
  const [foldersData, setFoldersData] = useState({});
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [showTxtToJson, setShowTxtToJson] = useState(false);
  const [locales, setLocales] = useState([]);
  const [selectedLocale, setSelectedLocale] = useState(null);

  useEffect(() => {
    setHtml(originalHtml);
  }, [originalHtml]);

  useEffect(() => {
    const allLocales = new Set();
    Object.values(foldersData).forEach(folder => {
      Object.keys(folder).forEach(locale => allLocales.add(locale));
    });
    setLocales([...allLocales]);
  }, [foldersData]);

  const handleFilesUploaded = async (files) => {
    if (files.length > 0) {
      await processFiles(files, setFoldersData);
    }
  };

  const handleFolderSelection = (folderName) => {
    setSelectedFolder(folderName);
  };

  const handleLocaleSelection = (locale) => {
    setSelectedLocale(locale);
    let updatedHtml = originalHtml;
  
    Object.keys(foldersData).forEach(folderName => {
      if (foldersData[folderName][locale]) {
        updatedHtml = replacePlaceholders(updatedHtml, foldersData[folderName][locale], folderName);
      }
    });
  
    setHtml(updatedHtml);
  };

  const resetLocale = () => {
    setHtml(originalHtml);
  };

  return (
    <div className="App">
      <div className="top-bar">
        <FileUploader onFilesUploaded={handleFilesUploaded} />
        <button onClick={resetLocale}>Original</button>
        {locales.map(locale => (
          <button key={locale} onClick={() => handleLocaleSelection(locale)} className={selectedLocale === locale ? 'selected' : ''}>
            {locale}
          </button>
        ))}
      </div>
  
      {/* Отображение текущей выбранной локали */}
      {selectedLocale && (
        <div className="selected-locale">
          Current Locale: {selectedLocale}
        </div>
      )}
  
      <div className="folder-bar">
        {Object.keys(foldersData).map(folderName => (
          <button key={folderName} onClick={() => handleFolderSelection(folderName)} className={selectedFolder === folderName ? 'selected' : ''}>
            {folderName}
          </button>
        ))}
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
  
      {showTxtToJson && <TxtToJson onClose={() => setShowTxtToJson(false)} isVisible={showTxtToJson} />}
    </div>
  );
  
};

export default App;
