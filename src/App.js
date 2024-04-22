import React from 'react';
import { observer } from 'mobx-react-lite';
import PdfMaker from './components/PdfMaker/PdfMaker.jsx';
import HtmlWindow from './components/HtmlWindow/HtmlWindow.jsx';
import ConvertButton from './components/ConvertButton/ConvertButton';
import TxtToJson from './components/TxtToJson/TxtToJson.jsx';
import FileUploader from './components/FileUploader/FileUploader.jsx';
import { appStore } from './stores/AppStore';
import './App.css';

const App = observer(() => {
  function onElementClick(text) {
    if (text) {
      appStore.setHighlightedText(text);
    }
  }

  return (
    <div className="App">
      <div className="top-bar">
        <div className="file-uploader-container">
          <FileUploader onFilesUploaded={appStore.handleFilesUploaded} />
        </div>
        <button className={`original-btn ${appStore.isOriginalSelected ? 'selected' : ''}`} onClick={appStore.resetLocale}>Original</button>
        {appStore.locales.map((locale) => (
          <button key={locale} onClick={() => appStore.handleLocaleSelection(locale)} className={`locale-btn ${appStore.selectedLocale === locale ? 'selected' : ''}`}>
            {locale}
          </button>
        ))}
      </div>
      <div className="folder-bar">
        {Object.keys(appStore.foldersData).map((folderName) => (
          <div key={folderName} className="folder-entry">
            <button onClick={() => appStore.handleFolderSelection(folderName)} className={`folder-btn ${appStore.selectedFolder === folderName ? 'selected' : ''}`}>
              {folderName}
            </button>
            <button onClick={() => appStore.deleteFolder(folderName)} className="delete-button folder-btn">
              ✖
            </button>
          </div>
        ))}
      </div>
      <div className="content-area">
        <PdfMaker html={appStore.html} setHtml={appStore.setOriginalHtml.bind(appStore)} highlightedText={appStore.highlightedText} />
        <HtmlWindow htmlContent={appStore.html} onElementClick={onElementClick} />
      </div>
      <div className="buttons-area">
        <ConvertButton html={appStore.html} />
        <button className="convert-button txt-to-json-toggle" onClick={appStore.toggleTxtToJson}>
          {appStore.showTxtToJson ? 'Close Txt to JSON' : 'Txt to JSON'}
        </button>
      </div>
      {appStore.showTxtToJson && <TxtToJson onClose={appStore.toggleTxtToJson} isVisible={appStore.showTxtToJson} />}
    </div>
  );
});

export default App;
