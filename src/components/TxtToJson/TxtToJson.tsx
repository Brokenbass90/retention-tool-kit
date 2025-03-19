import React, { useState, useRef } from 'react';
import { processFiles } from './processFiles';
import { TxtToJsonProps } from '../../types';
import './TxtToJson.css';

const TxtToJson: React.FC<TxtToJsonProps> = ({ onClose, isVisible }) => {
  const [folderName, setFolderName] = useState<string>('Choose Folder');
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateFolderNameAndFiles = (files: FileList | File[]): File[] => {
    if (files.length > 0) {
      const file = files[0] as File & { webkitRelativePath?: string };
      if (file.webkitRelativePath) {
        const name = file.webkitRelativePath.split('/')[0];
        setFolderName(name);
      }
      return Array.from(files);
    }
    return [];
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const processedFiles = updateFolderNameAndFiles(files);
      if (processedFiles.length > 0) {
        handleConvert(processedFiles, folderName);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const items = e.dataTransfer.items;
    if (items) {
      const directoryFiles: File[] = [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const entry = item.webkitGetAsEntry && item.webkitGetAsEntry();
        
        if (entry && entry.isDirectory) {
          const directoryReader = (entry as any).createReader();
          directoryReader.readEntries((entries: any[]) => {
            entries.forEach((entry: any) => {
              entry.file((file: File) => {
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

  const handleConvert = (files: File[], name: string) => {
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
      <div
        className="drop-zone"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {folderName}
        <input
          type="file"
          ref={fileInputRef}
          // @ts-ignore - webkitdirectory и directory не определены в типах
          webkitdirectory="true"
          directory="true"
          multiple
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>
      <button
        className="convert-button"
        onClick={() => fileInputRef.current?.files && handleConvert(Array.from(fileInputRef.current.files), folderName)}
        disabled={isConverting}
      >
        {isConverting ? 'Converting...' : 'Convert'}
      </button>
    </div>
  );
};

export default TxtToJson;
