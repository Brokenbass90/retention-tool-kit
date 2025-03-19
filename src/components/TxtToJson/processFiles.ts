import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { ProcessFilesResult, BlocksCount } from '../../types';

interface JsonContent {
  [key: string]: string;
}

export const processFiles = (files: FileList | File[], folderName: string): Promise<ProcessFilesResult> => {
  return new Promise((resolve, reject) => {
    if (files.length === 0) {
      reject(new Error("No files selected"));
      return;
    }

    const warnings: string[] = [];
    const blocksCount: BlocksCount = {};
    const zip = new JSZip();

    const localeRegex = /_?([a-z]{2}(-[A-Z]{2})?)[_.]/;

    const jsonFileName = prompt("Enter a name for the JSON files:", folderName) || folderName;

    const processFile = (file: File): Promise<void> => {
      return new Promise((resolveFile, rejectFile) => {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          const content = e.target?.result as string;
          const blocks = content.match(/\{\{([\s\S]*?)\}\}/g) || [];
          const localeMatch = file.name.match(localeRegex);
          const locale = localeMatch ? localeMatch[1] : 'unknown';

          blocks.forEach((block, index) => {
            if (!block.startsWith('{{') || !block.endsWith('}}')) {
              warnings.push(`Missing '{{' or '}}' in file ${file.name} at block ${index + 1}`);
              return;
            }
            if (block.includes('@@') && block.match(/@@/g)!.length % 2 !== 0) {
              warnings.push(`Missing '@' in file ${file.name} at block ${index + 1}`);
              return;
            }
          });

          blocksCount[locale] = (blocksCount[locale] || 0) + blocks.length;

          const jsonContent = blocks.reduce<JsonContent>((acc, block, index) => {
            const key = `block_${String(index).padStart(2, '0')}`;
            if (block === '{{}}') {
              acc[key] = " ";
            } else {
              let value = block.replace(/\{\{|\}\}/g, '').trim().replace(/@@(.*?)@@/g, '<b>$1</b>');
              acc[key] = value || " ";
            }
            return acc;
          }, {});

          zip.folder(locale)!.file(`${jsonFileName}.json`, JSON.stringify(jsonContent, null, 4));
          resolveFile();
        };
        reader.onerror = () => rejectFile(new Error(`Failed to read file ${file.name}`));
        reader.readAsText(file);
      });
    };

    Promise.all(Array.from(files).map(processFile))
      .then(() => {
        zip.generateAsync({ type: 'blob' })
          .then((content) => {
            saveAs(content, `${folderName}-out.zip`);
            resolve({ warnings, blocksCount });
          })
          .catch(error => reject(new Error(`Failed to generate zip: ${error.message}`)));
      })
      .catch(reject);
  });
};
