"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.replacePlaceholders = replacePlaceholders;
exports.combineHtmlAndStyles = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function replacePlaceholders(htmlTemplate, localeData, folderName) {
  var resultHtml = htmlTemplate;
  var placeholderPattern = new RegExp("\\$\\{\\{\\s*".concat(folderName, "\\.\\s*([\\w-]+)\\s*\\}\\}\\$"), 'g');
  resultHtml = resultHtml.replace(placeholderPattern, function (match, key) {
    var replacement = localeData && localeData[key] ? localeData[key] : match;
    return replacement;
  });
  return resultHtml;
}

var combineHtmlAndStyles = function combineHtmlAndStyles(htmlContent, styles) {
  var updatedHtml = htmlContent;

  for (var _i = 0, _Object$entries = Object.entries(styles); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        placeholder = _Object$entries$_i[0],
        value = _Object$entries$_i[1];

    var regex = new RegExp("{%".concat(placeholder, "%}"), 'g');
    updatedHtml = updatedHtml.replace(regex, value || '');
  }

  return updatedHtml;
};

exports.combineHtmlAndStyles = combineHtmlAndStyles;