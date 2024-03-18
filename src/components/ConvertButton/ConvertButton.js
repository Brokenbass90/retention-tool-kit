import React, { useState } from 'react';
import './ConvertButton.css';

const ConvertButton = ({ html }) => {
  const [isConverting, setIsConverting] = useState(false); // Добавляем состояние для отслеживания процесса конвертации

  const handleConvertToPDF = async () => {
    setIsConverting(true); // Начинаем процесс конвертации, делаем кнопку неактивной
    try {
      const response = await fetch('/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'text/html' },
        body: html,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'converted-document.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Server responded with an error.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      setIsConverting(false); // Завершаем процесс конвертации, делаем кнопку снова активной
    }
  };

  return (
    <button className="convert-button" onClick={handleConvertToPDF} disabled={isConverting}>
      {isConverting ? 'Converting...' : 'Convert to PDF'}
    </button>
  );
};

export default ConvertButton;
