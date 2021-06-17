// Path.find(callback)
// @return NodePath | None
// 此函数与 Path.findParent 类似，但这个判断包含自身
// 也就是说会先对 当前Path 进行一次判断,如果自身符合条件，那就返回 当前Path，然后才递归调用父级

// 逐级递归寻找父级节点，并将对应`Path`作为参数传入的判断函数进行判断  
// 当判断函数返回`true`, 则`Path.findParent(callback)`返回对应`Path`  
// 当判断函数返回`false`, s, 进行判断  
// 若已无父级，则返回`null`

const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

var jscode = `
function f(){
    var b = 123;
    a = b + 1;
}`;

const visitor = {
    AssignmentExpression(path){
        console.log('当前路径源码:\n', path.toString());
        function to_path(x){  
            if(x.isAssignmentExpression()){return true}else{return false}
        }
        the_path = path.find(to_path)
        console.log('to_path最终路径源码:\n', the_path.toString())

        // 寻找父级
        function to_parent_function_path(x){  // 进行判断是否是函数声明节点的判断函数
            if(x.isFunctionDeclaration()){return true}else{return false}
        }
        the_path = path.find(to_parent_function_path)
        console.log('to_parent_function_path最终路径源码:\n', the_path.toString())
    }
}

let ast = parser.parse(jscode);
traverse(ast, visitor);
