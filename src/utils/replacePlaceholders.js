export function replacePlaceholders(htmlTemplate, localeData) {

    let resultHtml = htmlTemplate;
    const placeholderPattern = /\${{(\s*[\w.]+\s*)}}\$/g;
    resultHtml = resultHtml.replace(placeholderPattern, (match, key) => {
      key = key.trim();
      const replacement = localeData[key] || match;

      return replacement;
    });

    return resultHtml;
}
