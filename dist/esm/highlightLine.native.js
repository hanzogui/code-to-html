import { toHtml } from "hast-util-to-html";
import parse from "rehype-parse";
import { unified } from "unified";
var lineNumberify = function lineNumberify2(ast) {
  var lineNum = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1;
  var lineNumber = lineNum;
  return ast.reduce(function (result, node) {
    if (node.type === "text") {
      if (node.value.indexOf("\n") === -1) {
        node.lineNumber = lineNumber;
        result.nodes.push(node);
        return result;
      }
      var lines = node.value.split("\n");
      for (var i = 0; i < lines.length; i++) {
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
      var processed = lineNumberify2(node.children, lineNumber);
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
var wrapLines = function wrapLines2(ast, linesToHighlight) {
  var highlightAll = linesToHighlight.length === 1 && linesToHighlight[0] === 0;
  var allLines = Array.from(new Set(ast.map(function (x) {
    return x.lineNumber;
  })));
  var i = 0;
  var wrapped = allLines.reduce(function (nodes, marker) {
    var line = marker;
    var children = [];
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
var MULTILINE_TOKEN_SPAN = /<span class="token ([^"]+)">[^<]*\n[^<]*<\/span>/g;
var applyMultilineFix = function (ast) {
  var html = toHtml(ast);
  html = html.replace(MULTILINE_TOKEN_SPAN, function (match, token) {
    return match.replace(/\n/g, `</span>
<span class="token ${token}">`);
  });
  var hast = unified().use(parse, {
    emitParseErrors: true,
    fragment: true
  }).parse(html);
  return hast["children"];
};
function highlightLine(ast, lines) {
  var formattedAst = applyMultilineFix(ast);
  var numbered = lineNumberify(formattedAst).nodes;
  return wrapLines(numbered, lines);
}
export { highlightLine };
//# sourceMappingURL=highlightLine.native.js.map
