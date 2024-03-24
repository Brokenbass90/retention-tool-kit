// HtmlWindow.js

import React, { useEffect, useRef } from 'react';
import './HtmlWindow.css';

const HtmlWindow = ({ htmlContent, onElementClick }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    iframeDoc.body.onclick = function(event) {
      event.preventDefault();
      const targetElement = event.target;
      onElementClick(targetElement);
    };
  }, [htmlContent, onElementClick]);

  return (
    <div className="preview-container">
      <iframe ref={iframeRef} srcDoc={htmlContent} title="HTML Preview"></iframe>
    </div>
  );
};

export default HtmlWindow;
