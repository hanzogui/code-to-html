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
var highlightLine_exports = {};
__export(highlightLine_exports, {
  highlightLine: () => highlightLine
});
module.exports = __toCommonJS(highlightLine_exports);
var import_hast_util_to_html = require("hast-util-to-html");
var import_rehype_parse = __toESM(require("rehype-parse"));
var import_unified = require("unified");
const lineNumberify = function lineNumberify2(ast, lineNum = 1) {
  let lineNumber = lineNum;
  return ast.reduce((result, node) => {
    if (node.type === "text") {
      if (node.value.indexOf("\n") === -1) {
        node.lineNumber = lineNumber;
        result.nodes.push(node);
        return result;
      }
      const lines = node.value.split("\n");
      for (let i = 0; i < lines.length; i++) {
        if (i !== 0) ++lineNumber;
        if (i === lines.length - 1 && lines[i].length === 0) continue;
        result.nodes.push({
          type: "text",
          value: i === lines.length - 1 ? lines[i] : `${lines[i]}
`,
          lineNumber
        });
      }
      result.lineNumber = lineNumber;
      return result;
    }
    if (node.children) {
      node.lineNumber = lineNumber;
      const processed = lineNumberify2(node.children, lineNumber);
      node.children = processed.nodes;
      result.lineNumber = processed.lineNumber;
      result.nodes.push(node);
      return result;
    }
    result.nodes.push(node);
    return result;
  }, {
    nodes: [],
    lineNumber
  });
};
const wrapLines = function wrapLines2(ast, linesToHighlight) {
  const highlightAll = linesToHighlight.length === 1 && linesToHighlight[0] === 0;
  const allLines = Array.from(new Set(ast.map(x => x.lineNumber)));
  let i = 0;
  const wrapped = allLines.reduce((nodes, marker) => {
    const line = marker;
    const children = [];
    for (; i < ast.length; i++) {
      if (ast[i].lineNumber < line) {
        nodes.push(ast[i]);
        continue;
      }
      if (ast[i].lineNumber === line) {
        children.push(ast[i]);
        continue;
      }
      if (ast[i].lineNumber > line) {
        break;
      }
    }
    nodes.push({
      type: "element",
      tagName: "div",
      properties: {
        dataLine: line,
        className: "highlight-line",
        dataHighlighted: linesToHighlight.includes(line) || highlightAll ? "true" : "false"
      },
      children,
      lineNumber: line
    });
    return nodes;
  }, []);
  return wrapped;
};
const MULTILINE_TOKEN_SPAN = /<span class="token ([^"]+)">[^<]*\n[^<]*<\/span>/g;
const applyMultilineFix = ast => {
  let html = (0, import_hast_util_to_html.toHtml)(ast);
  html = html.replace(MULTILINE_TOKEN_SPAN, (match, token) => match.replace(/\n/g, `</span>
<span class="token ${token}">`));
  const hast = (0, import_unified.unified)().use(import_rehype_parse.default, {
    emitParseErrors: true,
    fragment: true
  }).parse(html);
  return hast["children"];
};
function highlightLine(ast, lines) {
  const formattedAst = applyMultilineFix(ast);
  const numbered = lineNumberify(formattedAst).nodes;
  return wrapLines(numbered, lines);
}