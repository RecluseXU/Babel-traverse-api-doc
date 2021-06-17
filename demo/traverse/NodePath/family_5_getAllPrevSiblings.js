// NodePath.getAllPrevSiblings()
// @return Array
// 获取当前节点前的兄弟节点的NodePath，结果存放在一个数组中返回  


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
    const pre_nodepath = path.getAllPrevSiblings()
    console.log('前面的兄弟节点源码:')
    for(var nodepath of pre_nodepath){
      console.log(nodepath.toString())
    }
    console.log('----------------')
  }
}

traverse(ast, visitor);