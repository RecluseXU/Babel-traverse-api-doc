// NodePath.replaceWithMultiple(nodes)
// 方法用于将传入的 Node 多个替换对应 NodePath 的 Node
// 此方法能用多个节点替换一个节点
const t = require("@babel/types");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;

const jscode = `function square(n) {
  return n + 1;
}`;

const ast = parser.parse(jscode);
const visitor = {
  ReturnStatement(path) {
    let nodes = [
      t.expressionStatement(t.stringLiteral("who")),
      t.expressionStatement(t.stringLiteral("I")),
      t.expressionStatement(t.stringLiteral("am")),
    ]
    path.replaceWithMultiple(nodes);
  }
}

traverse(ast, visitor);
console.log(generator(ast)['code'])