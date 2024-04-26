import React, { useRef, useEffect, useCallback } from 'react';
import './HtmlWindow.css';

const HtmlWindow = ({ htmlContent, onElementClick }) => {
  const iframeRef = useRef(null);

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
        onElementClick(targetElement.innerText || targetElement.textContent); // Передаем текст в AppStore
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
      <iframe ref={iframeRef} title="HTML Preview"></iframe>
    </div>
  );
};

export default HtmlWindow;

