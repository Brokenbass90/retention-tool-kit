import React, { useState, useRef } from 'react';
import { processFiles } from './processFiles';
import './TxtToJson.css';

const TxtToJson = ({ onClose, isVisible }) => {
  const [folderName, setFolderName] = useState('Choose Folder');
  const [isConverting, setIsConverting] = useState(false);
  const fileInputRef = useRef(null);

  const updateFolderNameAndFiles = (files) => {
    if (files.length > 0) {
      const name = files[0].webkitRelativePath.split('/')[0];
      setFolderName(name);
      return files;
    }
    return [];
  };

  const handleFileChange = (event) => {
    const files = updateFolderNameAndFiles(event.target.files);
    if (files.length > 0) {
      handleConvert(files, folderName);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const items = e.dataTransfer.items;
    if (items) {
      const directoryFiles = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].webkitGetAsEntry && items[i].webkitGetAsEntry().isDirectory) {
          const directoryReader = items[i].webkitGetAsEntry().createReader();
          directoryReader.readEntries((entries) => {
            entries.forEach((entry) => {
              entry.file((file) => {
                directoryFiles.push(file);
                if (directoryFiles.length === entries.length) {
                  const updatedFiles = updateFolderNameAndFiles(directoryFiles);
                  handleConvert(updatedFiles, folderName);
                }
              });
            });
          });
          break;
        }
      }
    }
  };

  const handleConvert = (files, name) => {
    if (!isConverting && files.length > 0) {
      setIsConverting(true);
      processFiles(files, name)
        .then(({ warnings, blocksCount }) => {
          setIsConverting(false);
          if (warnings.length > 0) {
            alert(`Предупреждения:\n${warnings.join('\n')}`);
          }
          const blocksMessage = Object.entries(blocksCount)
            .map(([locale, count]) => `${locale} - ${count}`)
            .join('\n');
          alert(`Количество блоков по локалям:\n${blocksMessage}`);
          onClose(); 
        })
        .catch(error => {
          console.error("Conversion error:", error);
          setIsConverting(false);
        });
    }
  };

  return (
    <div className={`txt-to-json-panel ${isVisible ? 'visible' : ''}`}>
      <button className="close-btn" onClick={onClose}>×</button>
      <div className="drop-zone" onClick={() => fileInputRef.current.click()} onDragOver={handleDragOver} onDrop={handleDrop}>
        {folderName}
        <input type="file" ref={fileInputRef} webkitdirectory="true" directory="true" multiple onChange={handleFileChange} style={{ display: 'none' }} />
      </div>
      <button className="convert-button" onClick={() => handleConvert(fileInputRef.current.files, folderName)} disabled={isConverting}>
        {isConverting ? 'Converting...' : 'Convert'}
      </button>
    </div>
  );
};

export default TxtToJson;

