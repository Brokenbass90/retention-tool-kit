import React, { useRef, useEffect, useCallback } from 'react';
import './HtmlWindow.css';

const HtmlWindow = ({ htmlContent, onElementClick }) => {
  const iframeRef = useRef(null);

  // Использование useCallback для определения функции updateIframeContent
  const updateIframeContent = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument || iframe.contentWindow.document;
    const body = doc.body;

    // Очищаем текущее содержимое
    while (body.firstChild) {
      body.removeChild(body.firstChild);
    }

    // Вставляем новое содержимое как HTML
    const newContent = doc.createElement('div');
    newContent.innerHTML = htmlContent;
    Array.from(newContent.childNodes).forEach(node => {
      doc.body.appendChild(node);
    });
  }, [htmlContent]);

  useEffect(() => {
    updateIframeContent();

    const addOnClick = () => {
      const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
      iframeDoc.body.addEventListener('click', function(event) {
        event.preventDefault();
        const targetElement = event.target;
        onElementClick(targetElement);
      }, false);
    };

    addOnClick();
  }, [updateIframeContent, onElementClick]);

  return (
    <div className="preview-container">
      <iframe
        ref={iframeRef}
        title="HTML Preview"
      ></iframe>
    </div>
  );
};

export default HtmlWindow;
