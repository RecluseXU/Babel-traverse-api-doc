// Scope.push()
// 获取 父级 blockstament/Program 
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
