// Scope.getOwnBinding(name)
// @return Binding
// 传入一个名称，从当前的 作用域 中拿到指定的定义
// 源码就一句`return this.bindings[name];`

const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

const jscode = `
var g = 1;
function a(){var a=1;return g;}
`;
let ast = parser.parse(jscode);
const visitor = {
    ReturnStatement(path){
        var n = path.node.argument.name
        console.log("\n这里是", path.toString())
        console.log('获取挡墙定义域里 a的Binding，结果：', path.scope.bindings['a'])
    }
}

traverse(ast, visitor);
