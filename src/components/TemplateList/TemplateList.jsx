import React, { useState, useEffect } from 'react';
import UploadTemplateModal from '../UploadTemplateModal/UploadTemplateModal';
import ConfirmDeleteModal from '../ConfirmDeleteModal/ConfirmDeleteModal';
import './TemplateList.css';

const TemplateList = ({ onApplyTemplate }) => {
  const [templates, setTemplates] = useState([]);
  const [isTemplateListOpen, setIsTemplateListOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/templates');
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const handleAddTemplate = async (template) => {
    try {
      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(template),
      });

      if (response.ok) {
        fetchTemplates();
        setIsModalOpen(false);
      } else {
        console.error('Failed to save template');
      }
    } catch (error) {
      console.error('Error adding template:', error);
    }
  };

  const handleDeleteClick = (templateName) => {
    setTemplateToDelete(templateName);
  };

  const handleConfirmDelete = async () => {
    if (templateToDelete) {
      await handleDeleteTemplate(templateToDelete);
      setTemplateToDelete(null);
    }
  };

  const handleDeleteTemplate = async (templateName) => {
    if (!templateName) {
      console.error('Template name is undefined');
      return;
    }

    try {
      const response = await fetch(`/api/templates/${encodeURIComponent(templateName)}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchTemplates();
      } else {
        console.error('Failed to delete template');
      }
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  };

  const toggleTemplateList = () => {
    setIsTemplateListOpen(!isTemplateListOpen);
  };

  return (
    <div className={`template-list-panel ${isTemplateListOpen ? 'open' : ''}`}>
    <div className='scroll'>
      <button className="template-list-toggle-button" onClick={toggleTemplateList}>
        {isTemplateListOpen ? 'Hide Templates' : 'Show Templates'}
      </button>

      {isTemplateListOpen && templates.length > 0 ? (
        templates.map((template, index) => (
            <div key={index} className="template-item" onClick={() => onApplyTemplate(template.content)}>
            <div className='template-preview'>
              <iframe
                srcDoc={`<div style="zoom: 0.5; transform-origin: top left;">${template.content}</div>`}
                title={`preview-${template.name}`}
                className="template-preview-iframe"
              />
            </div>
            <div className='template-buttons'>
              <span className="template-name">{template.name}</span> 
              <button
                className='blue-button right-button'
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(template.name);
                }}
              >
                ×
              </button>
              
            </div>
          </div>
        ))
      ) : (
        isTemplateListOpen && <p className='text-color'>No templates available</p>
      )}

      {isTemplateListOpen && (
        <button className="configurator-toggle-button" onClick={() => setIsModalOpen(true)}>
          Add New Template
        </button>
      )}

      {isModalOpen && <UploadTemplateModal onClose={() => setIsModalOpen(false)} onSave={handleAddTemplate} />}
      {templateToDelete && (
        <ConfirmDeleteModal
          message={`Are you sure you want to delete the template "${templateToDelete}"?`}
          onClose={() => setTemplateToDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
      </div>
    </div>
  );
};

export default TemplateList;
