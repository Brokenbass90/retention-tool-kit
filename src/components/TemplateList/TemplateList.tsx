import React, { useState, useEffect } from 'react';
import UploadTemplateModal from '../UploadTemplateModal/UploadTemplateModal';
import ConfirmDeleteModal from '../ConfirmDeleteModal/ConfirmDeleteModal';
import { Template, TemplateListProps } from '../../types';
import './TemplateList.css';

const TemplateList: React.FC<TemplateListProps> = ({ onApplyTemplate }) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isTemplateListOpen, setIsTemplateListOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async (): Promise<void> => {
    try {
      const response = await fetch('/api/templates');
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const handleAddTemplate = async (template: Template): Promise<void> => {
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

  const handleDeleteClick = (templateName: string): void => {
    setTemplateToDelete(templateName);
  };

  const handleConfirmDelete = async (): Promise<void> => {
    if (templateToDelete) {
      await handleDeleteTemplate(templateToDelete);
      setTemplateToDelete(null);
    }
  };

  const handleDeleteTemplate = async (templateName: string): Promise<void> => {
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

  const toggleTemplateList = (): void => {
    setIsTemplateListOpen(!isTemplateListOpen);
  };

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`template-list-panel ${isTemplateListOpen ? 'open' : ''}`}>
      <div className='scroll'>
        <button className="template-list-toggle-button" onClick={toggleTemplateList}>
          {isTemplateListOpen ? 'Hide Templates' : 'Show Templates'}
        </button>

        {isTemplateListOpen && (
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        )}

        {isTemplateListOpen && filteredTemplates.length > 0 ? (
          filteredTemplates.map((template, index) => (
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
                  onClick={(e: React.MouseEvent) => {
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
