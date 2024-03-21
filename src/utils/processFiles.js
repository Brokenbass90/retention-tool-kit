export const processFiles = async (files, setLocales, setLocalesContent) => {
  const localesSet = new Set();
  const contentMap = {};

  const readFile = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = JSON.parse(e.target.result);
        const pathParts = file.webkitRelativePath.split('/');
        const locale = pathParts[pathParts.length - 2];
        localesSet.add(locale);

        if (!contentMap[locale]) {
          contentMap[locale] = {};
        }

        const key = file.name.split('.').slice(0, -1).join('.');
        contentMap[locale][key] = content;

        resolve();
      } catch (error) {
        console.error('Ошибка при разборе JSON:', error);
        reject(error);
      }
    };

    reader.onerror = (error) => {
      console.error('Ошибка при чтении файла:', error);
      reject(error);
    };

    reader.readAsText(file);
  });

  const promises = Array.from(files).filter(file => file.name.endsWith('.json')).map(readFile);
  await Promise.all(promises);

  setLocales([...localesSet]);
  setLocalesContent(contentMap);
};
