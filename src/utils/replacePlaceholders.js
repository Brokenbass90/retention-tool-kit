export function replacePlaceholders(htmlTemplate, localeData, folderName) {
  let resultHtml = htmlTemplate;
  const placeholderPattern = new RegExp(`\\$\\{\\{\\s*${folderName}\\.\\s*([\\w-]+)\\s*\\}\\}\\$`, 'g');

  resultHtml = resultHtml.replace(placeholderPattern, (match, key) => {
    const replacement = localeData && localeData[key] ? localeData[key] : match;
    return replacement;
  });

  return resultHtml;
}
