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
import TemplateList from './components/TemplateList/TemplateList';
import { getSettings, saveSettings } from './utils/indexedDB';
import { runInAction } from 'mobx';
import { replacePlaceholders } from './utils/replacePlaceholders';

export const combineHtmlAndStyles = (htmlContent, styles) => {
  let updatedHtml = htmlContent;

  for (const [placeholder, value] of Object.entries(styles)) {
    const regex = new RegExp(`{%${placeholder}%}`, 'g');
    updatedHtml = updatedHtml.replace(regex, value || '');
  }

  return updatedHtml;
};

const App = observer(() => {
  const [buttonColors, setButtonColors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);
  const [brands, setBrands] = useState([]);
  const [brandToEdit, setBrandToEdit] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null); // Добавляем состояние для выбранного шаблона

  // eslint-disable-next-line
  const [currentBrand, setCurrentBrand] = useState(null);

  useEffect(() => {
    const loadInitialData = async () => {
      const savedHtml = await getSettings('html');
      if (savedHtml && savedHtml.html) {
        appStore.setHtml(savedHtml.html);
        appStore.setOriginalHtml(savedHtml.html);
      } else {
        appStore.setOriginalHtml(appStore.html);
      }
      fetchBrands();
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    const saveHtmlToIndexedDB = async () => {
      await saveSettings({ html: appStore.html }, 'html');
    };

    saveHtmlToIndexedDB();
    // eslint-disable-next-line
  }, [appStore.html]);

  const fetchBrands = async () => {
    try {
      const response = await fetch('/api/brands');
      const data = await response.json();
      setBrands(data.filter(brand => Object.keys(brand).length > 0));
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const handleSaveBrand = async () => {
    await fetchBrands();
    setIsConfiguratorOpen(false);
    setBrandToEdit(null);
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

  const handleLocaleSelection = (locale) => {
    let updatedHtml = appStore.originalHtml;

    Object.keys(appStore.foldersData).forEach(folderName => {
      if (appStore.foldersData[folderName][locale]) {
        updatedHtml = replacePlaceholders(updatedHtml, appStore.foldersData[folderName][locale], folderName);
      }
    });

    appStore.currentLocaleContent = updatedHtml;

    runInAction(() => {
      appStore.html = combineHtmlAndStyles(appStore.currentLocaleContent, appStore.currentStyles);
      appStore.selectedLocale = locale;
    });
  };

  const handleApplyBrand = (brand) => {
    const placeholders = {
      brand_color: brand.styles.brand_color,
      brand_additional_color: brand.styles.brand_additional_color,
      on_brand_color: brand.styles.on_brand_color,
      surface_color: brand.styles.surface_color,
      surface_variant_color: brand.styles.surface_variant_color,
      on_surface_color: brand.styles.on_surface_color,
      background_color: brand.styles.background_color,
      accent_color: brand.styles.accent_color,
      button_radius: brand.styles.button_radius,
      small_radius: brand.styles.small_radius,
      large_radius: brand.styles.large_radius,
      logo_email_brand: brand.styles.logo_email_brand,
      padding_l: brand.styles.padding_l,
      padding_m: brand.styles.padding_m,
      padding_s: brand.styles.padding_s,
      padding_xs: brand.styles.padding_xs,
    };

    appStore.currentStyles = placeholders;
    const contentToApply = appStore.currentLocaleContent || appStore.originalHtml;

    if (contentToApply) {
      runInAction(() => {
        appStore.html = combineHtmlAndStyles(contentToApply, appStore.currentStyles);
      });
    }

    setCurrentBrand(brand);
  };

  const handleEditBrand = (brand) => {
    setBrandToEdit(brand);
    setIsConfiguratorOpen(true);
  };

  const handleFolderClick = (folderName) => {
    const setButtonColor = (color) => {
      setButtonColors((prev) => ({ ...prev, [folderName]: color }));
    };
    appStore.handleFolderSelection(folderName, setButtonColor);
  };

  const handleApplyTemplate = (templateContent) => {
  console.log("Applying template:", templateContent);
  setSelectedTemplate(templateContent); // Используем только содержимое шаблона
};

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
            runInAction(() => {
              appStore.currentLocaleContent = appStore.originalHtml;
              appStore.html = combineHtmlAndStyles(appStore.currentLocaleContent, appStore.currentStyles);
              appStore.selectedLocale = '';
            });
          }}
        >
          Original Locales
        </button>

        {appStore.locales.map((locale) => (
          <div key={locale} className="locale-btn-container">
            <button
              onClick={() => {
                handleLocaleSelection(locale);
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

        <button className="original-btn" onClick={() => setIsModalOpen(true)}>+</button>
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
        <PdfMaker
          html={appStore.html}
          setHtml={appStore.setHtml.bind(appStore)}
          highlightedText={appStore.highlightedText}
          selectedTemplate={selectedTemplate} // Передаем выбранный шаблон
        />
        <HtmlWindow htmlContent={appStore.html} onElementClick={(text) => appStore.setHighlightedText(text)} />
      </div>
      <div className="buttons-area">
        <ConvertButton html={appStore.html} />
        <button className="convert-button txt-to-json-toggle" onClick={appStore.toggleTxtToJson}>
          {appStore.showTxtToJson ? 'Close Txt to JSON' : 'Txt to JSON'}
        </button>
      </div>
      {appStore.showTxtToJson && <TxtToJson onClose={appStore.toggleTxtToJson} isVisible={appStore.showTxtToJson} />}
      {isModalOpen && <AddLocaleModal onClose={() => setIsModalOpen(false)} onSave={(data) => appStore.addLocaleManually(data)} />}

      <BrandConfigurator
        isOpen={isConfiguratorOpen}
        onSave={handleSaveBrand}
        onCancel={() => {
          setIsConfiguratorOpen(false);
          setBrandToEdit(null);
        }}
        brandToEdit={brandToEdit}
      />

      <div className="brand-list-panel">
        <BrandList
          brands={brands}
          onDelete={handleDeleteBrand}
          onApplyBrand={handleApplyBrand}
          onEditBrand={handleEditBrand}
          toggleConfigurator={() => {
            setIsConfiguratorOpen(true);
            setBrandToEdit(null);
          }}
        />
      </div>

      {/* Передача функции для применения шаблона */}
      <TemplateList onApplyTemplate={handleApplyTemplate} />
    </div>
  );
});

export default App;
