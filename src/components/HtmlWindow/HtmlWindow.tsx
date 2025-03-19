import React, { useRef, useEffect, useCallback, useState } from 'react';
import { HtmlWindowProps } from '../../types';
import './HtmlWindow.css';

const HtmlWindow: React.FC<HtmlWindowProps> = ({ htmlContent, onElementClick }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isMobileView, setIsMobileView] = useState<boolean>(false);

  const updateIframeContent = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    const body = doc.body;

    while (body.firstChild) {
      body.removeChild(body.firstChild);
    }

    const newContent = doc.createElement('div');
    newContent.innerHTML = htmlContent;
    Array.from(newContent.childNodes).forEach(node => {
      body.appendChild(node.cloneNode(true));
    });
  }, [htmlContent]);

  useEffect(() => {
    updateIframeContent();

    const handleBodyClick = (event: MouseEvent) => {
      event.preventDefault();
      const targetElement = event.target as HTMLElement;
      if (targetElement && (targetElement.innerText || targetElement.textContent)) {
        onElementClick(targetElement.innerText || targetElement.textContent || '');
      }
    };

    const iframe = iframeRef.current;
    if (!iframe) return;

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) return;

    iframeDoc.body.addEventListener('click', handleBodyClick, false);

    return () => {
      iframeDoc.body.removeEventListener('click', handleBodyClick, false);
    };
  }, [updateIframeContent, onElementClick]);

  return (
    <div className="preview-container">
      <div className="view-buttons">
        <button 
          onClick={() => setIsMobileView(false)} 
          className={!isMobileView ? 'active' : ''}
        >
          Desktop
        </button>
        <button 
          onClick={() => setIsMobileView(true)} 
          className={isMobileView ? 'active' : ''}
        >
          Mobile
        </button>
      </div>
      <div className={isMobileView ? 'iphone' : 'iphone100'}>
        <div className={isMobileView ? 'chelka' : ''} />
        <iframe 
          ref={iframeRef} 
          title="HTML Preview" 
          className={isMobileView ? 'mobile-view' : 'desktop-view'}
        />
      </div>
    </div>
  );
};

export default HtmlWindow;
