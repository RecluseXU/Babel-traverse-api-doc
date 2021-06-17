// Scope.hasBinding(name, noGlobals)
// @return bool
// 向上递归作用域，获知是否有某个被绑定变量
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
        console.log("\n这里是", path.toString())
        console.log('作用域有 被绑定变量 z:', path.scope.hasBinding('z'))
        console.log('作用域有 被绑定变量 g:', path.scope.hasBinding('g'))
    }
}

traverse(ast, visitor);
