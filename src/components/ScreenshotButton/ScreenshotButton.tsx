import React, { useState } from 'react';
import { ScreenshotButtonProps } from '../../types';
import './ScreenshotButton.css';

const ScreenshotButton: React.FC<ScreenshotButtonProps> = ({ html }) => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleTakeScreenshot = async (): Promise<void> => {
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
