// NodePath.replaceWith(replacement)
// 方法用于将传入的 Node替换对应NodePath的Node
// 此方法只能用一个节点替换一个节点
const t = require("@babel/types");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;

const jscode = `function square(n) {
  return n + 1;
}`;

const ast = parser.parse(jscode);
const visitor = {
  BinaryExpression(path) {
    path.replaceWith(
      t.BinaryExpression("**", path.node.left, t.NumericLiteral(2))
    );
    // 由于是用 BinaryExpression 代替 BinaryExpression
    // visitor会认为替换后的节点是新的节点，会传入，所以这里直接停止，防止递归进入
    path.stop();
  }
}

traverse(ast, visitor);
console.log(generator(ast)['code'])