// 获取父级作用域, 如果不存在，返回undefined
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

const jscode = `
var g = 1;
function squire(i){
    return i * g * i;
}
function i()
{
    var i = 123;
    i += 2;
    return 123;
}
`;
let ast = parser.parse(jscode);
const visitor = {
    VariableDeclaration(path){
        console.log("\n这里是", path.toString())
        console.log('结果：', path.scope.parent)
    }
}

traverse(ast, visitor);
