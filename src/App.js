import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import PdfMaker from './components/PdfMaker/PdfMaker.jsx';
import HtmlWindow from './components/HtmlWindow/HtmlWindow.jsx';
import ConvertButton from './components/ConvertButton/ConvertButton';
import TxtToJson from './components/TxtToJson/TxtToJson.jsx';
import FileUploader from './components/FileUploader/FileUploader.jsx';
import { appStore } from './stores/AppStore';
import './App.css';
import AddLocaleModal from './components/AddLocaleModal/AddLocaleModal';
import EditLocaleModal from './components/EditLocaleModal/EditLocaleModal';
import BrandConfigurator from './components/BrandConfigurator/BrandConfigurator';
import BrandList from './components/BrandList/BrandList';
import { getSettings, saveSettings } from './utils/indexedDB';

const App = observer(() => {
  const [buttonColors, setButtonColors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);
  const [brands, setBrands] = useState([]);
  const [isBrandListOpen, setIsBrandListOpen] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      const savedHtml = await getSettings('html');
      if (savedHtml && savedHtml.html) {
        appStore.setHtml(savedHtml.html);
        appStore.setOriginalHtml(savedHtml.html); // Восстановить оригинальный HTML
      } else {
        appStore.setOriginalHtml(appStore.html);
      }
      fetchBrands();
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    const saveHtmlToIndexedDB = async () => {
      if (appStore.html) {
        await saveSettings({ html: appStore.html }, 'html');
      }
    };

    saveHtmlToIndexedDB();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appStore.html]);

  const fetchBrands = async () => {
    try {
      const response = await fetch('/api/brands');
      const data = await response.json();
      setBrands(data.filter(brand => Object.keys(brand).length > 0)); // Удаляем пустые бренды
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const handleSaveBrand = async (brandData) => {
    try {
      const response = await fetch('/api/brands', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(brandData),
      });

      if (response.ok) {
        await fetchBrands(); // Обновление списка брендов после сохранения
        setIsConfiguratorOpen(false);
      } else {
        console.error('Failed to save brand');
      }
    } catch (error) {
      console.error('Error saving brand:', error);
    }
  };

  const handleDeleteBrand = async (index) => {
    const brandToDelete = brands[index];
    
    if (!brandToDelete || !brandToDelete.brandName) {
      console.error('Brand name is required for deletion');
      return;
    }

    try {
      const response = await fetch(`/api/brands/${encodeURIComponent(brandToDelete.brandName)}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedBrands = brands.filter((_, i) => i !== index);
        setBrands(updatedBrands);
      } else {
        console.error('Failed to delete brand');
      }
    } catch (error) {
      console.error('Error deleting brand:', error);
    }
  };

  const handleApplyBrand = (brand) => {
    const placeholders = {
      '{%brand_color%}': brand.styles.brand_color,
      '{%brand_additional_color%}': brand.styles.brand_additional_color,
      '{%on_brand_color%}': brand.styles.on_brand_color,
      '{%surface_color%}': brand.styles.surface_color,
      '{%surface_variant_color%}': brand.styles.surface_variant_color,
      '{%on_surface_color%}': brand.styles.on_surface_color,
      '{%background_color%}': brand.styles.background_color,
      '{%accent_color%}': brand.styles.accent_color,
      '{%button_radius%}': brand.styles.button_radius,
      '{%small_radius%}': brand.styles.small_radius,
      '{%large_radius%}': brand.styles.large_radius,
      '{%logo_email_brand%}': brand.styles.logo_email_brand,
      '{%padding_l%}': brand.styles.padding_l,
      '{%padding_m%}': brand.styles.padding_m,
      '{%padding_s%}': brand.styles.padding_s,
      '{%padding_xs%}': brand.styles.padding_xs,
    };
  
    let newHtml = appStore.originalHtml; // Начинаем с оригинального HTML из appStore
  
    for (const [placeholder, value] of Object.entries(placeholders)) {
      if (value) { // Применяем только те значения, которые существуют
        newHtml = newHtml.replace(new RegExp(placeholder, 'g'), value);
      }
    }
  
    appStore.setHtml(newHtml); // Устанавливаем новый HTML в appStore
    appStore.isOriginalSelected = false;
  };

  const handleRestoreOriginal = () => {
    appStore.setHtml(appStore.originalHtml); // Восстанавливаем оригинальный HTML
    appStore.isOriginalSelected = true;
  };

  function onElementClick(text) {
    if (text) {
      appStore.setHighlightedText(text);
    }
  }

  function handleFolderClick(folderName) {
    const setButtonColor = (color) => {
      setButtonColors((prev) => ({ ...prev, [folderName]: color }));
    };
    appStore.handleFolderSelection(folderName, setButtonColor);
  }

  function openAddLocaleModal() {
    setIsModalOpen(true);
  }

  function closeAddLocaleModal() {
    setIsModalOpen(false);
  }

  function handleSaveLocale(data) {
    appStore.addLocaleManually(data);
  }

  function toggleConfigurator() {
    setIsConfiguratorOpen(!isConfiguratorOpen);
  }

  function toggleBrandList() {
    setIsBrandListOpen(!isBrandListOpen);
  }

  return (
    <div className="App">
      {appStore.editLocaleModalVisible && (
        <EditLocaleModal
          locale={appStore.localeToEdit}
          onClose={() => appStore.closeEditLocaleModal()}
          onSave={(data) => appStore.saveEditedLocale(data)}
        />
      )}

      <div className="top-bar">
        <div className="file-uploader-container">
          <FileUploader onFilesUploaded={appStore.handleFilesUploaded} />
        </div>
        <button
          className={`original-btn ${appStore.isOriginalSelected ? 'selected' : ''}`}
          onClick={() => {
            handleRestoreOriginal();
            appStore.isOriginalSelected = true;
            appStore.selectedLocale = '';
          }}
        >
          Original
        </button>
        {appStore.locales.map((locale) => (
          <div key={locale} className="locale-btn-container">
            <button 
              onClick={() => {
                appStore.handleLocaleSelection(locale);
                appStore.isOriginalSelected = false;
              }} 
              className={`locale-btn ${appStore.selectedLocale === locale && !appStore.isOriginalSelected ? 'selected' : ''}`}
            >
              {locale}
            </button>
            <button 
              className="edit-locale-btn" 
              onClick={() => appStore.openEditLocaleModal(locale)}
            >
              ✎
            </button>
          </div>
        ))}
        <button className="original-btn" onClick={openAddLocaleModal}>+</button>
        <button className="configurator-toggle-button" onClick={toggleConfigurator}>
          {isConfiguratorOpen ? '▲' : '▼'}
        </button>
      </div>
      
      <div className="folder-bar">
        {Object.keys(appStore.foldersData).map((folderName) => (
          <div key={folderName} className="folder-entry">
            <button
              onClick={() => handleFolderClick(folderName)}
              className={`folder-btn ${appStore.selectedFolder === folderName ? 'selected' : ''}`}
              style={{ backgroundColor: buttonColors[folderName] || '' }}
            >
              {folderName}
            </button>
            <button onClick={() => appStore.deleteFolder(folderName)} className="delete-button folder-btn">
              ✖
            </button>
          </div>
        ))}
      </div>

      <div className="content-area">
        <PdfMaker html={appStore.html} setHtml={appStore.setHtml.bind(appStore)} highlightedText={appStore.highlightedText} />
        <HtmlWindow htmlContent={appStore.html} onElementClick={onElementClick} />
      </div>
      <div className="buttons-area">
        <ConvertButton html={appStore.html} />
        <button className="convert-button txt-to-json-toggle" onClick={appStore.toggleTxtToJson}>
          {appStore.showTxtToJson ? 'Close Txt to JSON' : 'Txt to JSON'}
        </button>
      </div>
      {appStore.showTxtToJson && <TxtToJson onClose={appStore.toggleTxtToJson} isVisible={appStore.showTxtToJson} />}
      {isModalOpen && <AddLocaleModal onClose={closeAddLocaleModal} onSave={handleSaveLocale} />}
      
      <BrandConfigurator 
        isOpen={isConfiguratorOpen} 
        onSave={handleSaveBrand} 
        onCancel={toggleConfigurator} 
      />

      <div className={`brand-list-panel ${isBrandListOpen ? 'open' : ''}`}>
        <BrandList 
          brands={brands} 
          onDelete={handleDeleteBrand} 
          onApplyBrand={handleApplyBrand} 
          onRestoreOriginal={handleRestoreOriginal} 
        />
      </div>

      <button className="brand-list-toggle-button" onClick={toggleBrandList}>
        {isBrandListOpen ? 'Hide Brands' : 'Show Brands'}
      </button>
    </div>
  );
});

export default App;
