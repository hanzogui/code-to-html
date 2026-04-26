var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all) __defProp(target, name, {
    get: all[name],
    enumerable: true
  });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from)) if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
      get: () => from[key],
      enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
    });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
// If the importer is in node compatibility mode or this is not an ESM
// file that has been converted to a CommonJS file using a Babel-
// compatible transform (i.e. "__esModule" has not been set), then set
// "default" to the CommonJS "module.exports" for node compatibility.
isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
  value: mod,
  enumerable: true
}) : target, mod));
var __toCommonJS = mod => __copyProps(__defProp({}, "__esModule", {
  value: true
}), mod);
var index_exports = {};
__export(index_exports, {
  codeToHTML: () => codeToHTML
});
module.exports = __toCommonJS(index_exports);
var import_hast_util_to_html = require("hast-util-to-html");
var import_parse_numeric_range = __toESM(require("parse-numeric-range"));
var import_refractor = require("refractor");
var import_css = __toESM(require("refractor/lang/css"));
var import_tsx = __toESM(require("refractor/lang/tsx"));
var import_highlightLine = require("./highlightLine.cjs");
var import_highlightWord = require("./highlightWord.cjs");
import_refractor.refractor.register(import_tsx.default);
import_refractor.refractor.register(import_css.default);
function codeToHTML(source, language, line = "0") {
  let result = import_refractor.refractor.highlight(source, language);
  result = (0, import_highlightLine.highlightLine)(result, (0, import_parse_numeric_range.default)(line));
  result = (0, import_highlightWord.highlightWord)(result);
  result = (0, import_hast_util_to_html.toHtml)(result);
  return result;
}