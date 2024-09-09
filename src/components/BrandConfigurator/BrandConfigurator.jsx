import React, { useState, useEffect } from 'react';
import './BrandConfigurator.css';

const BrandConfigurator = ({ onCancel, isOpen, onSave, brandToEdit }) => {
  const [brandName, setBrandName] = useState('');
  const [brandColor, setBrandColor] = useState('');
  const [brandAdditionalColor, setBrandAdditionalColor] = useState('');
  const [onBrandColor, setOnBrandColor] = useState('');
  const [surfaceColor, setSurfaceColor] = useState('');
  const [surfaceVariantColor, setSurfaceVariantColor] = useState('');
  const [onSurfaceColor, setOnSurfaceColor] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('');
  const [accentColor, setAccentColor] = useState('');
  const [buttonRadius, setButtonRadius] = useState('');
  const [smallRadius, setSmallRadius] = useState('');
  const [largeRadius, setLargeRadius] = useState('');
  const [logoEmailBrand, setLogoEmailBrand] = useState('');
  const [paddingL, setPaddingL] = useState('');
  const [paddingM, setPaddingM] = useState('');
  const [paddingS, setPaddingS] = useState('');
  const [paddingXs, setPaddingXs] = useState('');
  const [refColor, setRefColor] = useState('');
  const [leftBorderColor, setLeftBorderColor] = useState('');
  const [logoWidth, setLogoWidth] = useState('');
  const [position, setPosition] = useState('');
  const [borderRamka, setBorderRamka] = useState('');

  useEffect(() => {
    if (brandToEdit) {
      setBrandName(brandToEdit.brandName);
      setBrandColor(brandToEdit.styles.brand_color || '');
      setBrandAdditionalColor(brandToEdit.styles.brand_additional_color || '');
      setOnBrandColor(brandToEdit.styles.on_brand_color || '');
      setSurfaceColor(brandToEdit.styles.surface_color || '');
      setSurfaceVariantColor(brandToEdit.styles.surface_variant_color || '');
      setOnSurfaceColor(brandToEdit.styles.on_surface_color || '');
      setBackgroundColor(brandToEdit.styles.background_color || '');
      setAccentColor(brandToEdit.styles.accent_color || '');
      setButtonRadius(brandToEdit.styles.button_radius || '');
      setSmallRadius(brandToEdit.styles.small_radius || '');
      setLargeRadius(brandToEdit.styles.large_radius || '');
      setLogoEmailBrand(brandToEdit.styles.logo_email_brand || '');
      setPaddingL(brandToEdit.styles.padding_l || '');
      setPaddingM(brandToEdit.styles.padding_m || '');
      setPaddingS(brandToEdit.styles.padding_s || '');
      setPaddingXs(brandToEdit.styles.padding_xs || '');
      setRefColor(brandToEdit.styles.ref_color || '');
      setLeftBorderColor(brandToEdit.styles.left_border_color || '');
      setLogoWidth(brandToEdit.styles.logo_width || '');
      setPosition(brandToEdit.styles.position || '');
      setBorderRamka(brandToEdit.styles.border_ramka || '');
    } else {
      clearFields();
    }
  }, [brandToEdit]);

  const clearFields = () => {
    setBrandName('');
    setBrandColor('');
    setBrandAdditionalColor('');
    setOnBrandColor('');
    setSurfaceColor('');
    setSurfaceVariantColor('');
    setOnSurfaceColor('');
    setBackgroundColor('');
    setAccentColor('');
    setButtonRadius('');
    setSmallRadius('');
    setLargeRadius('');
    setLogoEmailBrand('');
    setPaddingL('');
    setPaddingM('');
    setPaddingS('');
    setPaddingXs('');
    setRefColor('');
    setLeftBorderColor('');
    setLogoWidth('');
    setPosition('');
    setBorderRamka('');

  };

  const handleSave = async () => {
    if (!brandName.trim() || !brandColor.trim()) {
      console.error('Brand name and color are required');
      return;
    }
  
    const brandData = {
      brandName,
      styles: {
        brand_color: brandColor,
        brand_additional_color: brandAdditionalColor,
        on_brand_color: onBrandColor,
        surface_color: surfaceColor,
        surface_variant_color: surfaceVariantColor,
        on_surface_color: onSurfaceColor,
        background_color: backgroundColor,
        accent_color: accentColor,
        button_radius: buttonRadius,
        small_radius: smallRadius,
        large_radius: largeRadius,
        logo_email_brand: logoEmailBrand,
        padding_l: paddingL,
        padding_m: paddingM,
        padding_s: paddingS,
        padding_xs: paddingXs,
        ref_color: refColor,
        left_border_color: leftBorderColor,
        logo_width: logoWidth,
        position: position,
        border_ramka: borderRamka,
      },
    };
  
    try {
      const response = await fetch('/api/brands', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(brandData),
      });
  
      if (response.ok) {
        onSave();
        clearFields();
      } else {
        console.error('Failed to save brand');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className={`brand-configurator-container ${isOpen ? 'open' : ''}`}>
      <div className="brand-configurator">
        <h2>{brandToEdit ? 'Edit Brand' : 'Create Brand'}</h2>
        <div className="input-group">
        <input
            type="text"
            placeholder="Logo URL"
            value={logoEmailBrand}
            onChange={(e) => setLogoEmailBrand(e.target.value)}
          />
          <input
            type="text"
            placeholder="Logo Width"
            value={logoWidth}
            onChange={(e) => setLogoWidth(e.target.value)}
          />
          <input
            type="text"
            placeholder="Position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
          <input
            type="text"
            placeholder="Brand Name"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Brand Color"
            value={brandColor}
            onChange={(e) => setBrandColor(e.target.value)}
          />
          <input
            type="text"
            placeholder="Additional Brand Color"
            value={brandAdditionalColor}
            onChange={(e) => setBrandAdditionalColor(e.target.value)}
          />
          <input
            type="text"
            placeholder="On Brand Color"
            value={onBrandColor}
            onChange={(e) => setOnBrandColor(e.target.value)}
          />
          <input
            type="text"
            placeholder="Surface Color"
            value={surfaceColor}
            onChange={(e) => setSurfaceColor(e.target.value)}
          />
          <input
            type="text"
            placeholder="Surface Variant Color"
            value={surfaceVariantColor}
            onChange={(e) => setSurfaceVariantColor(e.target.value)}
          />
          <input
            type="text"
            placeholder="On Surface Color"
            value={onSurfaceColor}
            onChange={(e) => setOnSurfaceColor(e.target.value)}
          />
          <input
            type="text"
            placeholder="Background Color"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
          />
          <input
            type="text"
            placeholder="Accent Color"
            value={accentColor}
            onChange={(e) => setAccentColor(e.target.value)}
          />
          <input
            type="text"
            placeholder="Button Radius"
            value={buttonRadius}
            onChange={(e) => setButtonRadius(e.target.value)}
          />
          <input
            type="text"
            placeholder="Small Radius"
            value={smallRadius}
            onChange={(e) => setSmallRadius(e.target.value)}
          />
          <input
            type="text"
            placeholder="Large Radius"
            value={largeRadius}
            onChange={(e) => setLargeRadius(e.target.value)}
          />
          <input
            type="text"
            placeholder="Padding L"
            value={paddingL}
            onChange={(e) => setPaddingL(e.target.value)}
          />
          <input
            type="text"
            placeholder="Padding M"
            value={paddingM}
            onChange={(e) => setPaddingM(e.target.value)}
          />
          <input
            type="text"
            placeholder="Padding S"
            value={paddingS}
            onChange={(e) => setPaddingS(e.target.value)}
          />
          <input
            type="text"
            placeholder="Padding XS"
            value={paddingXs}
            onChange={(e) => setPaddingXs(e.target.value)}
          />
          <input
            type="text"
            placeholder="ref color"
            value={refColor}
            onChange={(e) => setRefColor(e.target.value)}
          />
          <input
            type="text"
            placeholder="left border color"
            value={leftBorderColor}
            onChange={(e) => setLeftBorderColor(e.target.value)}
          />
          <input
            type="text"
            placeholder="Border Ramka"
            value={borderRamka}
            onChange={(e) => setBorderRamka(e.target.value)}
          />
        </div>
        <button onClick={handleSave}>{brandToEdit ? 'Save Changes' : 'Save'}</button>
        <button onClick={() => {
          onCancel();
          clearFields();
        }}>Cancel</button>
      </div>
    </div>
  );
};

export default BrandConfigurator;
