// NodePath.getNextSibling()获取同级后一个节点的NodePath
// @return Node
// 此函数源码就一句 return this.getSibling(this.key + 1);

const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

const jscode = `
  var a = 1 + 9;
  a = a + a;
  console.log(a);
  console.log(b);
`;

const ast = parser.parse(jscode);
const visitor = {
  ExpressionStatement(path) {
    console.log('当前节点源码:\n', path.toString())
    console.log('同级后一个节点源码:\n', path.getNextSibling().toString())
    console.log('----------------')
  }
}

traverse(ast, visitor);