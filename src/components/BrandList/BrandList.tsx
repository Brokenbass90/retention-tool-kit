// import React, { useState } from 'react';
// import { BrandListProps, Brand, BrandStyles } from '../../types';
// import ConfirmDeleteModal from '../ConfirmDeleteModal/ConfirmDeleteModal';
// import './BrandList.css';
// import { appStore } from '../../stores/AppStore'; 
// import { runInAction } from 'mobx';

// interface BrandToDelete {
//   brand: Brand;
//   index: number;
// }

// const BrandList: React.FC<BrandListProps> = ({ 
//   brands, 
//   onDelete, 
//   onApplyBrand, 
//   toggleConfigurator, 
//   isConfiguratorOpen, 
//   onEditBrand 
// }) => {
//   const [isBrandListOpen, setIsBrandListOpen] = useState<boolean>(false);
//   const [brandToDelete, setBrandToDelete] = useState<BrandToDelete | null>(null);
//   const [searchQuery, setSearchQuery] = useState<string>('');

//   const handleRestoreOriginalStyles = () => {
//     runInAction(() => {
//       appStore.currentStyles = {};
//       appStore.html = appStore.currentLocaleContent || appStore.originalHtml;
//     });
//   };

//   const toggleBrandList = () => {
//     setIsBrandListOpen(!isBrandListOpen);
//   };

//   const handleDeleteClick = (brand: Brand, index: number) => {
//     setBrandToDelete({ brand, index });
//   };

//   const handleConfirmDelete = () => {
//     if (brandToDelete) {
//       onDelete(brandToDelete.index);
//       setBrandToDelete(null);
//     }
//   };

//   const filteredBrands = brands.filter(brand =>
//     brand.brandName.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className={`brand-list-panel ${isBrandListOpen ? 'open' : ''}`}>
//       <div className='scroll'>
//         <button className="brand-list-toggle-button" onClick={toggleBrandList}>
//           {isBrandListOpen ? 'Hide Brands' : 'Show Brands'}
//         </button>

//         {isBrandListOpen && (
//           <input
//             type="text"
//             placeholder="Search brands..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="search-input"
//           />
//         )}

//         <div className="brand-item">
//           <button className='blue-button' onClick={handleRestoreOriginalStyles}>
//             Original Styles
//           </button>
//         </div>

//         {isBrandListOpen && filteredBrands.length > 0 ? (
//           filteredBrands.map((brand, index) => (
//             <div key={index} className="brand-item">
//               <div className='brends-logo'>
//                 {brand.styles.logo_email_brand ? (
//                   <img src={brand.styles.logo_email_brand} alt={`${brand.brandName}`} className="brand-image" />
//                 ) : (
//                   <img src="https://via.placeholder.com/150" alt="placeholder" className="brand-image" />
//                 )}
//               </div>
//               <div className='brends-buttons'>
//                 <button className='blue-button left-button' onClick={() => onApplyBrand(brand)}>
//                   {brand.brandName}
//                 </button>
//                 <button className='blue-button middle-button' onClick={() => onEditBrand(brand)}>
//                   Edit
//                 </button>
//                 <button className='blue-button right-button' onClick={() => handleDeleteClick(brand, index)}>
//                   ×
//                 </button>
//               </div>
//             </div>
//           ))
//         ) : (
//           isBrandListOpen && <p className='text-color'>No brands saved</p>
//         )}

//         <button className="configurator-toggle-button" onClick={toggleConfigurator}>
//           {isConfiguratorOpen ? 'Close' : 'Create new brand'}
//         </button>
//       </div>

//       {brandToDelete && (
//         <ConfirmDeleteModal
//           message={`Are you sure you want to delete the brand "${brandToDelete.brand.brandName}"?`}
//           onClose={() => setBrandToDelete(null)}
//           onConfirm={handleConfirmDelete}
//         />
//       )}
//     </div>
//   );
// };

// export default BrandList;
import React, { useState } from 'react';
import { BrandListProps } from '../../types';

const BrandList: React.FC<BrandListProps & { isOpen: boolean; onClose: () => void }> = ({ brands, onApplyBrand, onEditBrand, onDelete, toggleConfigurator, isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const filteredBrands = brands.filter((b) => b.brandName.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className={`bottom-panel ${isOpen ? 'open' : ''}`}>
      <button className="close-btn-panel" onClick={onClose}>×</button>
      <input
        className="search-input"
        placeholder="Search brands..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="panel-content">
        {filteredBrands.map((brand, i) => (
          <div key={i} className="panel-item">
            <img src={brand.styles.logo_email_brand || 'https://via.placeholder.com/150'} alt={brand.brandName} style={{width:'100%',height:'60%'}} />
            <button onClick={()=>onApplyBrand(brand)}>{brand.brandName}</button>
            <button onClick={()=>onEditBrand(brand)}>Edit</button>
            <button onClick={()=>onDelete(i)}>Delete</button>
          </div>
        ))}
      </div>
      <button style={{marginTop: '10px'}} onClick={toggleConfigurator}>Create new brand</button>
    </div>
  );
};

export default BrandList;
