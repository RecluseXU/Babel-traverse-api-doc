// shallowEqual(actual, expected)
// @return bool

// 对比函数，expected传入一个字典进行 key, value 遍历
// 获取 actual.key 的值与 value 进行对比
// 如果有一个不一致，那么返回 false
// 否则返回 true

// 其定义位置在： @babel/types/lib/validators/generated/index.js

const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");

const jscode = 'var a=1;var b=1+1;';
let ast = parser.parse(jscode);

const visitor = {
  enter(path){
    console.log('当前节点源码：', path.toString())
    console.log('其属性name为a:', t.shallowEqual(path.node, {'name':'a'}))
  }
}

traverse(ast, visitor);