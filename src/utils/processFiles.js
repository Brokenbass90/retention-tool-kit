export async function processFiles(files) {
  const newFoldersData = {};

  for (const file of files) {
    if (!file.name.endsWith('.json')) {
      console.warn(`Пропущен не-JSON файл: ${file.name}`);
      continue;
    }

    const pathParts = file.webkitRelativePath.split('/');
    const folderName = pathParts[0].replace('-out', '');
    const localeName = pathParts[pathParts.length - 2];

    try {
      const content = await file.text();
      const jsonData = JSON.parse(content);
      if (!newFoldersData[folderName]) {
        newFoldersData[folderName] = {};
      }
      newFoldersData[folderName][localeName] = jsonData;
    } catch (error) {
      console.error(`Ошибка при обработке файла ${file.name}:`, error);
    }
  }
  return newFoldersData;
}
