const DB_NAME = 'MyAppDB';
const DB_VERSION = 1;
const STORE_NAME = 'settings';

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('Database error:', request.error);
      reject(request.error);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
  });
}
export async function deleteFolderSettings(folderName) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(folderName); // Убедитесь, что folderName правильно определён в вашем IndexedDB

      request.onerror = (event) => {
          console.error('Error deleting folder:', request.error);
          reject(request.error);
      };

      request.onsuccess = (event) => {
          console.log('Deleted folder:', folderName);
          resolve(request.result);
      };
  });
}

function prepareDataForStorage(data) {
  if (data === null || typeof data !== 'object') {
    return data;
  }
  if (Array.isArray(data)) {
    return data.map(prepareDataForStorage);
  }
  const cleanedData = {};
  Object.keys(data).forEach(key => {
    const value = data[key];
    if (typeof value !== 'function' && typeof value !== 'symbol' && !(value instanceof Element)) {
      cleanedData[key] = prepareDataForStorage(value);
    }
  });
  return cleanedData;
}

export async function getSettings() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get('mySettings');

    request.onerror = (event) => {
      console.error('Error fetching data:', request.error);
      reject(request.error);
    };

    request.onsuccess = (event) => {
      resolve(request.result);
    };
  });
}

export async function saveSettings(data) {
  const db = await openDB();
  const cleanData = prepareDataForStorage(data);



  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put({ ...cleanData, id: 'mySettings' });

    request.onerror = (event) => {
      console.error('Error saving data:', request.error);
      reject(request.error);
    };

    request.onsuccess = (event) => {
      resolve(request.result);
    };
  });
}

export async function deleteSettings() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete('mySettings');

    request.onerror = (event) => {
      console.error('Error deleting data:', request.error);
      reject(request.error);
    };

    request.onsuccess = (event) => {
      resolve(request.result);
    };
  });
}
