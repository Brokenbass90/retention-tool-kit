import React, { useState } from 'react';
import './ScreenshotButton.css'; // Убедитесь, что у вас есть соответствующий CSS файл

const ScreenshotButton = ({ html }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTakeScreenshot = async () => {
    setIsProcessing(true);

    try {
      const response = await fetch('/generate-screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'text/html' },
        body: html,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'screenshot.png';
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
      setIsProcessing(false);
    }
  };

  return (
    <button className="convert-button" onClick={handleTakeScreenshot} disabled={isProcessing}>
      {isProcessing ? 'Processing...' : 'Take Screenshot'}
    </button>
  );
};

export default ScreenshotButton;
