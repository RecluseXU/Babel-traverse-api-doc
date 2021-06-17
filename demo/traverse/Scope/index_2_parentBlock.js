// Scope.parentBlock(name)
// @return Node
// 获取 作用域路径 的父级
// 它的源码就一句 this.path.parent;
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

const jscode = `
var g = 1;
function a(){return g;}
function b(){var z=2; return z;}
`;
let ast = parser.parse(jscode);
const visitor = {
    ReturnStatement(path){
        var n = path.node.argument.name
        console.log("\n这里是", path.toString())
        console.log('结果：', path.scope.parentBlock)
    }
}

traverse(ast, visitor);
