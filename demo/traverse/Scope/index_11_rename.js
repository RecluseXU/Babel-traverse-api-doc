// Scope.rename(oldName, newName, block) 
// 更改绑定名称，更改后会牵连所有引用的位置，留意是否会造成问题
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;

const jscode = `
function a(n){
    return n * n
}
`;
let ast = parser.parse(jscode);
const visitor = {
    FunctionDeclaration(path) {
        path.scope.rename("n", "_x_");
    }
}

traverse(ast, visitor);
console.log(generator(ast)['code'])
