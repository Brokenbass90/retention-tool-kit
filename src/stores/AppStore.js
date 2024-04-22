// import { makeAutoObservable, runInAction } from "mobx";
// import { replacePlaceholders } from '../utils/replacePlaceholders'; 
// import { processFiles } from '../utils/processFiles';

// class AppStore {
//   originalHtml = '';
//   html = '';
//   htmlByLocale = {};
//   foldersData = {};
//   selectedFolder = null;
//   locales = [];
//   selectedLocale = '';
//   isOriginalSelected = true;
//   highlightedText = '';
//   showTxtToJson = false;

//   constructor() {
//     makeAutoObservable(this, {}, { autoBind: true });
//   }

//   setOriginalHtml(html) {
//     runInAction(() => {
//       this.originalHtml = html;
//       this.html = html;
//       this.updateHtmlForAllLocales(); 
//     });
//   }

//   async handleFilesUploaded(files) {
//     const newFoldersData = await processFiles(files);
//     runInAction(() => {
      
//       this.foldersData = { ...this.foldersData, ...newFoldersData };
//       this.updateLocales();
//       this.isOriginalSelected = true;
//       this.updateHtmlForAllLocales(); 
//     });
//   }
  
//   updateLocales() {
//     const allLocales = new Set();
//     Object.values(this.foldersData).forEach(folder => {
//       Object.keys(folder).forEach(locale => allLocales.add(locale));
//     });
//     runInAction(() => {
//       this.locales = Array.from(allLocales);
//     });
//   }

//   handleFolderSelection(folderName) {
//     runInAction(() => {
//       this.selectedFolder = folderName;
//       this.isOriginalSelected = false;
//       this.copyToClipboard(`$\{{ ${folderName}.block_00 }}$`);
//       this.updateHtmlForAllLocales(); 
//     });
//   }

//   handleLocaleSelection(locale) {
//     runInAction(() => {
//       this.selectedLocale = locale;
//       this.isOriginalSelected = false;
//       this.updateHtmlForLocale(locale); 
//     });
//   }

//   updateHtmlForLocale(locale) {
//     let updatedHtml = this.originalHtml;
//     Object.keys(this.foldersData).forEach(folderName => {
//       if (this.foldersData[folderName][locale]) {
//         updatedHtml = replacePlaceholders(updatedHtml, this.foldersData[folderName][locale], folderName);
//       }
//     });
//     runInAction(() => {
//       this.htmlByLocale[locale] = updatedHtml;
//       if (locale === this.selectedLocale) {
//         this.html = updatedHtml;
//       }
//     });
//   }

//   updateHtmlForAllLocales() {
//     Object.keys(this.htmlByLocale).forEach(locale => {
//       this.updateHtmlForLocale(locale);
//     });
//   }

//   resetLocale() {
//     runInAction(() => {
//       this.isOriginalSelected = true;
//       this.selectedLocale = '';
//       this.html = this.originalHtml;
//     });
//   }

//   setHighlightedText(text) {
//     runInAction(() => {
//       this.highlightedText = text;
//     });
//   }  

//   toggleTxtToJson() {
//     runInAction(() => {
//       this.showTxtToJson = !this.showTxtToJson;
//     });
//   }

  
//   copyToClipboard(text) {
//     navigator.clipboard.writeText(text).then(() => {
//     }).catch(err => {
//       console.error('Failed to copy text: ', err);
//     });
//   }
// }

// export const appStore = new AppStore();

import { makeAutoObservable, runInAction } from "mobx";
import { replacePlaceholders } from '../utils/replacePlaceholders';
import { processFiles } from '../utils/processFiles';
import { saveSettings, getSettings, deleteSettings } from '../utils/indexedDB'; // Импортируем новые функции

class AppStore {
  originalHtml = '';
  html = '';
  htmlByLocale = {};
  foldersData = {};
  selectedFolder = null;
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
    const data = await getSettings();
    if (data) {
      this.setAllData(data);
    }
  }

  setAllData(data) {
    runInAction(() => {
      this.originalHtml = data.html || '';
      this.foldersData = data.foldersData || {};
      this.updateLocales();
      this.selectedFolder = data.selectedFolder;
      this.selectedLocale = data.selectedLocale;
      this.isOriginalSelected = data.isOriginalSelected;
      this.highlightedText = data.highlightedText;
    });
  }

  async saveAllData() {
    await saveSettings({
      html: this.html,
      foldersData: this.foldersData,
      selectedFolder: this.selectedFolder,
      selectedLocale: this.selectedLocale,
      isOriginalSelected: this.isOriginalSelected,
      highlightedText: this.highlightedText
    });
  }

  async deleteFolder(folderName) {
    if (this.foldersData[folderName]) {
      delete this.foldersData[folderName];
      await deleteSettings(folderName); 
      this.updateLocales();
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

  async handleFilesUploaded(files) {
    const newFoldersData = await processFiles(files);
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

  handleFolderSelection(folderName) {
    runInAction(() => {
      this.selectedFolder = folderName;
      this.isOriginalSelected = false;
      this.copyToClipboard(`$\{{ ${folderName}.block_00 }}$`);
      this.updateHtmlForAllLocales();
    });
  }

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


