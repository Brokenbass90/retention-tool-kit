import { makeAutoObservable, runInAction } from "mobx";
import { replacePlaceholders } from '../utils/replacePlaceholders';
import { saveSettings, getSettings, deleteSettings } from '../utils/indexedDB'; 

class AppStore {
  originalHtml = '';
  html = '';
  htmlByLocale = {};
  foldersData = {};
  selectedFolder = 'defaultFolder';
  locales = [];
  selectedLocale = '';
  isOriginalSelected = true;
  highlightedText = '';
  showTxtToJson = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    this.loadInitialData();
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
      this.updateLocales();
      this.selectedFolder = data.selectedFolder || this.selectedFolder;
      this.selectedLocale = data.selectedLocale;
      this.isOriginalSelected = data.isOriginalSelected;
      this.highlightedText = data.highlightedText;
    });
  }

  async saveAllData() {
    if (!this.selectedFolder) {
      console.error('Selected folder is undefined or invalid');
      return;
    }
    await saveSettings({
      html: this.html,
      foldersData: this.foldersData,
      selectedLocale: this.selectedLocale,
      isOriginalSelected: this.isOriginalSelected,
      highlightedText: this.highlightedText
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
      this.html = html;
      this.updateHtmlForAllLocales();
      this.saveAllData();
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
    runInAction(() => {
      this.locales = Array.from(allLocales);
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
  // handleFolderSelection(folderName) {
  //   if (!folderName) {
  //     console.error('Attempted to select an undefined or invalid folder');
  //     return;
  //   }
  //   runInAction(() => {
  //     this.copyToClipboard(`$\{{ ${folderName}.block_00 }}$`);
  //   });
  // }

  handleLocaleSelection(locale) {
    runInAction(() => {
      this.selectedLocale = locale;
      this.isOriginalSelected = false;
      this.updateHtmlForLocale(locale);
    });
  }

  updateHtmlForLocale(locale) {
    let updatedHtml = this.originalHtml;
    Object.keys(this.foldersData).forEach(folderName => {
      if (this.foldersData[folderName][locale]) {
        updatedHtml = replacePlaceholders(updatedHtml, this.foldersData[folderName][locale], folderName);
      }
    });
    runInAction(() => {
      this.htmlByLocale[locale] = updatedHtml;
      if (locale === this.selectedLocale) {
        this.html = updatedHtml;
      }
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
}

export const appStore = new AppStore();
