import React, { useState } from 'react';
import { appStore } from '../../stores/AppStore';
import folderIcon from '../../assets/img-folder.webp';
import './FileUploader.css';

const FileUploader = ({ onFilesUploaded }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event) => {
    setIsUploading(true);
    const files = event.target.files;
    const processedFiles = await processFiles(files);
    onFilesUploaded(processedFiles);
    setIsUploading(false);
  };

  const processFiles = async (files) => {
    const newFoldersData = {};

    for (const file of files) {
      if (file.name === '.DS_Store') continue;

      const pathParts = file.webkitRelativePath.split('/');
      const folderName = pathParts[0].replace('-out', '');
      const localeName = pathParts[1].split('.')[0].split('_')[0];
      
      if (!newFoldersData[folderName]) newFoldersData[folderName] = {};

      if (file.name.endsWith('.json')) {
        const content = await file.text();
        const jsonData = JSON.parse(content);
        if (!newFoldersData[folderName][localeName]) {
          newFoldersData[folderName][localeName] = {};
        }
        newFoldersData[folderName][localeName] = jsonData;
      } else if (file.name.endsWith('.txt')) {
        const content = await file.text();
        const blocks = content.match(/\{\{([\s\S]*?)\}\}/g) || [];
        let hasError = false;
        const jsonContent = blocks.reduce((acc, block, index) => {
          const key = `block_${String(index).padStart(2, '0')}`;
          if (!block.startsWith('{{') || !block.endsWith('}}')) {
            alert(`Ошибка: В локали ${localeName} отсутствует символ { или } в блоке ${index + 1}`);
            hasError = true;
            return acc;
          }
          if (block.includes('@@') && (block.match(/@@/g).length % 2 !== 0)) {
            alert(`Ошибка: В локали ${localeName} отсутствует символ @ в блоке ${index + 1}`);
            hasError = true;
            return acc;
          }
          let value = block.replace(/\{\{|\}\}/g, '').trim().replace(/@@(.*?)@@/g, '<b>$1</b>');
          acc[key] = value || " ";
          return acc;
        }, {});

        if (hasError) {
          alert(`Локаль ${localeName} не загружена из-за ошибок в формате.`);
          continue;
        }

        const txtLocaleName = extractLocaleFromFileName(file.name);
        if (!newFoldersData[folderName][txtLocaleName]) {
          newFoldersData[folderName][txtLocaleName] = {};
        }
        newFoldersData[folderName][txtLocaleName] = jsonContent;
      }
    }

    await appStore.handleFilesUploaded(newFoldersData);
    return newFoldersData;
  };

  const extractLocaleFromFileName = (fileName) => {
    const localeRegex = /([a-z]{2})(?:_[A-Z]{2})?/;
    const match = fileName.match(localeRegex);
    if (match) {
      return match[1];
    }
    return 'unknown';
  };

  return (
    <div className="file-uploader-container">
      <input
        type="file"
        onChange={handleFileChange}
        multiple
        directory=""
        webkitdirectory=""
        id="file-uploader"
        className="file-uploader-input"
      />
      <label htmlFor="file-uploader" className="file-uploader-label">
        <img src={folderIcon} alt="Upload" />
      </label>
      {isUploading && <p>Uploading...</p>}
    </div>
  );
};

export default FileUploader;
