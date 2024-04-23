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

export async function getSettings(folderId = 'mySettings') {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(folderId);
    request.onerror = (event) => {
      console.error('Error fetching data:', request.error);
      reject(request.error);
    };
    request.onsuccess = (event) => {
      resolve(request.result);
    };
  });
}

export async function saveSettings(data, folderId = 'defaultFolder') {
  if (!folderId) {
      console.error("Folder ID is undefined or invalid");
      return;
  }

  const db = await openDB();
  const cleanData = prepareDataForStorage(data);

  return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      // Обеспечение наличия id в данных, отправляемых в базу данных
      const request = store.put({ ...cleanData, id: folderId });

      request.onerror = (event) => {
          console.error('Error saving data:', request.error);
          reject(request.error);
      };

      request.onsuccess = (event) => {

          resolve(request.result);
      };
  });
}


export async function deleteSettings(folderId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(folderId);
    request.onerror = (event) => {
      console.error('Error deleting data:', request.error);
      reject(request.error);
    };
    request.onsuccess = (event) => {
      resolve(request.result);
    };
  });
}
