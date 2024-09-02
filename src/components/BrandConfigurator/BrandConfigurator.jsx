import React from 'react';
import './BrandConfigurator.css';

const BrandConfigurator = ({ onSave, onCancel, isOpen }) => {
  const [brandName, setBrandName] = React.useState('');
  const [logoUrl, setLogoUrl] = React.useState('');
  const [primaryColor, setPrimaryColor] = React.useState('');
  const [secondaryColor, setSecondaryColor] = React.useState('');
  const [textColor, setTextColor] = React.useState('');
  const [borderRadius, setBorderRadius] = React.useState('px');

  const handleSave = () => {
    onSave({
      brandName,
      logoUrl,
      primaryColor,
      secondaryColor,
      textColor,
      borderRadius,
    });
  };

  return (
    <div className={`brand-configurator-container ${isOpen ? 'open' : ''}`}>
      <div className="brand-configurator">
        <h2>Brand Configurator</h2>
        <input
          type="text"
          placeholder="Brand Name"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Logo URL"
          value={logoUrl}
          onChange={(e) => setLogoUrl(e.target.value)}
        />
        <input
          type="text"
          placeholder="Primary Color (Hex)"
          value={primaryColor}
          onChange={(e) => setPrimaryColor(e.target.value)}
        />
        <input
          type="text"
          placeholder="Secondary Color (Hex)"
          value={secondaryColor}
          onChange={(e) => setSecondaryColor(e.target.value)}
        />
        <input
          type="text"
          placeholder="Text Color (Hex)"
          value={textColor}
          onChange={(e) => setTextColor(e.target.value)}
        />
        <input
          type="text"
          placeholder="Border Radius (e.g., 5px)"
          value={borderRadius}
          onChange={(e) => setBorderRadius(e.target.value)}
        />
        <button onClick={handleSave}>Save</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default BrandConfigurator;
