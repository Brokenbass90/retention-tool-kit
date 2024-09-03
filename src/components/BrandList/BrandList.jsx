import React from 'react';
import './BrandList.css';
import Button from '../Button/Button'; 

const BrandList = ({ brands, onDelete, onApplyBrand }) => {
  return (
    <div className="brand-list">
      <div className="brand-item">
        <Button className='buttons' onClick={() => onApplyBrand({ styles: {} })}>
          Original
        </Button>
      </div>
      {brands.length > 0 ? (
        brands.map((brand, index) => (
          <div key={index} className="brand-item">
            {brand.styles.logo_email_brand ? (
              <img src={brand.styles.logo_email_brand} alt={`${brand.brandName}`} className="brand-image" />
            ) : (
              <img src="https://via.placeholder.com/150" alt="placeholder" className="brand-image" />
            )}

            <Button className='buttons' onClick={() => onApplyBrand(brand)}>
              {brand.brandName}
            </Button>
            <Button className='buttons' onClick={() => onDelete(index)}>
              Delete
            </Button>
          </div>
        ))
      ) : (
        <p className='text-color'>No brands saved</p>
      )}
    </div>
  );
};

export default BrandList;
