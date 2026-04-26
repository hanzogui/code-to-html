import { toHtml } from "hast-util-to-html";
import rangeParser from "parse-numeric-range";
import { refractor } from "refractor";
import css from "refractor/lang/css";
import tsx from "refractor/lang/tsx";
import { highlightLine } from "./highlightLine.native.js";
import { highlightWord } from "./highlightWord.native.js";
refractor.register(tsx);
refractor.register(css);
function codeToHTML(source, language) {
  var line = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "0";
  var result = refractor.highlight(source, language);
  result = highlightLine(result, rangeParser(line));
  result = highlightWord(result);
  result = toHtml(result);
  return result;
}
export { codeToHTML };
//# sourceMappingURL=index.native.js.map
