import React from 'react';

// Button component types
export interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

// FileUploader component types
export interface FileUploaderProps {
  onFilesUploaded: (files: Record<string, any>) => void;
}

export interface ProcessedFileData {
  [folderName: string]: {
    [localeName: string]: {
      [key: string]: string;
    };
  };
}

// ConvertButton component types
export interface ConvertButtonProps {
  html: string;
}

// ScreenshotButton component types
export interface ScreenshotButtonProps {
  html: string;
}

// Brand related types
export interface BrandStyles {
  [key: string]: string;
}

export interface Brand {
  brandName: string;
  styles: BrandStyles;
}

// Locale related types
export interface LocaleData {
  locale: string;
  keyName: string;
  content: string | Record<string, string>;
}

export interface AppStoreData {
  placeholders: {
    [key: string]: Record<string, string>;
  };
}

export interface AppStore {
  currentStyles: BrandStyles;
  html: string;
  currentLocaleContent: string | null;
  originalHtml: string;
  htmlByLocale: Record<string, string>;
  foldersData: Record<string, Record<string, any>>;
  selectedFolder: string;
  locales: string[];
  selectedLocale: string;
  isOriginalSelected: boolean;
  highlightedText: string;
  showTxtToJson: boolean;
  editLocaleModalVisible: boolean;
  localeToEdit: string | null;
  tempHtml: string | null;
  hasUnsavedChanges: boolean;
  modifiedLocales: Set<string>;
  getLocaleData: (locale: string) => AppStoreData;
}

// LocaleManager types
export interface LocaleManagerProps {
  locales: string[];
  onLocaleSelection: (locale: string) => void;
}

// Modal Props
export interface AddLocaleModalProps {
  onClose: () => void;
  onSave: (data: LocaleData) => void;
}

// EditLocaleModal types
export interface EditLocaleModalProps {
  onClose: () => void;
  onSave: (data: { 
    locale: string; 
    keyName: string; 
    content: Record<string, string>; 
  }) => void;
  locale: string;
}

// UploadTemplateModal types
export interface UploadTemplateModalProps {
  onClose: () => void;
  onSave: (template: { name: string; content: string }) => void;
}

// Template types
export interface Template {
  name: string;
  content: string;
}

// Component Props
export interface HtmlWindowProps {
  htmlContent: string;
  onElementClick: (text: string) => void;
}

export interface PdfMakerProps {
  html: string;
  setHtml: (html: string) => void;
  highlightedText: string;
  selectedTemplate: string | null;
}

export interface BrandConfiguratorProps {
  onCancel: () => void;
  isOpen: boolean;
  onSave: (brand: Brand) => void;
  brandToEdit: Brand | null;
}

export interface BrandListProps {
  brands: Brand[];
  onDelete: (index: number) => void;
  onApplyBrand: (brand: Brand) => void;
  onEditBrand: (brand: Brand) => void;
  toggleConfigurator: () => void;
  isConfiguratorOpen: boolean;
}

export interface TemplateListProps {
  onApplyTemplate: (template: string) => void;
}

export interface TxtToJsonProps {
  onClose: () => void;
  isVisible: boolean;
}

// LocaleContentManager types
export interface LocaleContent {
  [key: string]: string | number | { [key: string]: string | number };
}

export interface LocaleContentManagerProps {
  currentLocale: string;
  localesContent: {
    [locale: string]: LocaleContent;
  };
}

// Process Files types
export interface BlocksCount {
  [locale: string]: number;
}

export interface ProcessFilesResult {
  warnings: string[];
  blocksCount: BlocksCount;
}

// Folder related types
export interface FolderData {
  html: string;
  styles?: BrandStyles;
}

// JsonContentModal types
export interface JsonContentModalProps {
  isVisible: boolean;
  onClose: () => void;
  content: any;
}
