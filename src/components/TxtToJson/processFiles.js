import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export const processFiles = (files, folderName) => {
  return new Promise((resolve, reject) => {
    if (files.length === 0) {
      reject(new Error("No files selected"));
      return;
    }

    const jsonFileName = prompt("Enter a name for the JSON files:", folderName) || folderName;

    const outputName = jsonFileName.replace(/-out$/, '') + '-out';
    const zip = new JSZip();

    const fileReadPromises = Array.from(files).map(file => {
      return new Promise((resolveFile, rejectFile) => {
        const reader = new FileReader();

        reader.onload = function(e) {
          try {
            const content = e.target.result;

            const blocks = content.match(/\{\{(.+?)\}\}/g)?.reduce((acc, block, index) => {
              const key = `block_${String(index).padStart(2, '0')}`;
              let value = block.replace(/\{\{|\}\}/g, '').trim();
              value = value.replace(/@@(.*?)@@/g, '<b>$1</b>');
              acc[key] = value;
              return acc;
            }, {});

            const localeMatch = file.name.match(/_(\w{2})_\w{2}_/);
            const locale = localeMatch ? localeMatch[1] : 'unknown';
            const jsonContent = JSON.stringify(blocks ?? {}, null, 4);

            zip.folder(`${outputName}/${locale}`).file(`${jsonFileName}.json`, jsonContent);
            resolveFile();
          } catch (error) {
            rejectFile(new Error(`Failed to process file ${file.name}: ${error.message}`));
          }
        };

        reader.onerror = () => {
          rejectFile(new Error(`Failed to read file ${file.name}`));
        };

        reader.readAsText(file);
      });
    });

    Promise.all(fileReadPromises)
      .then(() => {
        zip.generateAsync({ type: "blob" })
          .then(content => {
            saveAs(content, `${outputName}.zip`);
            resolve();
          })
          .catch(error => {
            reject(new Error(`Failed to generate zip: ${error.message}`));
          });
      })
      .catch(reject);
  });
};
