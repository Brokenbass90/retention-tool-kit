import React, { useRef } from 'react';
import './HtmlWindow.css';

const HtmlWindow = ({ htmlContent, onElementClick }) => {
  const iframeRef = useRef(null);

  const addOnClick = () => {
    const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
    iframeDoc.body.onclick = function(event) {
      event.preventDefault();
      const targetElement = event.target;
      onElementClick(targetElement);
    };
  };

  return (
    <div className="preview-container">
      <iframe
        ref={iframeRef}
        srcDoc={htmlContent}
        title="HTML Preview"
        onLoad={addOnClick} 
      ></iframe>
    </div>
  );
};

export default HtmlWindow;
