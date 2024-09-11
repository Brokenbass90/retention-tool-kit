"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.replacePlaceholders = replacePlaceholders;

var _translations = require("./translations");

function replacePlaceholders(htmlTemplate, localeData, folderName, locale) {
  var resultHtml = htmlTemplate;
  var placeholderPattern = new RegExp("\\$\\{\\{\\s*".concat(folderName, "\\.\\s*([\\w-]+)\\s*\\}\\}\\$"), 'g');
  resultHtml = resultHtml.replace(placeholderPattern, function (match, key) {
    var replacement = localeData && localeData[key] ? localeData[key] : match;
    return replacement;
  }); // Применение переводов для footer.block_00 и footer.block_01

  var footerKeys = ["footer.block_00", "footer.block_01"];
  footerKeys.forEach(function (key) {
    var translation = _translations.translations[locale] && _translations.translations[locale][key];

    if (translation) {
      var footerPattern = new RegExp("\\$\\{\\{\\s*".concat(key, "\\s*\\}\\}\\$"), 'g');
      resultHtml = resultHtml.replace(footerPattern, translation);
    }
  }); // Добавляем атрибут dir="rtl", изменяем text-align и align для арабской локали

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