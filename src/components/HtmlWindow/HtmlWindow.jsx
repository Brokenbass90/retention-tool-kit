import React from 'react';
import './HtmlWindow.css';

const HtmlWindow = ({ htmlContent }) => {
  return (
    <div className="preview-container">
      <iframe srcDoc={htmlContent} title="HTML Preview"></iframe>
    </div>
  );
};

export default HtmlWindow;
