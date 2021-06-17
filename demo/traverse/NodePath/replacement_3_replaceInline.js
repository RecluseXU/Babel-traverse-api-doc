// replaceInline(nodes)
// 用于用传入的一个或多个`Node`替换对应 Node  
// 此函数视传入的内容去调用 NodePath.replaceWithMultiple() 或 NodePath.replaceWith()

const t = require("@babel/types");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;

const jscode = `function square(n) {
  return 1 + 1;
}`;

const ast = parser.parse(jscode);
const visitor = {
  BinaryExpression(path) {
    var result = eval(path.toString())  // 计算表达式结果
    var node = t.NumericLiteral(result)  // 使用 types 来生成一个数字节点
    var a = path.replaceInline(node);   // 用新的节点来替换表达式内容
    console.log(a['0']['type'],'---------');
  }
}

traverse(ast, visitor);
console.log(generator(ast)['code'])