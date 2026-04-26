import { toHtml } from "hast-util-to-html";
import parse from "rehype-parse";
import { unified } from "unified";
var CALLOUT = /__(.*?)__/g;
function highlightWord(code) {
  var html = toHtml(code);
  var result = html.replace(CALLOUT, function (_, text) {
    return `<span class="highlight-word">${text}</span>`;
  });
  var hast = unified().use(parse, {
    emitParseErrors: true,
    fragment: true
  }).parse(result);
  return hast["children"];
}
export { highlightWord };
//# sourceMappingURL=highlightWord.native.js.map
