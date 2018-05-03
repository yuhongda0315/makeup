### 使用说明

1、根目录执行：

```
npm install -g makeup_martin
```


2、命令 

查看帮助信息: `makeup -h`

```
  Usage: makeup [options]

  Options:

    -V, --version          output the version number
    -i, --input [dir]      message input dir or file path
    -o, --output [dir]     message output dir, default ./
    -t, --template [type]  templates path, default java.js
    -d, --docs             generate the document from the input json
    -h, --help             output usage information
```


3、示例

`模版`:

```js
// template.js

'use strict';
let tpl = `
语文:{{this.chinese}}

数学:{{this.mathematics}}

英语:{{this.english}}

平均: {{ (this.english + this.mathematics + this.chinese)/3 }}
`;

let ext = 'txt';
module.exports = {
  tpl: tpl,
  ext: ext
};

```

`数据`

```json
// data.json
{
  "Martin-成绩单": {
    "chinese": 95,
    "mathematics": 90,
    "english": 98
  }
}
```

`运行`:
```
makeup -i data.json -t template.js -o ./

```

`结果`:

在当前目录生成 `Martin-成绩单.txt`


4、模版语法

>示例

```js
/*
  模版，this 为当前数据对象，比如:
  var user = {
    name: 'Martin'
  };
  this 指的是 user
*/ 
let tpl = `{{this.name}}`;

let ext = 'txt';
module.exports = {
  tpl: tpl,
  ext: ext
};

/*
数据
在指定路径 (`-o`) 生成 user.txt (ext)
*/
{
  "user": {
    "name": "Martin"
  }
}

//输出
`user.txt` => 'Martin'

```

>if

`模版`

```js
let tpl = `
姓名: 
{{this.name}}

性别: 
{{ if( this.gender == 1){ }} 
  女
{{ } }}
{{ if( this.gender == 2){ }} 
  男
{{ } }}
`;
let ext = 'txt';
module.exports = {
  tpl: tpl,
  ext: ext
};
```

`数据`:

```json
{
  "user": {
    "name": "Martin",
    "gender": 2
  }
}
```

`结果`:

user.txt

```
姓名: Martin
性别: 男
```

>for

`模版`
```
let tpl = `
姓名: 
{{this.name}}

性别: 
{{ if( this.gender == 1){ }} 
  女
{{ } }}
{{ if( this.gender == 2){ }} 
  男
{{ } }}

爱好:
{{ for(var name in this.hobbies){ }}
  {{ this.hobbies[name] }} 
{{ } }}
`;
// 文件后缀名
let ext = 'txt';
module.exports = {
  tpl: tpl,
  ext: ext
};

```

```json
{
  "user": {
    "name": "Martin",
    "gender": 2,
    "hobbies": ["吃饭", "睡觉"]
  }
}
```

`结果`:

```
姓名: Martin
性别: 男
爱好: 吃饭 睡觉

```




