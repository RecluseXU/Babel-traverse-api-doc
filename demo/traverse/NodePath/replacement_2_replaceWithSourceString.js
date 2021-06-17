// NodePath.replaceWithSourceString(replacement)
// 此方法用 传入的源代码字符串 解析成对应节点内容后 替换 对应`NodePath`的`Node`  
// 写入的内容解析成AST后，必须为 Expression类型 
// 十分不方便，而且性能较差，不建议使用  
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
    path.replaceWithSourceString('1 + 1');
  }
}

traverse(ast, visitor);
console.log(generator(ast)['code'])