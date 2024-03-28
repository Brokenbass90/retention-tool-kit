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
  const [htmlByLocale, setHtmlByLocale] = useState({});
  const [foldersData, setFoldersData] = useState({});
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [locales, setLocales] = useState([]);
  const [selectedLocale, setSelectedLocale] = useState('');
  const [isOriginalSelected, setIsOriginalSelected] = useState(true);
  const [highlightedText, setHighlightedText] = useState('');
  const [showTxtToJson, setShowTxtToJson] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Text successfully copied');
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  useEffect(() => {
    if (isOriginalSelected) {
      setHtml(originalHtml);
    } else if (selectedLocale && htmlByLocale[selectedLocale]) {
      setHtml(htmlByLocale[selectedLocale]);
    }
  }, [originalHtml, isOriginalSelected, selectedLocale, htmlByLocale]);

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
      setIsOriginalSelected(true);
    }
  };

  const handleFolderSelection = (folderName) => {
    setSelectedFolder(folderName);
    setIsOriginalSelected(false);
    const placeholderText = `$\{{ ${folderName}.block_00 }}$`;
    copyToClipboard(placeholderText);
  };

  const handleLocaleSelection = (locale) => {
    setSelectedLocale(locale);
    setIsOriginalSelected(false);

    let updatedHtml = htmlByLocale[locale] || originalHtml;
    if (!htmlByLocale[locale]) {
      Object.keys(foldersData).forEach(folderName => {
        if (foldersData[folderName][locale]) {
          updatedHtml = replacePlaceholders(updatedHtml, foldersData[folderName][locale], folderName);
        }
      });
      setHtmlByLocale(prev => ({ ...prev, [locale]: updatedHtml }));
    }
    setHtml(updatedHtml);
  };

  const resetLocale = () => {
    setIsOriginalSelected(true);
    setSelectedLocale('');
    setHtml(originalHtml);
  };

  const onElementClick = (element) => {
    const textToHighlight = element.innerText || element.textContent;
    setHighlightedText(textToHighlight);
  };
  
  return (
    <div className="App">
    <div className="top-bar">
      <div className="file-uploader-container">
        <FileUploader onFilesUploaded={handleFilesUploaded} />
      </div>
      <button className={`original-btn ${isOriginalSelected ? 'selected' : ''}`} onClick={resetLocale}>Original</button>
      {locales.map((locale) => (
        <button key={locale} onClick={() => handleLocaleSelection(locale)} className={`locale-btn ${selectedLocale === locale ? 'selected' : ''}`}>
          {locale}
        </button>
      ))}
    </div>

    <div className="folder-bar">
      {Object.keys(foldersData).map((folderName) => (
        <button key={folderName} onClick={() => handleFolderSelection(folderName)} className={`folder-btn ${selectedFolder === folderName ? 'selected' : ''}`}>
          {folderName}
        </button>
      ))}
    </div>

    <div className="content-area">
      <PdfMaker html={html} setHtml={newHtml => {
        if (!isOriginalSelected && selectedLocale) {
          setHtmlByLocale(prev => ({ ...prev, [selectedLocale]: newHtml }));
        } else {
          setOriginalHtml(newHtml);
        }
        setHtml(newHtml);
      }} highlightedText={highlightedText} />
      <HtmlWindow htmlContent={html} onElementClick={onElementClick} />
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

