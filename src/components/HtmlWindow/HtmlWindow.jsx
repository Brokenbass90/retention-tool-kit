import React, { useRef, useEffect, useCallback, useState } from 'react';
import './HtmlWindow.css';

const HtmlWindow = ({ htmlContent, onElementClick }) => {
  const iframeRef = useRef(null);
  const [isMobileView, setIsMobileView] = useState(false);

  const updateIframeContent = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument || iframe.contentWindow.document;
    const body = doc.body;

    while (body.firstChild) {
      body.removeChild(body.firstChild);
    }

    const newContent = doc.createElement('div');
    newContent.innerHTML = htmlContent;
    Array.from(newContent.childNodes).forEach(node => {
      body.appendChild(node);
    });
  }, [htmlContent]);

  useEffect(() => {
    updateIframeContent();

    const handleBodyClick = (event) => {
      event.preventDefault();
      const targetElement = event.target;
      if (targetElement && (targetElement.innerText || targetElement.textContent)) {
        onElementClick(targetElement.innerText || targetElement.textContent);
      }
    };

    const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
    iframeDoc.body.addEventListener('click', handleBodyClick, false);

    return () => {
      iframeDoc.body.removeEventListener('click', handleBodyClick, false);
    };
  }, [updateIframeContent, onElementClick]);

  return (
    <div className="preview-container">
      <div className="view-buttons">
        <button onClick={() => setIsMobileView(false)} className={!isMobileView ? 'active' : ''}>Desktop</button>
        <button onClick={() => setIsMobileView(true)} className={isMobileView ? 'active' : ''}>Mobile</button>
      </div>
      <div className={isMobileView ? 'iphone' : 'iphone100'}>
      <div className={isMobileView ? 'chelka' : ''} ></div>
      <iframe 
        ref={iframeRef} 
        title="HTML Preview" 
        className={isMobileView ? 'mobile-view' : 'desktop-view'}
      ></iframe>
      </div>
      
  
    </div>
  );
};

export default HtmlWindow;
