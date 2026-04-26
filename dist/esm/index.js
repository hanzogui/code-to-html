import { toHtml } from "hast-util-to-html";
import rangeParser from "parse-numeric-range";
import { refractor } from "refractor";
import css from "refractor/lang/css";
import tsx from "refractor/lang/tsx";
import { highlightLine } from "./highlightLine.mjs";
import { highlightWord } from "./highlightWord.mjs";
refractor.register(tsx);
refractor.register(css);
function codeToHTML(source, language, line = "0") {
  let result = refractor.highlight(source, language);
  result = highlightLine(result, rangeParser(line));
  result = highlightWord(result);
  result = toHtml(result);
  return result;
}
export { codeToHTML };
//# sourceMappingURL=index.js.map
