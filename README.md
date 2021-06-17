文档浏览：[https://evilrecluse.top/Babel-traverse-api-doc/#/](https://evilrecluse.top/Babel-traverse-api-doc/#/)  
推荐使用 ↑↑↑GitPage↑↑↑ 进行浏览  



## API信息  

由于 Babel 官方文档中没有 **@babel/traverse** API文档，只有一份奇怪的操作说明书 [Babel Plugin Handbook](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md#babel-traverse)。所以我自行编写了一个简略的API记录  

這些記錄是我自行查閲文檔/源代碼，來進行編寫的，大多數都會編寫一個小例子來進行説明  

内容并不一定準確，如果發現有什麽問題，歡迎通過此文档 [github](https://github.com/RecluseXU/Babel-traverse-api-doc) 聯係  

此处会对 **@babel/parse** 与 **@babel/generator** 进行简单的说明  
二者皆有官方文档可以参阅，若无兴趣，可以跳过  




## @babel/parse  
**@babel/parse** 是用于将代码解析语法树所使用的库
将代码进行解析，转变为语法树，是进行语法树操作的必要前置步骤  



### 解析函数  

#### babelParser.parse(code, \[options])  
将提供的代码作为一个完整的`ECMAScript`程序进行解析  



#### babelParser.parseExpression(code, \[options])  
用于解析单个`Expression`，性能比`parse()`要高  



#### options 函数参数  

|参数|说明|
|--|--|
|allowImportExportEverywhere|默认情况下，`import` 和 `export` 声明语句只能出现在程序的最顶层</br>把这个设置为`true`，可以使得语句在任何地方都可以声明 |
|allowAwaitOutsideFunction|默认情况下，仅在 异步函数内部 或 启用`topLevelAwait插件`时 在模块的顶层内允许使用`await`</br>把这个设置为`true`，可以使得语句在任何地方都可以声明|
|allowReturnOutsideFunction|默认情况下，如果在顶层中使用`return`语句会引起错误</br>把这个设置为`true`，就不会报错  |
|allowSuperOutsideMethod|默认情况下，在类和对象方法之外不允许使用`super`</br>把这个设置为`true`就可以声明|
|allowUndeclaredExports|默认情况下，`export`一个在当前作用域下未声明的内容会报错</br>把这个设置为`true`就可以防止解析器过早地抛出未声明的错误  |
|createParenthesizedExpressions|默认情况下，`parser`会在`expression`节点设置`extra.parenthesized`</br>把这个设置为`true`，则会设置`ParenthesizedExpression`AST节点  |
|errorRecovery|默认情况下，如果`Babel`发现一些 不正常的代码 就会抛出错误</br>把这个设置为`true`，则会在保存解析错误的同时继续解析代码，错误的记录将被保存在 最终生成的AST的`errors`属性中</br>注意，那些严重的错误依然会终止解析  |
|plugins|记录希望启动的插件的数组  |
|sourceType|代码的解析方式，你可以填入`"script"`（默认）,`"module"` 或 `"unambiguous"`</br>如果设置为"unambiguous"，那么系统会根据ES6语法中的`imports`和`export`来判断是`"module"`还是`"script"` |
|sourceFilename|将输出的AST节点与其源文件名相关联</br>在你处理多个文件时，这个功能会很有用  |
|startLine|默认情况下，第一行代码就是`line 1`。你可以传入一个数字，作为起始行数</br>这个功能在你整合其他插件的时候会很有用 |
|strictMode|默认情况下，只有在声明了"use strict"条件下，ECMAScript代码才会被严格解析</br>将此选项设置为`true`则始终以严格模式解析文件  |
|ranges|添加ranges属性到每一个节点中 </br><code>ranges: [node.start, node.end]</code>   |
|tokens|将所有已经解析的`tokens`保存到`File`节点的`tokens`属性中|
|||



### 解析输出 Output  

`Babel parser`是根据 [Babel AST format](https://github.com/babel/babel/tree/master/packages/babel-parser/ast/spec.md) 创建AST的  
而`Babel AST format`是基于 [ESTree 规范](https://github.com/estree/estree) 建立的  

[ESTree 代码生成对应节点文档](https://github.com/estree/estree/blob/master/es5.md#literal)
[Babel parser 代码生成对应节点文档](https://github.com/babel/babel/blob/master/packages/babel-parser/ast/spec.md#stringliteral)

>`Babel parser`与`ESTree`的不同之处  
>
>* 用[`StringLiteral`](https://github.com/babel/babel/tree/master/packages/babel-parser/ast/spec.md#stringliteral), [`NumericLiteral`](https://github.com/babel/babel/tree/master/packages/babel-parser/ast/spec.md#numericliteral), [`BooleanLiteral`](https://github.com/babel/babel/tree/master/packages/babel-parser/ast/spec.md#booleanliteral), [`NullLiteral`](https://github.com/babel/babel/tree/master/packages/babel-parser/ast/spec.md#nullliteral), [`RegExpLiteral`](https://github.com/babel/babel/tree/master/packages/babel-parser/ast/spec.md#regexpliteral)取代[`Literal`](https://github.com/estree/estree/blob/master/es5.md#literal)  
>* 用 [`ObjectProperty`](https://github.com/babel/babel/tree/master/packages/babel-parser/ast/spec.md#objectproperty) 和 [`ObjectMethod`](https://github.com/babel/babel/tree/master/packages/babel-parser/ast/spec.md#objectmethod)取代[`Property`](https://github.com/estree/estree/blob/master/es5.md#property)  
>* 用[`MethodDefinition`](https://github.com/estree/estree/blob/master/es2015.md#methoddefinition)取代[`ClassMethod`](https://github.com/babel/babel/tree/master/packages/babel-parser/ast/spec.md#classmethod)
>* [`Program`](https://github.com/babel/babel/tree/master/packages/babel-parser/ast/spec.md#programs) and [`BlockStatement`](https://github.com/babel/babel/tree/master/packages/babel-parser/ast/spec.md#blockstatement) 包含的`directives`用 [`Directive`](https://github.com/babel/babel/tree/master/packages/babel-parser/ast/spec.md#directive) 和 [`DirectiveLiteral`](https://github.com/babel/babel/tree/master/packages/babel-parser/ast/spec.md#directiveliteral)来填充  
>* [`FunctionExpression`](https://github.com/babel/babel/tree/master/packages/babel-parser/ast/spec.md#functionexpression)中的 [`ClassMethod`](https://github.com/babel/babel/tree/master/packages/babel-parser/ast/spec.md#classmethod), [`ObjectProperty`](https://github.com/babel/babel/tree/master/packages/babel-parser/ast/spec.md#objectproperty),[`ObjectMethod`](https://github.com/babel/babel/tree/master/packages/babel-parser/ast/spec.md#objectmethod)属性被引入到`main方法`节点中  



## @babel/generator  

**@babel/generator** 是用于根据语法树构建代码的库，作用与 **@babel/parse** 正好相反  
官方文档：https://babeljs.io/docs/en/babel-generator    




### generate(ast,  options,  code)  

函数用于根据ast生成代码，可以传入一些参数  

#### options 参数  

| name 参数名            | type 类型           | default 默认值  | description 描述                                             |
| ---------------------- | ------------------- | --------------- | ------------------------------------------------------------ |
| auxiliaryCommentAfter  | string              |                 | Optional 在输出文件内容末尾添加的注释块文字                  |
| auxiliaryCommentBefore | string              |                 | Optional 在输出文件内容头部添加的注释块文字                  |
| comments               | boolean             | `true`          | 输出内容是否包含注释                                         |
| compact                | boolean or `'auto'` | `opts.minified` | 是否不添加空格来让代码看起来紧密                             |
| concise                | boolean             | `false`         | 是否减少空格来让代码看起来紧凑一些<br>只是减少空格，而不是不添加 |
| decoratorsBeforeExport | boolean             |                 | 是否在导出之前`print`一下装饰器                              |
| filename               | string              |                 | Used in warning messages                                     |
| jsescOption            | object              |                 | Use `jsesc` to process literals. `jsesc` is applied to numbers only if `jsescOption.numbers` (added in `v7.9.0`) is present. You can customize `jsesc` by [passing options](https://github.com/mathiasbynens/jsesc#api) to it. |
| jsonCompatibleStrings  | boolean             | `false`         | Set to true to run `jsesc` with "json": true to print "\u00A9" vs. "©"; |
| minified               | boolean             | `false`         | Should the output be minified<br>是否压缩代码                |
| retainFunctionParens   | boolean             | `false`         | Retain parens around function expressions (could be used to change engine parsing behavior) |
| retainLines            | boolean             | `false`         | 尝试在输出代码中使用与源代码中相同的行号(用于追踪堆栈)       |
| shouldPrintComment     | function            | `opts.comments` | Function that takes a comment (as a string) and returns `true` if the comment should be included in the output. <br>By default, comments are included if `opts.comments` is `true` or if `opts.minified` is `false` and the comment contains `@preserve` or `@license` |



> 例：去除代码中所有的注释

~~~javascript
function delete_comments(sourceCode) {
    // 用于删除所有注释, genrator实现
    // @return String
    let ast = parser.parse(sourceCode);
    return generator(ast, {'comments': false})['code']
}
~~~





## @babel/traverse  

**@babel/traverse** 是用于对语法树进行各种操作的库  



### index  

对应路径 `@babel/traverse/lib/path/index.js`  
此文件主要包括 `NodePath` 的定义和一些基本方法  

#### NodePath 基础属性  

~~~javascript
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

var jscode = `
function f(){
    var b = 123;
    a = ['a', 'b'];
}`;

const visitor = {
    BlockStatement(path)
    {
        console.log('当前路径 源码:\n', path.toString());
        console.log('当前路径 节点:\n', path.node)
        console.log('当前路径 父级节点:\n', path.parent);
        console.log('当前路径 父级路径:\n', path.parentPath)
        console.log('当前路径 类型:\n', path.type)

        console.log('当前路径 contexts:\n', path.contexts);
        console.log('当前路径 hub:\n', path.hub);
        console.log('当前路径 state:\n', path.state);
        console.log('当前路径 opts:\n', path.opts)
        console.log('当前路径 skipKeys:\n', path.skipKeys)
        console.log('当前路径 container:\n', path.container)
        console.log('当前路径 key:\n', path.key)
        console.log('当前路径 scope:\n', path.scope)
    }
}

let ast = parser.parse(jscode);
traverse(ast, visitor);
~~~

你会发现其中有不少值都是没有定义的，这是因为很多值都是懒加载的  
而且会给与专门的方法进行获取，并不是这样直接获取的  



#### NodePath.inList()  

`@return bool`  

是否在列表中/是否存在兄弟节点  

一般只有那些能存放多个节点的节点才会将节点存放在列表中  

~~~javascript
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");

const jscode = `function square(n) {
  var a = 1;
  a += 2;
  if(a + 1 == 4){return a-2}
  return a;
}`;

const ast = parser.parse(jscode);
const visitor = {
  Statement(path) {
    console.log('当前节点：', path.toString())
    console.log('当前语句', path.getStatementParent().toString())
    console.log('是否在列表中/是否存在兄弟节点', path.inList)
    console.log('---------------------------------')
  }
}

traverse(ast, visitor);
~~~







### replacement  

对应路径 `@babel/traverse/lib/path/replacement.js`  
替换语法树节点相关的函数  



#### NodePath.replaceWith(replacement:Node)  

方法用于将传入的  `Node` 替换对应 `NodePath` 的 `Node`   

此方法只能用一个节点替换一个节点  

* 如果不传入 `replacement`会提示：`NodePath.removed()`才是用来删除节点的方法  
* 如果传入数组会提示：`NodePath.replaceWithMultiple()` 才是一次性用多个节点替换目标节点的方法  
* 如果传入字符串会提示：`NodePath.replaceWithSourceString()` 才是用源码替换目标节点的方法  
* 只能用 `Program`类型的节点替换 根节点`Program`  

~~~javascript
const t = require("@babel/types");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;

const jscode = `function square(n) {
  return n + 1;
}`;

const ast = parser.parse(jscode);
const visitor = {
  BinaryExpression(path) {
    path.replaceWith(
      t.BinaryExpression("**", path.node.left, t.NumericLiteral(2))
    );
    // 由于是用 BinaryExpression 代替 BinaryExpression
    // visitor会认为替换后的节点是新的节点，会传入，所以这里直接停止，防止递归进入
    path.stop();
  }
}

traverse(ast, visitor);
console.log(generator(ast)['code'])
~~~



#### NodePath.replaceWithMultiple(nodes)  

方法用于将传入的 多个 `Node` 替换对应 `NodePath` 的 `Node`  

此方法能用多个节点替换一个节点  

~~~javascript
const t = require("@babel/types");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;

const jscode = `function square(n) {
  return n + 1;
}`;

const ast = parser.parse(jscode);
const visitor = {
  ReturnStatement(path) {
    let nodes = [
      t.expressionStatement(t.stringLiteral("who")),
      t.expressionStatement(t.stringLiteral("I")),
      t.expressionStatement(t.stringLiteral("am")),
    ]
    path.replaceWithMultiple(nodes);
  }
}

traverse(ast, visitor);
console.log(generator(ast)['code'])
~~~





#### NodePath.replaceWithSourceString(replacement:String)    

此方法用 传入的源码字符串 解析成对应 `Node` 后 替换 对应 `NodePath` 的 `Node`   

写入的内容解析成 `Node`后，必须为 `Expression` 类型   

此函数方便但是性能较差，不建议使用   

~~~javascript
const t = require("@babel/types");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;

const jscode = `function square(n) {
  return n + 1;
}`;

const ast = parser.parse(jscode);
const visitor = {
  ReturnStatement(path) {
    path.replaceWithSourceString('1 + 1');
  }
}

traverse(ast, visitor);
console.log(generator(ast)['code'])
~~~



#### NodePath.replaceInline(nodes)  

用传入的一个或多个 `Node` 替换对应  `Node`  

此函数视传入的内容去调用 [NodePath.replaceWithMultiple()](#nodepathreplacewithmultiplenodes)  或  [NodePath.replaceWith()](#nodepathreplacewithreplacementnode)  ，相当于同时有了这两个函数的功能  

> 例子：使用 NodePath.replaceInline 替换目标节点  

~~~javascript
const t = require("@babel/types");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;

const jscode = `function square(n) {
  return 1 + 1;
}`;

const ast = parser.parse(jscode);
const visitor = {
  BinaryExpression(path) {
    var result = eval(path.toString())  // 计算表达式结果
    var node = t.NumericLiteral(result)  // 使用 types 来生成一个数字节点
    path.replaceInline(node);   // 用新的节点来替换表达式内容
  }
}

traverse(ast, visitor);
console.log(generator(ast)['code'])
~~~





### ancestry  
父级/祖先相关  




#### NodePath.findParent(callback)  

`@return NodePath | None`  
逐级递归寻找父级节点的Path，并将 `NodePath` 作为参数传入的判断函数进行判断  
当判断函数返回 `true`, 则 `NodePath.findParent(callback)` 返回对应 `NodePath`  
当判断函数返回 `false`, 则递归继续寻找父级, 进行判断。若已无父级，则返回`null`  

>例: 寻找当前Path的父级函数节点  

~~~javascript
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
        
        // 寻找父级
        function to_parent_function_path(x){  // 进行判断是否是函数声明节点的判断函数
            if(x.isFunctionDeclaration()){return true}else{return false}
        }
        //      将判断函数传入，进行递归寻找父级path
        the_path = path.findParent(to_parent_function_path)
        console.log('to_parent_function_path 最终路径源码:\n', the_path.toString())

        //      递归后如果没有发现符合要求的父级
        function to_null(x){return false}
        the_path = path.findParent(to_null)
        console.log('to_null 最终路径:\n', the_path)
    }
}

let ast = parser.parse(jscode);
traverse(ast, visitor);
~~~


<details>
    <summary>结果</summary>   
<pre>
当前路径源码:
 a = b + 1
to_parent_function_path 最终路径源码:
 function f() {
  var b = 123;
  a = b + 1;
}
to_null 最终路径:
 null
</pre>
</details>







#### NodePath.find(callback)  

`@return NodePath | None`  
此函数与 `NodePath.findParent` 基本相同, 但这个判断包含对 当前 `NodePath` 的判断  
它会先对 当前 `NodePath` 进行一次判断. 如果自身符合条件，那就返回 当前 `NodePath` ，然后才递归调用父级进行判断  

>例子：当前或父级 `NodePath`  

~~~javascript
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
~~~


<details>
    <summary>结果</summary>   
<pre>
当前路径源码:
 a = b + 1
to_path最终路径源码:
 a = b + 1
to_parent_function_path最终路径源码:
 function f() {
  var b = 123;
  a = b + 1;
}
</pre>
</details>





#### NodePath.getFunctionParent()  

`@return NodePath | None`  
得到当前节点的第一个 父级/祖先 函数声明节点 `NodePath`  

此方法通过调用 [`NodePath.findParent(callback)`](#nodepathfindparentcallback) 传入内置的判断函数，来得到对应的结果  

>例: 寻找 父级/祖先 函数声明节点的 `NodePath`  

~~~javascript
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

        the_path = path.getFunctionParent()
        console.log('最终路径源码:\n', the_path.toString())
    }
}

let ast = parser.parse(jscode);
traverse(ast, visitor);
~~~


<details>
    <summary>结果</summary>   
<pre>
当前路径源码:
 a = b + 1
最终路径源码:
 function f() {
  var b = 123;
  a = b + 1;
}
</pre>
</details>





#### NodePath.getStatementParent()  

`@return NodePath`
返回第一个 父级/祖先 声明节点的`NodePath`  
(向上遍历语法树，直到找到在列表中的父/祖先节点`NodePath` )  

声明节点所包含的节点类型见：[Github文档](https://github.com/babel/babylon/blob/master/ast/spec.md#blockstatement)  
若找不到目标，会报错  

>例：返回第一个 父级/祖先 声明节点的 Path  

~~~javascript
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

var jscode = `
function f2(){
    var b = 123;
    return b + 1;
}`;

const visitor = {
    Identifier(path){
        console.log('当前路径源码:\n', path.toString());
        the_path = path.getStatementParent()
        console.log('最终路径源码:\n', the_path.toString())
        console.log('------------------------------------')
    }
}

let ast = parser.parse(jscode);
traverse(ast, visitor);
~~~


<details>
    <summary>结果</summary>   
<pre>
当前路径源码:
 f2
最终路径源码:
 function f2() {
  var b = 123;
  return b + 1;
}
------------------------------------
当前路径源码:
 b
最终路径源码:
 var b = 123;
------------------------------------
当前路径源码:
 b
最终路径源码:
 return b + 1;
------------------------------------
</pre>
</details>





#### NodePath.getAncestry()  

`@return Array`
返回所有 父级/祖先 `NodePath`  

>例：得到当前Path的所有 父级/祖先 `NodePath`  

~~~javascript
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

var jscode = `
function f2(){
    var b = 123;
    a = b + 1;
}`;

const visitor = {
    AssignmentExpression(path){
        console.log('当前路径源码:\n', path.toString());
        the_paths = path.getAncestry()

        console.log('返回类型:\n', the_paths instanceof Array)
        console.log('结果路径源码:\n', the_paths.join('\n\n'))
    }
}

let ast = parser.parse(jscode);
traverse(ast, visitor);
~~~


<details>
    <summary>结果</summary>   
<pre>
当前路径源码:
 a = b + 1
返回类型:
 true
结果路径源码:
 a = b + 1
<span></span>
a = b + 1;
<span></span>
{
  var b = 123;
  a = b + 1;
}
<span></span>
function f2() {
  var b = 123;
  a = b + 1;
}
<span></span>
function f2() {
  var b = 123;
  a = b + 1;
}
</pre>
</details>






#### NodePath.isDescendant(path)  

`@return bool` 
判断当前 `NodePath` 是否是指定 `NodePath` 的后代  

此方法通过调用 [`NodePath.findParent(callback)`](#nodepathfindparentcallback) 来进行判断，得到结果  

>例:辈分判断  

~~~javascript
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

var jscode = `
function f2(){
    var b = 123;
    a = b + 1;
}`;

const visitor = {
    AssignmentExpression(path){
        console.log('当前路径源码:\n', path.toString());
        console.log('儿子是爸爸的后代：', path.isDescendant(path.parentPath))
        console.log('儿子是爷爷的后代：', path.isDescendant(path.parentPath.parentPath))
        console.log('儿子是孙子的后代：', path.isDescendant(path.get('left')))
    }
}

let ast = parser.parse(jscode);
traverse(ast, visitor);
~~~


<details>
    <summary>结果</summary>   
<pre>
当前路径源码:
 a = b + 1
儿子是爸爸的后代： true
儿子是爷爷的后代： true
儿子是孙子的后代： false
</pre>
</details>





#### NodePath.isAncestor(path)  

`@return bool`  
判断当前 NodePath 是否是指定 NodePath 的后代  

此方法是调用 传入的 `NodePath` 的 [`NodePath.isDescendant()`](#nodepathisdescendantpath)  来进行判断的  

>例：判断是否是后代  

~~~javascript
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

var jscode = `
function f2(){
    var b = 123;
    a = b + 1;
}`;

const visitor = {
    AssignmentExpression(path){
        console.log('当前路径源码:\n', path.toString());
        console.log('儿子是爸爸的祖先：', path.isAncestor(path.parentPath))
        console.log('儿子是爷爷的祖先：', path.isAncestor(path.parentPath.parentPath))
        console.log('儿子是孙子的祖先：', path.isAncestor(path.get('left')))
    }
}

let ast = parser.parse(jscode);
traverse(ast, visitor);
~~~


<details>
    <summary>结果</summary>   
<pre>
当前路径源码:
 a = b + 1
儿子是爸爸的祖先： false
儿子是爷爷的祖先： false
儿子是孙子的祖先： true
</pre>
</details>





#### NodePath.inType(\*\*NodeType_str)  

`@return bool`  
判断当前`Path`对应节点，或其 父/祖先 节点 是否包含特定类型的节点  
可以一次性传入多个类型，只要有一个符合就会返回 `true`, 否则返回 `false`  

>例: 是否包含特定类型的节点  

~~~javascript
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

var jscode = `
function f2(){
    var b = 123;
    a = b + 1;
}`;

const visitor = {
    AssignmentExpression(path){
        console.log('当前路径源码:\n', path.toString());
        _is = path.inType('FunctionDeclaration')
        console.log('父级或自身包含函数声明节点：', _is);
        _is = path.inType('WithStatement', 'DebuggerStatement')
        console.log('父级或自身包含 with 或 debugger：', path.inType(_is));
    }
}

let ast = parser.parse(jscode);
traverse(ast, visitor);
~~~


<details>
    <summary>结果</summary>   
<pre>
当前路径源码:
a = b + 1
父级或自身包含函数声明节点： true
父级或自身包含 with 或 debugger： false
</pre>
</details>







#### NodePath.getDeepestCommonAncestorFrom(paths, filter)  

`@return NodePath | 自定义`  
获取传入的`Path`对应节点的 最大深度共同祖先节点的`Path`  

* 当 `paths`不存在`length`属性时，报错  
* 当 `paths` 长度为0时，返回 `null`  
* 当 `paths` 长度为1时，返回唯一的`Path`  
* 当 `paths` 大于1  
    * 计算 最大深度共同祖先节点 的`Path`并返回  
    * 当传入一个`filter`函数，那么返回结果会作为参数进行回调。返回结果变为`filter(最大深度共同祖先节点Path:NodePath, 深度:int, 所有path的祖先信息:list);`  
* 如果并不存在共同的祖先节点，报错  


>例：最大深度的共同祖先节点  

~~~javascript
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

var jscode = `
function f(){
    function f3(){
        function f1(){return 1;}
        function f2(){return 2;}
        return 3;
    }
}`;


let paths = []

const visitor = {
    ReturnStatement(path){
        console.log('路径源码:\n', path.toString());
        paths.push(path)
        if (paths.length > 1){
            _is = path.getDeepestCommonAncestorFrom(paths)
            console.log('最大深度的共同祖先节点 源代码：', _is.toString());
        }
    }
}

let ast = parser.parse(jscode);
traverse(ast, visitor);
~~~

<details>
<summary>结果</summary>   
<pre>
路径源码:
 return 1;
路径源码:
 return 2;
最大深度的共同祖先节点 源代码： {
  function f1() {
    return 1;
  }
<span></span>
  function f2() {
    return 2;
  }
<span></span>
  return 3;
}
路径源码:
 return 3;
最大深度的共同祖先节点 源代码： {
  function f1() {
    return 1;
  }
  function f2() {
    return 2;
  }
<span></span>
  return 3;
}
</pre>
</details>





#### NodePath.getEarliestCommonAncestorFrom(paths)  

`@return NodePath`  
获取多个 `NodePath`对象的 最早出现的共同祖先  
方法会遍历计算，共同祖先一旦出现, 则返回，不再继续计算所有的 `NodePath`    

此方法是调用 [NodePath.getDeepestCommonAncestorFrom(paths, filter)](#nodepathgetdeepestcommonancestorfrompaths-filter) 方法，传入固定的 `filter` 函数来实现    

~~~javascript
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

var jscode = `
function f(){
    function f3(){
        function f1(){return 1;}
        function f2(){return 2;}
        return 3;
    }
}`;


let paths = []

const visitor = {
    ReturnStatement(path){
        console.log('路径源码:\n', path.toString());
        paths.push(path)
        if (paths.length > 1){
            _is = path.getEarliestCommonAncestorFrom(paths)
            console.log('最早的共同祖先节点 源代码：', _is.toString());
        }
    }
}

let ast = parser.parse(jscode);
traverse(ast, visitor);
~~~



### family  

主要用于获取同级/前后 `NodePath`  




#### NodePath.getSibling(key)  

`@return NodePath`  

通过父级，获取同级节点的 `NodePath` 或 其它内容  

* 如果传入数字，则尝试获取 同级节点 指定位置的 `NodePath`  

* 如果传入数字，则尝试获取 父级节点 指定位置的 `NodePath`  

* 也可以传入一些特殊的key, 获取一些特殊的内容  

  可以使用 `NodePath.listKey`属性 查看可以获取的key  

> 例: 寻找其它内容  

~~~javascript
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

const jscode = `
function x(){
  console.log('code 1');
  console.log('code 2');
  var a = 1;
  console.log('code 3');
  console.log('code 4');
}
`;

const ast = parser.parse(jscode);
const visitor = {
  VariableDeclaration(path) {
    console.log('当前节点源码:\n', path.toString());
    console.log('---------------------------------------------');
    console.log('第1个兄弟的源码', path.getSibling(0).toString());
    console.log('第2个兄弟的源码', path.getSibling(1).toString());
    console.log('第3个兄弟的源码', path.getSibling(2).toString());
    console.log('第4个兄弟的源码', path.getSibling(3).toString());
    console.log('第5个兄弟的源码', path.getSibling(4).toString());
    console.log(path.listKey)
    console.log('---------------------------------------------');
  }
}
traverse(ast, visitor);
~~~

 

<details>
    <summary>结果</summary>   
    <pre>
当前节点源码:
var a = 1;
---------------------------------------------
第1个兄弟的源码 console.log('code 1');
第2个兄弟的源码 console.log('code 2');
第3个兄弟的源码 var a = 1;
第4个兄弟的源码 console.log('code 3');
第5个兄弟的源码 console.log('code 4');
body
---------------------------------------------
</pre>
</details>





#### NodePath.getOpposite()  

`@return Node`  

获取相对的对位节点 (`left` 与 `right`)  

此函数通过调用 [`NodePath.getSibling(key)`](#nodepathgetsiblingkey) , 传入 当前节点的 `left` 或 `right` `key`实现  

> 例：获取对位节点  

~~~javascript
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

const jscode = `
  var a = 1 + 9;
`;

const ast = parser.parse(jscode);
const visitor = {
  NumericLiteral(path) {
    console.log('当前节点源码:\n', path.toString())
    console.log('对应节点源码:\n', path.getOpposite().toString())
    console.log('----------------')
  }
}

traverse(ast, visitor);
~~~



<details>
<summary>结果</summary>   
<pre>
当前节点源码:
 1
对应节点源码:
 9
----------------
当前节点源码:
 9
对应节点源码:
 1
----------------
</pre>
</details>





#### NodePath.getPrevSibling()  

`@return Node`  

获取同级前一个节点的 `NodePath`

此函数源码就一句  `return this.getSibling(this.key - 1);`   

~~~javascript
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

const jscode = `
 var a = 1 + 9;
 a = a + a;
 console.log(a);
 console.log(b);
`;

const ast = parser.parse(jscode);
const visitor = {
 ExpressionStatement(path) {
  console.log('当前节点源码:\n', path.toString())
  console.log('同级前一个节点源码:\n', path.getPrevSibling().toString())
  console.log('----------------')
 }
}

traverse(ast, visitor);
~~~



<details>
<summary>结果</summary>   
<pre>
当前节点源码:
 a = a + a;
同级前一个节点源码:
 var a = 1 + 9;
----------------
当前节点源码:
 console.log(a);
同级前一个节点源码:
 a = a + a;
----------------
当前节点源码:
 console.log(b);
同级前一个节点源码:
 console.log(a);
----------------
</pre>
</details>





#### NodePath.getNextSibling()  

`@return Node`  

获取同级后一个节点的 `NodePath`  

此函数源码就一句 `return this.getSibling(this.key + 1);`  

~~~javascript
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

const jscode = `
  var a = 1 + 9;
  a = a + a;
  console.log(a);
  console.log(b);
`;

const ast = parser.parse(jscode);
const visitor = {
  ExpressionStatement(path) {
    console.log('当前节点源码:\n', path.toString())
    console.log('同级后一个节点源码:\n', path.getNextSibling().toString())
    console.log('----------------')
  }
}

traverse(ast, visitor);
~~~



<details>
<summary>结果</summary>   
<pre>
当前节点源码:
 a = a + a;
同级前一个节点源码:
 console.log(a);
----------------
当前节点源码:
 console.log(a);
同级前一个节点源码:
 console.log(b);
----------------
当前节点源码:
 console.log(b);
同级前一个节点源码:
<span></span>
----------------
</pre>
</details>





#### NodePath.getAllPrevSiblings()  

`@return Array`  

获取当前节点前的兄弟节点的 `NodePath`，结果存放在一个数组中返回  

~~~javascript
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

const jscode = `
  var a = 1 + 9;
  a = a + a;
  console.log(a);
  console.log(b);
`;

const ast = parser.parse(jscode);
const visitor = {
  ExpressionStatement(path) {
    console.log('当前节点源码:\n', path.toString())
    const pre_nodepath = path.getAllPrevSiblings()
    console.log('前面的兄弟节点源码:')
    for(var nodepath of pre_nodepath){
      console.log(nodepath.toString())
    }
    console.log('----------------')
  }
}

traverse(ast, visitor);
~~~



<details>
<summary>结果</summary>   
<pre>
当前节点源码:
 a = a + a;
前面的兄弟节点源码:
var a = 1 + 9;
----------------
当前节点源码:
 console.log(a);
前面的兄弟节点源码:
a = a + a;
var a = 1 + 9;
----------------
当前节点源码:
 console.log(b);
前面的兄弟节点源码:
console.log(a);
a = a + a;
var a = 1 + 9;
----------------
</pre>
</details>





#### NodePath.get(key, context)  

`@return NodePath`  

用于获取子孙节点  

如果不传入 `context` 参数, 则以当前 `NodePath` 对应节点为起点  

如果传入，则以传入的 `NodePath` 对应节点为起点  

如果想要获取更多层级的子孙，可以用 `.` 隔开进行获取  

* 获取某个单个属性节点 `.名字`  

* 获取某个节点的第 x 个节点 `.x`  



~~~javascript
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

const jscode = `function square(n) {
  var a = 1;
  return 1 + 1;
}`;

const ast = parser.parse(jscode);
const visitor = {
  FunctionDeclaration(path) {  // 找到变量声明节点，删除
      var p1 = path.get('body')
      console.log('body 子节点源码:\n', p1.toString())
      var p2 = path.get('body.body.0')
      console.log('body.body.0 子节点源码:\n', p2.toString())
  }
}

traverse(ast, visitor);
~~~



<details>
<summary>结果</summary>   
<pre>
body 子节点源码:
 {
  var a = 1;
  return 1 + 1;
}
body.body.0 子节点源码:
 var a = 1;
</pre>
</details>





#### NodePath.getBindingIdentifiers()

`@return dict(Node}`  

用于获取当前 `NodePath` 所包含的 `Identifier` 节点  

~~~javascript
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");

const jscode = `function square(n) {
  var a = 1;
  a += 2;
  return a;
}`;

const ast = parser.parse(jscode);
const visitor = {
  exit(path) {
    if (t.isProgram(path)){return;}
    console.log('当前节点：', path.toString())
    console.log('当前语句', path.getStatementParent().toString())
    let _ids = path.getBindingIdentifiers()
    if(_ids == null){return;}
    console.log(_ids)
    console.log('--------------------------------')
  }
}

traverse(ast, visitor);
~~~





### removal  

移除相关  



#### NodePath.remove()  

`@return null`  
删除路径对应的节点  

删除以后，对应的`removed`标识为会被设定，内容会被设定为只读  
如果再次执行`remove`方法，则会报错  

>例：删除 path 对应的节点  

~~~javascript
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;

const jscode = `function square(n) {
  var a = 1;
  return 1 + 1;
}`;

const ast = parser.parse(jscode);
const visitor = {
  VariableDeclaration(path){  // 找到变量声明节点，删除
      path.remove()
  }
}

traverse(ast, visitor);
console.log(generator(ast)['code'])
~~~

得到结果：  





~~~javascript
function square(n) {
  return 1 + 1;
}
~~~



### scope  

此模块与作用域相关  



#### Scope  

和 作用域 相关的内容被定义在了 Scope类 中  
这个类定义位于 `@babel/traverse/lib/scope/index.js` 文件中  



##### Scope属性  

> 例：输出一些属性，一般不会直接使用，但可以留个印象，后面的函数可能会使用属性    

~~~javascript
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
        console.log('--------------------------------')
        sc = path.scope  // 获取对应的 Scope对象
        console.log('这个对象是否已经初始化：', sc.inited)
        console.log('uid 属性', sc.uid)
        console.log('cached 属性', sc.cached)
        console.log('node 属性', sc.node)
        console.log('作用域节点：', sc.block)
        console.log('作用对应的path：', sc.path.node == sc.block)
        console.log('labels 属性', sc.labels)
        console.log('绑定 的信息：', sc.bindings)
        console.log('--------------------------------')
    }
}

traverse(ast, visitor);
~~~

你能够直接访问`Scope`对象的属性，它本身也提供了一些方法来访问  




##### Scope.parent  

`@return Scope | undefined`  

获取当前作用域的父级作用域  

此方法通过引用其 `Scope.path` 属性的  [`PathNode.findParent()`](#nodepathfindparentcallback) 方法 获取对应`PathNode`后再次获取作用域的方式获取  



> 例：获取父级作用域


~~~javascript
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
        console.log('--------------------------------')
        sc = path.scope  // 获取对应的 Scope对象
        console.log('parent结果：', sc.parent)
    }
}

traverse(ast, visitor);
~~~

<details>
    <summary>结果</summary>   
    <pre><code>       
    这里是 var g = 1;
    --------------------------------
    parent结果： undefined
    这里是 var i = 123;
    --------------------------------
    parent结果： Scope {
      uid: 0,
      block: Node {
        type: 'Program',
        start: 0,
        end: 118,
        loc: SourceLocation { start: [Position], end: [Position] },
        sourceType: 'script',
        interpreter: null,
        body: [ [Node], [Node], [Node] ],
        directives: []
      },
      path: NodePath {
        parent: Node {
          type: 'File',
          start: 0,
          end: 118,
          loc: [SourceLocation],
          errors: [],
          program: [Node],
          comments: []
        },
        hub: undefined,
        contexts: [ [TraversalContext] ],
        data: null,
        _traverseFlags: 0,
        state: undefined,
        opts: { VariableDeclaration: [Object], _exploded: true, _verified: true },
        skipKeys: null,
        parentPath: null,
        context: TraversalContext {
          queue: [Array],
          parentPath: undefined,
          scope: undefined,
          state: undefined,
          opts: [Object],
          priorityQueue: []
        },
        container: Node {
          type: 'File',
          start: 0,
          end: 118,
          loc: [SourceLocation],
          errors: [],
          program: [Node],
          comments: []
        },
        listKey: undefined,
        key: 'program',
        node: Node {
          type: 'Program',
          start: 0,
          end: 118,
          loc: [SourceLocation],
          sourceType: 'script',
          interpreter: null,
          body: [Array],
          directives: []
        },
        scope: [Circular],
        type: 'Program'
      },
      labels: Map {},
      inited: true,
      references: [Object: null prototype] { g: true, i: true, squire: true },
      bindings: [Object: null prototype] {
        g: Binding {
          identifier: [Node],
          scope: [Circular],
          path: [NodePath],
          kind: 'var',
          constantViolations: [],
          constant: true,
          referencePaths: [Array],
          referenced: true,
          references: 1,
          hasDeoptedValue: false,
          hasValue: false,
          value: null
        },
        squire: Binding {
          identifier: [Node],
          scope: [Circular],
          path: [NodePath],
          kind: 'hoisted',
          constantViolations: [],
          constant: true,
          referencePaths: [],
          referenced: false,
          references: 0,
          hasDeoptedValue: false,
          hasValue: false,
          value: null
        },
        i: Binding {
          identifier: [Node],
          scope: [Circular],
          path: [NodePath],
          kind: 'hoisted',
          constantViolations: [],
          constant: true,
          referencePaths: [],
          referenced: false,
          references: 0,
          hasDeoptedValue: false,
          hasValue: false,
          value: null
        }
      },
      globals: [Object: null prototype] {},
      uids: [Object: null prototype] {},
      data: [Object: null prototype] {},
      crawling: false
    }
    </code></pre> 
</details>


##### Scope.rename(oldName, newName, block)   

更改绑定名称，更改后会牵连所有引用的位置，留意是否会造成问题  

> 例: 重命名绑定

~~~javascript
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

~~~



<details>
<summary>结果</summary>   
<pre>
function a(_x_) {
  return _x_ * _x_;
}
</pre>
</details>







##### Scope.dump()  
`return null`  

输出到自底向上的 作用域与被绑定量的信息  

执行后会得到类似于这样的输出信息  
~~~
## FunctionDeclaration
 - i { constant: false, references: 0, violations: 1, kind: 'var' }
## Program
 - squire { constant: true, references: 0, violations: 0, kind: 'hoisted' }
 - i { constant: true, references: 0, violations: 0, kind: 'hoisted' }
~~~

作用域 以`#`划分，此处有两个作用域 `FunctionDeclaration` 与 `Program`  

被绑定量 以最前方设置`-`来标识，一般显示其中的4种信息  
* constant  
   量 在声明后，在作用域内是否为常量（不会被修改）  
   实际上对应对应量的 [`Binding`](#Binding) 对象的`Binding.constant`属性  
* references  
   被引用次数  
   实际上对应对应量的 [`Binding`](#Binding) 对象的`Binding.references`属性  
* violations  
   量 被 重新定义/赋值 的次数  
   实际上对应对应量的 [`Binding`](#Binding) 对象的`Binding.constantViolations`的长度。这个属性被用于记录变更位置（每次变更都添加内容）  
* kind  
   函数声明类型。常见的有：`hoisted`提升，`var`变量， `local`内部  
   实际上对应对应量的 [`Binding`](#Binding) 对象的`Binding.kind`属性  

实际上这些信息大部分 （以一个被绑定量，一个  [`Binding`](#Binding) 对象的方式）储存在 `Scope.bindings` 这个属性中  

>例：使用案例  

~~~javascript
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

const jscode = `
function squire(i){
    return i * i * i;
}
function i(){
    var i = 123;
    i += 2;
    return 123;
}
`;
let ast = parser.parse(jscode);
const visitor = {
    "FunctionDeclaration"(path){
        console.log("\n\n这里是函数 ", path.node.id.name + '()')
        path.scope.dump();
    }
}

traverse(ast, visitor);
~~~
得到结果：  



<details>
<summary>结果</summary>   
<pre>
这里是函数  squire()
------------------------------------------------------------
## FunctionDeclaration
 - i { constant: true, references: 3, violations: 0, kind: 'param' }
## Program
 - squire { constant: true, references: 0, violations: 0, kind: 'hoisted' }
 - i { constant: true, references: 0, violations: 0, kind: 'hoisted' }
------------------------------------------------------------
<span></span>
<span></span>
这里是函数  i()
------------------------------------------------------------
## FunctionDeclaration
 - i { constant: false, references: 0, violations: 1, kind: 'var' }
## Program
 - squire { constant: true, references: 0, violations: 0, kind: 'hoisted' }
 - i { constant: true, references: 0, violations: 0, kind: 'hoisted' }
------------------------------------------------------------
</pre>
</details>







##### Scope.parentBlock(name)  

`@return Node`  

获取 作用域路径 的父级  
它的源码就一句 `return this.path.parent;`    

> 例: 获取作用域路径的父级  

~~~javascript
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
        console.log('结果：', path.scope.parentBlock)
    }
}

traverse(ast, visitor);
~~~

<details>
    <summary>结果</summary>   
    <pre><code>       
    这里是 return g;
    结果： Node {
      type: 'Program',
      start: 0,
      end: 69,
      loc: SourceLocation {
        start: Position { line: 1, column: 0 },
        end: Position { line: 5, column: 0 }
      },
      sourceType: 'script',
      interpreter: null,
      body: [
        Node {
          type: 'VariableDeclaration',
          start: 1,
          end: 11,
          loc: [SourceLocation],
          declarations: [Array],
          kind: 'var'
        },
        Node {
          type: 'FunctionDeclaration',
          start: 12,
          end: 35,
          loc: [SourceLocation],
          id: [Node],
          generator: false,
          async: false,
          params: [],
          body: [Node]
        },
        Node {
          type: 'FunctionDeclaration',
          start: 36,
          end: 68,
          loc: [SourceLocation],
          id: [Node],
          generator: false,
          async: false,
          params: [],
          body: [Node]
        }
      ],
      directives: []
    }
    这里是 return z;
    结果： Node {
      type: 'Program',
      start: 0,
      end: 69,
      loc: SourceLocation {
        start: Position { line: 1, column: 0 },
        end: Position { line: 5, column: 0 }
      },
      sourceType: 'script',
      interpreter: null,
      body: [
        Node {
          type: 'VariableDeclaration',
          start: 1,
          end: 11,
          loc: [SourceLocation],
          declarations: [Array],
          kind: 'var'
        },
        Node {
          type: 'FunctionDeclaration',
          start: 12,
          end: 35,
          loc: [SourceLocation],
          id: [Node],
          generator: false,
          async: false,
          params: [],
          body: [Node]
        },
        Node {
          type: 'FunctionDeclaration',
          start: 36,
          end: 68,
          loc: [SourceLocation],
          id: [Node],
          generator: false,
          async: false,
          params: [],
          body: [Node]
        }
      ],
      directives: []
    }
    </code></pre> 
</details>



##### Scope.getBinding(name)  

`@return Binding`  

在作用域中获取指定的 [`Binding`](#Binding)对象  

如果在 当前作用域 找不到指定的 被绑定量，那么就会递归在父级作用域中寻找  

> 例：获取指定的 被绑定量对象  

~~~javascript
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
~~~



##### Scope.getOwnBinding(name)  

`@return Binding`  

传入一个名称，从当前的 作用域 中拿到指定的 [`Binding`](#Binding) 对象  
实际上方法的源码就一句`return this.bindings[name];`    

~~~javascript
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
~~~



##### Scope.getBindingIdentifier(name)    
`@return Node | void 0`  
获取指定的  [`Binding`](#Binding) 的定义节点`Node`    

方法作用域获取 [`Binding`](#Binding) ，再通过这个  [`Binding`](#Binding)  获取其定义的节点    

这个方法通过 [`Scope.getBinding(name)`](#scopegetbindingname) 方法获取 [`Binding`](#Binding)  ，所以会存在递归向上的情况    

~~~javascript
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
        console.log(n, '的定义：', path.scope.getBindingIdentifier(n))
    }
}

traverse(ast, visitor);
~~~



##### Scope.getOwnBindingIdentifier(name)  

`@return Node|void 0`  
获取指定的 [`Binding`](#Binding) ，并通过这个  [`Binding`](#Binding)  获取其定义的节点  
这个方法只关注 当前作用域，并不会去上级作用域中寻找    

~~~javascript
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
        console.log(n, '的定义：', path.scope.getOwnBindingIdentifier(n))
    }
}

traverse(ast, visitor);
~~~



<details>
<summary>结果</summary>   
<pre>
这里是 return g;
g 的定义： undefined
<span></span>
这里是 return z;
z 的定义： Node {
  type: 'Identifier',
  start: 53,
  end: 54,
  loc: SourceLocation {
    start: Position { line: 4, column: 17 },
    end: Position { line: 4, column: 18 },
    identifierName: 'z'
  },
  name: 'z'
}
</pre>
</details>







##### Scope.hasOwnBinding(name)  

`@return bool`  

获知当前作用域是否有某个 [`Binding`](#Binding)  

~~~javascript
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
        console.log('当前作用域有 绑定 z:', path.scope.hasOwnBinding('z'))
        console.log('当前作用域有 绑定 g:', path.scope.hasOwnBinding('g'))
    }
}

traverse(ast, visitor);

~~~



<details>
<summary>结果</summary>   
<pre>
这里是 return g;
当前作用域有 绑定 z: false
当前作用域有 绑定 g: false
<span></span>
这里是 return z;
当前作用域有 绑定 z: true
当前作用域有 绑定 g: false
</pre>
</details>



两个函数的作用域内都不会有`g`的绑定，因为它被绑定在更上级作用域中  





##### Scope.hasBinding(name, noGlobals)  

`@return bool`  
向上递归作用域，获知是否有某个被绑定变量  

~~~javascript
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
~~~






#### Binding  

`Binding` 对象用于存储 被绑定在作用域的量 的信息  
你可以在 `@babel/traverse/lib/scope/binding.js` 查看到它的定义  




##### Binding属性  

~~~javascript
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

const jscode = `
function a(){
    var a = 1;
    a = a + 1;
    return a;
}
function b(){
    var b = 1;
    var c = 2;
    b = b - c;
    return b;
}
`;
let ast = parser.parse(jscode);
const visitor = {
    BlockStatement(path){
        console.log("\n此块节点源码：\n", path.toString())
        console.log('----------------------------------------')
        var bindings = path.scope.bindings
        console.log('作用域内 被绑定量 数量：', Object.keys(bindings).length)

        for(var binding_ in bindings){
            console.log('名字：', binding_)
            binding_ = bindings[binding_];
            console.log('类型：', binding_.kind)
            console.log('定义：', binding_.identifier)
            console.log('是否为常量：', binding_.constant)
            console.log('被修改信息信息记录', binding_.constantViolations)
            console.log('是否会被引用：', binding_.referenced)
            console.log('被引用次数', binding_.references)
            console.log('被引用信息NodePath记录', binding_.referencePaths)
        }
    }
}

traverse(ast, visitor);

~~~



### comments  

注释相关  



#### NodePath.addComment(type, content, line)  

`@return None`  

添加注释  

实际上只是调用`types.addComment` 的方法而已  

| 参数名 | 参数类型 | 说明 |
| ------ | -------- | ---- |
|`type` |`String` |指定添加的注释方式。如果填入`"leading"`，则添加的注释会插入已有注释之前，否则在原有注释之后  |
|`content` |`String` |注释内容|
|`line` |`bool` |插入行注释还是块注释|



> 例：插入注释  

~~~javascript
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;

const jscode = `
  var a = 1 + 9;
`;

const ast = parser.parse(jscode);
const visitor = {
  NumericLiteral(path) {
    console.log('当前节点源码:\n', path.toString());
    path.addComment('trailing', "注释", false);
  }
}

traverse(ast, visitor);
console.log(generator(ast)['code'])
~~~





## @babel/types  



### utils  




#### Types.shallowEqual(actual, expected)  

`@return bool`  

对比函数，`expected`传入一个字典进行 `key`, `value` 遍历  

获取 `actual`.`key` 的值与 `value` 进行对比  

如果有一个不一致，那么返回 `false`, 否则返回 `true`  

其定义在： `@babel/types/lib/validators/generated/index.js`  

> 例：判断节点的name是否为`a`  

~~~j\avascript
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");

const jscode = 'var a=1; var b=1+1;';
let ast = parser.parse(jscode);

const visitor = {
  enter(path){
    console.log('当前节点源码：', path.toString())
    console.log('其属性name为a:', t.shallowEqual(path.node, {'name':'a'}))
  }
}

traverse(ast, visitor);
~~~



### validators  

#### Types.isNodeType(node, opts)  

`@return bool`  

这并不是一个函数，这是一大堆由生成代码生成的函数，大约有290个

这些函数定义在 `@babel/types/lib/validators/generated/index.js`



函数逻辑都是类似的  

1. if( 没有node ) return `false`  

2. if(`node.type` == `声明类型`) return `false`  

3. else if( 没有opts ) return `true`

4. else return [types.shallowEqual(node, opts)](#typesshallowequalactual-expected)

> 例: 判断节点是否符合判断  

~~~javascript
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");

const jscode = 'var a=1;var b=1+1;';
let ast = parser.parse(jscode);

const visitor = {
 enter(path){
  console.log('当前节点源码：', path.toString())
  console.log('是 Identifier', t.isIdentifier(path.node))
  console.log('是 Identifier 且其属性name为a:', t.isIdentifier(path.node, {'name':'a'}))
 }
}

traverse(ast, visitor);
~~~



## 参考  

***

* [jamiebuilds/babel-handbook](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md#toc-bindings)  
* [docsify 文档](https://docsify.js.org)
