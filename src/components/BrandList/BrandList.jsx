import React, { useState } from 'react';
import './BrandList.css';
import { appStore } from '../../stores/AppStore'; 
import { runInAction } from 'mobx';

const BrandList = ({ brands, onDelete, onApplyBrand, toggleConfigurator, isConfiguratorOpen, onEditBrand }) => {
  const [isBrandListOpen, setIsBrandListOpen] = useState(false);

  const handleRestoreOriginalStyles = () => {
    runInAction(() => {
      appStore.currentStyles = {};
      appStore.html = appStore.currentLocaleContent || appStore.originalHtml;
    });
  };

  const toggleBrandList = () => {
    setIsBrandListOpen(!isBrandListOpen);
  };

  return (
    <div className={`brand-list-panel ${isBrandListOpen ? 'open' : ''}`}>
    <div className='scroll'>
      <button className="brand-list-toggle-button" onClick={toggleBrandList}>
        {isBrandListOpen ? 'Hide Brands' : 'Show Brands'}
      </button>

      <div className="brand-item">
        <button className='blue-button' onClick={handleRestoreOriginalStyles}>
          Original Styles
        </button>
      </div>

      {isBrandListOpen && brands.length > 0 ? (
        brands.map((brand, index) => (
          <div key={index} className="brand-item">
            <div className='brends-logo'>
              {brand.styles.logo_email_brand ? (
                <img src={brand.styles.logo_email_brand} alt={`${brand.brandName}`} className="brand-image" />
              ) : (
                <img src="https://via.placeholder.com/150" alt="placeholder" className="brand-image" />
              )}
            </div>
            <div className='brends-buttons'>
              <button className='blue-button left-button' onClick={() => onApplyBrand(brand)}>
                {brand.brandName}
              </button>
              <button className='blue-button middle-button' onClick={() => onEditBrand(brand)}>
                Copy
              </button>
              <button className='blue-button right-button' onClick={() => onDelete(index)}>
                ×
              </button>
            </div>
          </div>
        ))
      ) : (
        isBrandListOpen && <p className='text-color'>No brands saved</p>
      )}

      <button className="configurator-toggle-button" onClick={toggleConfigurator}>
        {isConfiguratorOpen ? 'Close' : 'Create new brand'}
      </button>
      </div>
    </div>
  );
};

export default BrandList;
