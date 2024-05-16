import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export const processFiles = (files, folderName) => {
  return new Promise((resolve, reject) => {
    if (files.length === 0) {
      reject(new Error("No files selected"));
      return;
    }

    let warnings = [];
    let blocksCount = {};
    const zip = new JSZip();

    const localeRegex = /_?([a-z]{2}(-[A-Z]{2})?)[_.]/;

    const jsonFileName = prompt("Enter a name for the JSON files:", folderName) || folderName;

    const processFile = (file) => {
      return new Promise((resolveFile, rejectFile) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target.result;
          const blocks = content.match(/\{\{([\s\S]*?)\}\}/g) || [];
          const localeMatch = file.name.match(localeRegex);
          const locale = localeMatch ? localeMatch[1] : 'unknown';

          blocks.forEach((block, index) => {
            if (!block.startsWith('{{') || !block.endsWith('}}')) {
              warnings.push(`Missing '{{' or '}}' in file ${file.name} at block ${index + 1}`);
              return; // Пропускаем этот блок
            }
            if (block.includes('@@') && block.match(/@@/g).length % 2 !== 0) {
              warnings.push(`Missing '@' in file ${file.name} at block ${index + 1}`);
              return; 
            }
          });

          blocksCount[locale] = (blocksCount[locale] || 0) + blocks.length;

          const jsonContent = blocks.reduce((acc, block, index) => {
            const key = `block_${String(index).padStart(2, '0')}`;
            if (block === '{{}}') {
              acc[key] = " "; // Вставляем пробел для пустых блоков
            } else {
              let value = block.replace(/\{\{|\}\}/g, '').trim().replace(/@@(.*?)@@/g, '<b>$1</b>');
              acc[key] = value || " "; 
            }
            return acc;
          }, {});

          zip.folder(locale).file(`${jsonFileName}.json`, JSON.stringify(jsonContent, null, 4));
          resolveFile();
        };
        reader.onerror = () => rejectFile(new Error(`Failed to read file ${file.name}`));
        reader.readAsText(file);
      });
    };

    Promise.all(Array.from(files).map(processFile)).then(() => {
      zip.generateAsync({ type: 'blob' }).then((content) => {
        saveAs(content, `${folderName}-out.zip`);
        resolve({ warnings, blocksCount });
      }).catch(error => reject(new Error(`Failed to generate zip: ${error.message}`)));
    }).catch(reject);
  });
};
