// NodePath.getBindingIdentifiers(duplicates)
// @return dict(Node}
// 用于获取当前 NodePath 所包含的 Identifier 节点
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");

const jscode = `function square(n) {
  var a = 1;
  a += 2;
  return a;
}`;

const ast = parser.parse(jscode);
const visitor = {
  exit(path) {
    if (t.isProgram(path)){return;}
    console.log('当前节点：', path.toString())
    console.log('当前语句', path.getStatementParent().toString())
    let _ids = path.getBindingIdentifiers()
    if(_ids == null){return;}
    console.log(_ids)
    console.log('---------------------------------')
  }
}

traverse(ast, visitor);