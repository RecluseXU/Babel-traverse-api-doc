// Scope.getBinding(name)
// @return Binding
// 获取指定节点的 Binding ，这能知道这个量是定义在哪个定义域内的
// 如果当前作用域找不到就会递归上上寻找
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
        console.log('被绑定量：', path.scope.getBinding(n))
    }
}

traverse(ast, visitor);
