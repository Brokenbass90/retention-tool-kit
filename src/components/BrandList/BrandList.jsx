import React from 'react';
import './BrandList.css';
import { appStore } from '../../stores/AppStore'; 
import { runInAction } from 'mobx';

const BrandList = ({ brands, onDelete, onApplyBrand }) => {

  const handleRestoreOriginalStyles = () => {
    runInAction(() => {
      // Очищаем текущие стили
      appStore.currentStyles = {};

      // Обновляем HTML с учетом текущего контента локали, но без стилей
      appStore.html = appStore.currentLocaleContent || appStore.originalHtml;
    });
  };

  return (
    <div className="brand-list">
      <div className="brand-item">
        <button className='blue-button' onClick={handleRestoreOriginalStyles}>
          Original Styles
        </button>
      </div>
      {brands.length > 0 ? (
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
              <button className='blue-button right-button' onClick={() => onDelete(index)}>
                ×
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className='text-color'>No brands saved</p>
      )}
    </div>
  );
};

export default BrandList;
