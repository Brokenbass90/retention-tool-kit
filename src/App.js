import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import PdfMaker from './components/PdfMaker/PdfMaker';
import HtmlWindow from './components/HtmlWindow/HtmlWindow';
import ConvertButton from './components/ConvertButton/ConvertButton';
import TxtToJson from './components/TxtToJson/TxtToJson';
import FileUploader from './components/FileUploader/FileUploader';
import { appStore } from './stores/AppStore';
import './App.css';
import AddLocaleModal from './components/AddLocaleModal/AddLocaleModal';
import EditLocaleModal from './components/EditLocaleModal/EditLocaleModal';
import BrandConfigurator from './components/BrandConfigurator/BrandConfigurator';
import BrandList from './components/BrandList/BrandList';
import TemplateList from './components/TemplateList/TemplateList';
// import LocaleManager from './components/LocaleManager/LocaleManager';
import { getSettings, saveSettings } from './utils/indexedDB';
import { runInAction } from 'mobx';
import { replacePlaceholders } from './utils/replacePlaceholders';
import './components/BottomPanels/BottomPanels.css';

export const combineHtmlAndStyles = (htmlContent, styles) => {
  let updatedHtml = htmlContent;

  for (const [placeholder, value] of Object.entries(styles)) {
    const regex = new RegExp(`{%${placeholder}%}`, 'g');
    updatedHtml = updatedHtml.replace(regex, value || '');
  }

  return updatedHtml;
};


const App = observer(() => {
  const [isTemplatePanelOpen, setTemplatePanelOpen] = useState(false);
  const [isBrandPanelOpen, setBrandPanelOpen] = useState(false);
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
        updatedHtml = replacePlaceholders(updatedHtml, appStore.foldersData[folderName][locale], folderName, locale);
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
      ref_color: brand.styles.ref_color,
      left_border_color: brand.styles.left_border_color,
      logo_width: brand.styles.logo_width,
      position: brand.styles.position,
      border_ramka: brand.styles.border_ramka,
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
  // console.log("Applying template:", templateContent);
  setSelectedTemplate(templateContent); 
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
              appStore.selectedLocale = '';
              appStore.updateHtmlForLocale('');
            });
          }}
        >
          Original Locales
        </button>

        {appStore.locales.map((locale) => (
          <div key={locale} className="locale-btn-container">
            <button
              onClick={() => {
                appStore.handleLocaleSelection(locale);
              }}
              className={`locale-btn ${appStore.selectedLocale === locale && !appStore.isOriginalSelected ? 'selected' : ''}`}
            >
              {locale}
              {appStore.modifiedLocales.has(locale) && (
                <span className="modified-indicator" title="Локаль изменена">
                  🔒
                </span>
              )}
            </button>
            
              {appStore.modifiedLocales.has(locale) && (
                <button
                  className="reset-locale-btn"
                  onClick={() => {
                    if (window.confirm(`Сбросить локаль "${locale}" к состоянию нулевой локали? Это действие нельзя отменить.`)) {
                      appStore.resetLocaleToOriginal(locale);
                    }
                  }}
                  title="Сбросить к нулевой локали"
                >
                  🔄
                </button>
              )}
              <div className="locale-actions">
              <button
                className="edit-locale-btn border-radius-righ" 
                onClick={() => appStore.openEditLocaleModal(locale)}
                title="Редактировать локаль"
              >
                ✎
              </button>
            </div>
          </div>
        ))}

        <button className="original-btn" onClick={() => setIsModalOpen(true)}>+</button>
      </div>

      {appStore.hasUnsavedChanges && !appStore.isOriginalSelected && (
        <div className="changes-toolbar">
          <button
            className="apply-changes-btn"
            onClick={() => appStore.applyChanges()}
          >
            Сохранить изменения
          </button>
          <button
            className="discard-changes-btn"
            onClick={() => appStore.discardChanges()}
          >
            Отменить изменения
          </button>
        </div>
      )}

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
      <button className="convert-button txt-to-json-toggle" onClick={() => setTemplatePanelOpen(true)}>Templates</button>
        <button className="convert-button txt-to-json-toggle" onClick={() => setBrandPanelOpen(true)}>Brands</button>
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

      <TemplateList
        isOpen={isTemplatePanelOpen}
        onClose={() => setTemplatePanelOpen(false)}
        onApplyTemplate={handleApplyTemplate}
      />

      <BrandList 
        isOpen={isBrandPanelOpen} 
        onClose={() => setBrandPanelOpen(false)}
        brands={brands} 
        onApplyBrand={handleApplyBrand}
        onEditBrand={handleEditBrand}
        onDelete={handleDeleteBrand}
        toggleConfigurator={() => setIsConfiguratorOpen(true)}
      />

    </div>
  );
});

export default App;
