"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.replacePlaceholders = replacePlaceholders;

function replacePlaceholders(htmlTemplate, localeData, folderName, locale) {
  var resultHtml = htmlTemplate;
  var placeholderPattern = new RegExp("\\$\\{\\{\\s*".concat(folderName, "\\.\\s*([\\w-]+)\\s*\\}\\}\\$"), 'g');
  resultHtml = resultHtml.replace(placeholderPattern, function (match, key) {
    var replacement = localeData && localeData[key] ? localeData[key] : match;
    return replacement;
  }); // Добавляем атрибут dir="rtl", изменяем text-align и align для арабской локали

  if (locale === 'ar') {
    resultHtml = resultHtml.replace(/<html/g, '<html dir="rtl"');
    resultHtml = resultHtml.replace(/text-align:\s*left;/gi, 'text-align: right;');
    resultHtml = resultHtml.replace(/align\s*=\s*"left"/gi, 'align="right"');
    resultHtml = resultHtml.replace(/<p/g, '<p dir="rtl"');
    resultHtml = resultHtml.replace(/<div/g, '<div dir="rtl"');
    resultHtml = resultHtml.replace(/<td\s+align\s*=\s*"left"/gi, '<td align="right"');
  }

  return resultHtml;
}