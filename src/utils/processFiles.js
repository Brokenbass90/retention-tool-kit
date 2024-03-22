export const processFiles = async (files, setFoldersData) => {
  const newFoldersData = {};

  for (const file of files) {
    // Пропускаем не-JSON файлы
    if (!file.name.endsWith('.json')) {
      console.warn(`Пропущен не-JSON файл: ${file.name}`);
      continue;
    }

    // Получаем путь файла и разделяем его на части
    const pathParts = file.webkitRelativePath.split('/');
    // Первый элемент пути - это название папки
    const folderName = pathParts[0].replace('-out', ''); // Убираем '-out', если есть
    // Предпоследний элемент пути - это название локали
    const localeName = pathParts[pathParts.length - 2];

    try {
      // Читаем содержимое файла
      const content = await file.text();
      // Парсим JSON
      const jsonData = JSON.parse(content);

      // Если папка еще не добавлена в данные, инициализируем ее
      if (!newFoldersData[folderName]) {
        newFoldersData[folderName] = {};
      }

      // Добавляем данные локали в папку
      newFoldersData[folderName][localeName] = jsonData;

    } catch (error) {
      console.error(`Ошибка при обработке файла ${file.name}:`, error);
    }
  }

  // Обновляем состояние с данными папок
  setFoldersData(prevFoldersData => ({
    ...prevFoldersData,
    ...newFoldersData
  }));
};
