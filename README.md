### 使用说明

1、根目录执行：

```
npm install
```


2、命令 

查看帮助信息: `node generator -h`

```
  Usage: generator [options]

  Options:

    -V, --version          output the version number
    -i, --input [dir]      message input dir or file path
    -o, --output [dir]     message output dir, default ./
    -l, --language [type]  template language default java
    -h, --help             output usage information
```


3、示例

生成 `example` 目录下 `chatroom.json` 中对应的消息类

```
node generator -i ./example -o ./example

```