import { makeAutoObservable, runInAction } from "mobx";
import { replacePlaceholders } from '../utils/replacePlaceholders';
import { saveSettings, getSettings, deleteSettings } from '../utils/indexedDB'; 

class AppStore {
  originalHtml = '';
  html = '';
  currentLocaleContent = '';  
  currentStyles = {}; 
  htmlByLocale = {};
  foldersData = {};
  selectedFolder = 'defaultFolder';
  locales = [];
  selectedLocale = '';
  isOriginalSelected = true;
  highlightedText = '';
  showTxtToJson = false;
  editLocaleModalVisible = false;
  localeToEdit = null;
  tempHtml = null;
  hasUnsavedChanges = false;
  modifiedLocales = new Set();
  detachedLocales = new Set();

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    this.loadInitialData();
  }

  setHtml(html) {
    runInAction(() => {
      this.html = html;
      if (!this.isOriginalSelected) {
        this.hasUnsavedChanges = true;
      } else {
        this.originalHtml = html;
      }
    });
  }

  applyChanges() {
    runInAction(() => {
      if (!this.isOriginalSelected) {
        this.htmlByLocale[this.selectedLocale] = this.html;
        this.modifiedLocales.add(this.selectedLocale);
        this.hasUnsavedChanges = false;
        this.saveAllData();
      }
    });
  }

  discardChanges() {
    runInAction(() => {
      this.hasUnsavedChanges = false;
      this.updateHtmlForLocale(this.selectedLocale);
    });
  }

  resetLocaleToOriginal(locale) {
    runInAction(() => {
      if (this.modifiedLocales.has(locale)) {
        this.modifiedLocales.delete(locale);
        this.detachedLocales.delete(locale);
        delete this.htmlByLocale[locale];
        if (locale === this.selectedLocale) {
          this.updateHtmlForLocale(locale);
        }
        this.saveAllData();
      }
    });
  }

  handleLocaleSelection(locale) {
    if (this.hasUnsavedChanges) {
      // Возвращаем промис для обработки ответа пользователя в UI
      return new Promise((resolve) => {
        if (window.confirm('У вас есть несохраненные изменения. Сохранить перед переключением?')) {
          this.applyChanges();
        } else {
          this.discardChanges();
        }
        this._switchLocale(locale);
        resolve();
      });
    } else {
      this._switchLocale(locale);
      return Promise.resolve();
    }
  }

  _switchLocale(locale) {
    runInAction(() => {
      this.selectedLocale = locale;
      this.isOriginalSelected = false;
      this.updateHtmlForLocale(locale);
    });
  }

  openEditLocaleModal(locale) {
    this.localeToEdit = locale;
    this.editLocaleModalVisible = true;
  }

  closeEditLocaleModal() {
    this.localeToEdit = null;
    this.editLocaleModalVisible = false;
  }

  saveEditedLocale({ locale, keyName, content }) {
    runInAction(() => {
      if (!this.foldersData[keyName]) {
        this.foldersData[keyName] = {};
      }
      this.foldersData[keyName][locale] = content;

      this.updateLocales();
      this.updateHtmlForAllLocales();
      this.editLocaleModalVisible = false;
    });
  }

  async loadInitialData() {
    const data = await getSettings(this.selectedFolder);
    if (data) {
      this.setAllData(data);
    }
  }

  setAllData(data) {
    runInAction(() => {
      this.originalHtml = data.html || '';
      this.foldersData = data.foldersData || {};
      this.htmlByLocale = data.htmlByLocale || {};
      this.updateLocales();
      this.selectedFolder = data.selectedFolder || this.selectedFolder;
      this.selectedLocale = data.selectedLocale;
      this.isOriginalSelected = data.isOriginalSelected;
      this.highlightedText = data.highlightedText;
      this.modifiedLocales = new Set(data.modifiedLocales || []);
      this.detachedLocales = new Set(data.detachedLocales || []);
    });
  }

  async saveAllData() {
    if (!this.selectedFolder) {
      console.error('Selected folder is undefined or invalid');
      return;
    }
    await saveSettings({
      html: this.originalHtml,
      foldersData: this.foldersData,
      selectedLocale: this.selectedLocale,
      isOriginalSelected: this.isOriginalSelected,
      highlightedText: this.highlightedText,
      htmlByLocale: this.htmlByLocale,
      modifiedLocales: Array.from(this.modifiedLocales),
      detachedLocales: Array.from(this.detachedLocales)
    }, this.selectedFolder);
  }

  async deleteFolder(folderName) {
    if (this.foldersData[folderName]) {
      delete this.foldersData[folderName];
      await deleteSettings(folderName);
      this.updateLocales();
      this.saveAllData();
    }
  }

  setOriginalHtml(html) {
    runInAction(() => {
      this.originalHtml = html;
      if (this.isOriginalSelected) {
        this.html = html;
      }
    });
  }

  async handleFilesUploaded(newFoldersData) {
    runInAction(() => {
      this.foldersData = { ...this.foldersData, ...newFoldersData };
      this.updateLocales();
      this.isOriginalSelected = true;
      this.updateHtmlForAllLocales();
      this.saveAllData();
    });
  }

  updateLocales() {
    const allLocales = new Set();
    Object.values(this.foldersData).forEach(folder => {
      Object.keys(folder).forEach(locale => allLocales.add(locale));
    });
    
    let sortedLocales = Array.from(allLocales).sort();
    
    const enIndex = sortedLocales.indexOf('en');
    if (enIndex > -1) {
      sortedLocales.splice(enIndex, 1);
    }
    const ruIndex = sortedLocales.indexOf('ru');
    if (ruIndex > -1) {
      sortedLocales.splice(ruIndex, 1);
    }
    
    if (ruIndex > -1) {
      sortedLocales.unshift('ru');
    }
    if (enIndex > -1) {
      sortedLocales.unshift('en');
    }

    runInAction(() => {
      this.locales = sortedLocales;
    });
  }

  async copyToClipboardWithIndication(text, setButtonColor) {
    try {
      await navigator.clipboard.writeText(text);
      setButtonColor('#62d59075');
      setTimeout(() => setButtonColor(''), 700);
    } catch (err) {
      setButtonColor('#f826268c');
      setTimeout(() => setButtonColor(''), 700);
      console.error('Failed to copy text: ', err);
    }
  }

  handleFolderSelection(folderName, setButtonColor) {
    if (!folderName) {
      console.error('Attempted to select an undefined or invalid folder');
      return;
    }
    runInAction(() => {
      const text = `$\{{ ${folderName}.block_00 }}$`;
      this.copyToClipboardWithIndication(text, setButtonColor);
    });
  }

  updateHtmlForLocale(locale) {
    let updatedHtml = this.originalHtml;

    Object.keys(this.foldersData).forEach(folderName => {
      if (this.foldersData[folderName][locale]) {
        updatedHtml = replacePlaceholders(updatedHtml, this.foldersData[folderName][locale], folderName, locale);
      }
    });

    runInAction(() => {
      if (locale === '') {
        this.html = this.originalHtml;
        this.isOriginalSelected = true;
      } else {
        this.html = this.htmlByLocale[locale] || updatedHtml;
      }
      this.hasUnsavedChanges = false;
    });
  }

  updateHtmlForAllLocales() {
    Object.keys(this.htmlByLocale).forEach(locale => {
      this.updateHtmlForLocale(locale);
    });
  }

  resetLocale() {
    runInAction(() => {
      this.isOriginalSelected = true;
      this.selectedLocale = '';
      this.html = this.originalHtml;
      this.saveAllData();
    });
  }

  setHighlightedText(text) {
    runInAction(() => {
      this.highlightedText = text;
    });
  }

  toggleTxtToJson() {
    runInAction(() => {
      this.showTxtToJson = !this.showTxtToJson;
    });
  }

  copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      this.saveAllData();
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  }

  addLocaleManually({ locale, keyName, content }) {
    const blocks = content.match(/\{\{([\s\S]*?)\}\}/g) || [];
    const jsonContent = blocks.reduce((acc, block, index) => {
      const key = `block_${String(index).padStart(2, '0')}`;
      let value = block.replace(/\{\{|\}\}/g, '').trim();
      value = value.replace(/@@(.*?)@@/g, '<b>$1</b>'); 
      acc[key] = value || " ";
      return acc;
    }, {});
  
    runInAction(() => {
      if (!this.foldersData[keyName]) {
        this.foldersData[keyName] = {};
      }
      this.foldersData[keyName][locale] = jsonContent;
      this.updateLocales();
      this.updateHtmlForAllLocales();
      this.saveAllData();
    });
  }

  updateLocale({ locale, keyName, content }) {
    const blocks = content.match(/\{\{([\s\S]*?)\}\}/g) || [];
    const jsonContent = blocks.reduce((acc, block, index) => {
      const key = `block_${String(index).padStart(2, '0')}`;
      let value = block.replace(/\{\{|\}\}/g, '').trim();
      value = value.replace(/@@(.*?)@@/g, '<b>$1</b>');
      acc[key] = value || " ";
      return acc;
    }, {});

    runInAction(() => {
      if (!this.foldersData[keyName]) {
        this.foldersData[keyName] = {};
      }
      this.foldersData[keyName][locale] = jsonContent;
      this.modifiedLocales.add(locale);
      this.detachedLocales.add(locale);
      this.updateLocales();
      this.updateHtmlForAllLocales();
      this.saveAllData();
    });
  }

  getLocaleData(locale) {
    const data = { placeholders: {} };
    for (const key in this.foldersData) {
      if (this.foldersData[key][locale]) {
        data.placeholders[key] = this.foldersData[key][locale];
      }
    }
    return data;
  }
}

export const appStore = new AppStore();
