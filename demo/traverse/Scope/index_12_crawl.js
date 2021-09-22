// Scope.crawl()
// 用于刷新 Scope 内的数据，例如更新内部节点后Binding没有刷新的问题
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;
const types = require("@babel/types");

const jscode = `
function a(n){
    return n * n
}
`;
let ast = parser.parse(jscode);
const visitor = {
    ReturnStatement(path) {
        let newNode = types.VariableDeclaration(
            "var", 
            [
                types.VariableDeclarator(
                    types.identifier('a'),
                    types.stringLiteral('well')
                )
            ]
        );
        path.replaceWith(newNode);
        console.log(Object.keys(path.scope.bindings));
        path.scope.crawl();
        console.log(Object.keys(path.scope.bindings));
    }
}

traverse(ast, visitor);
console.log(generator(ast)['code'])
