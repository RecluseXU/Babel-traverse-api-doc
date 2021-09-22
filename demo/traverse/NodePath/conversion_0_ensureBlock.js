// IfStatement
// @return NodePath

const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;

var jscode = `
	while(1==1)
		console.log('While')

	for(;1==1;)
		console.log("For")

	do
		console.log("do...while")
	while(1==1)
`;

const visitor = {
	WhileStatement(path) { path.ensureBlock(); },
	ForStatement(path) { path.ensureBlock(); },
	DoWhileStatement(path) { path.ensureBlock(); },
}

let ast = parser.parse(jscode);
traverse(ast, visitor);
console.log(generator(ast)['code'])
