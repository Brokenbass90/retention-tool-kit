import { translations } from './translations';

export function replacePlaceholders(htmlTemplate, localeData, folderName, locale) {
  let resultHtml = htmlTemplate;
  const placeholderPattern = new RegExp(`\\$\\{\\{\\s*${folderName}\\.\\s*([\\w-]+)\\s*\\}\\}\\$`, 'g');

  resultHtml = resultHtml.replace(placeholderPattern, (match, key) => {
    const replacement = localeData && localeData[key] ? localeData[key] : match;
    return replacement;
  });

  // Применение переводов для footer.block_00 и footer.block_01
  const footerKeys = ["footer.block_00", "footer.block_01"];
  footerKeys.forEach(key => {
    const translation = translations[locale] && translations[locale][key];
    if (translation) {
      const footerPattern = new RegExp(`\\$\\{\\{\\s*${key}\\s*\\}\\}\\$`, 'g');
      resultHtml = resultHtml.replace(footerPattern, translation);
    }
  });

  // Добавляем атрибут dir="rtl", изменяем text-align и align для арабской локали
  if (locale === 'ar') {
    resultHtml = resultHtml.replace(/<html/g, '<html dir="rtl"');
    resultHtml = resultHtml.replace(/text-align:\s*left;/g, 'text-align: right;');
    resultHtml = resultHtml.replace(/align="left"/g, 'align="right"');
    resultHtml = resultHtml.replace(/<p/g, '<p dir="rtl"');
    resultHtml = resultHtml.replace(/<div/g, '<div dir="rtl"');
    resultHtml = resultHtml.replace(/<td align="left"/g, '<td align="right"'); 
  }

  return resultHtml;
}
