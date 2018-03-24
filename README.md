# fle-cli

A convenient global compiler.

## Installation

``` bash
$ npm install -g fle-cli

# yarn
$ yarn global add fle-cli
```

## Usage

``` bash
# for help
$ fle

# generate the project
$ fle init <project-name>

# open server in development
$ fle dev

# build pages or demo in production
$ fle build

# build vendors with dll
$ fle dll

# build library or module in production
$ fle lib

# now you can upload files
$ fle upload <file|glob>
```

参数：

```
# 开启手机debug调试
# fle dev --log

# 编译并将文件上传至cdn
# fle build --upload

# 编译开发环境的第三方库
# $ fle dll --dev

# 编译并将文件上传至cdn
# fle dll --build --upload

# init config before upoload files
$ fle upload --init

# optimize images
$ fle upload --min <images>
```

**alias**

* i -> init
* d -> dev
* l -> lib
* b -> build
* u -> upload

说明：

* 每天第一次启动时会检查是否有更新的版本，若有则提示
* dll启动时会分离出第三方依赖（需要在fle.json中的vendors配置），若开启上传则会在js中自动添加外链引用
* dev和build启动时会自动检查是否有dll分离出来的第三方依赖，若有则开启dll模式
* dev和dll可以指定要编译的目录，详细信息：$ fle build -h
* 开启上传功能需要配置密钥等信息，否则无法上传，[cdn参数配置](https://g.hz.netease.com/huangancheng/documents/blob/master/fle/nosConfig.md)【需要访问仅限】，或者也可以在[【这里申请】](https://www.163yun.com/help/documents/15677635979624448)。

## Project

**webpack**

* fle.json fle的项目配置文件
* src 源码
  * common 公共文件，不会当成页面来打包
  * index 示例页面文件，新建页面参考此结构
    * app.json 页面配置
    * index.js 页面入口，也可以在app.json的entry定义
    * module.js 组建入口，也可以在app.json的module定义
    * style.css 以`.css`结尾，全局样式文件，支持sass写法
    * style.module.css 以`.module.css`结尾，启用css-modules，生成hash className，引入css后可以获取className对象
* index.html 页面模版，可参考此内容来新建模版，也可以使用系统模版，以`/`开头，如：/default.html
* dist 页面编译后生成的文件
* lib 组建编译后生成的文件
* .cache 编译缓存文件

**rollup**

* fle.json fle的项目配置文件
* src js库源码，入口文件为index.js
* public 示例代码
  * index.html 示例html文件
  * demo 示例源码
  * dist 编译代码
* lib js库编译后代码
  * index.js commonjs模块或自执行函数（iife）
  * index.esm.js es6模块，保留node_modules模块的引用
  * style.css 分离出的样式，通过extract设置是否需要编译js库的样式

**fle.json**

```
{
  "boilerplate": "app", // 项目类型，初始化生成，无需改动，否则会导致编译目标无法找到

  /* 以下为webpack项目配置 */

  "business": "test", // 业务名称，用于上传cdn的标识，若不设置则动态上传，每次的url都不一样，不利于缓存命中，固定的业务线请务必设置
  "eslint": true, // 是否开启eslint代码检测
  "notify": true, // 【dev】当编译出错时是否开启系统通知
  "vendors": null, // 【build】抽离第三方模块，格式：{ name: array, ... }
  "inlineManifest": true, // 【build】是否将manifest文件写入html
  "publicPath": "/", // 【build】编译后文件引用前缀
  "splitCommon": false, // 是否要抽离公共代码
  "remUnit": 50, // 1rem=50px

  "port": 5000, // 【dev】端口
  "proxy": {}, // 【dev】接口代理配置
  "hot": true, // 【dev】是否开启热更新
  "open": false, // 【dev】是否自动打开浏览器
  "https": false, // 【dev】是否开启https

  "css": [], // css外链
  "prejs": [], // 预加载的js外链，位于head
  "js": [], // 加载js外链，位于body

  "browsers": [ // 需要兼容的浏览器配置
    "last 2 versions",
    "ie >= 9",
    "ios >= 7",
    "android >= 4"
  ],
  "externals": {}, // 页面引用忽略，转而使用全局变量
  "libExternals": {}, // 组建引用忽略，转而使用全局变量

  /* 以下为rollup项目配置 */

  "iife": false, // 是否要导出自执行模块，否则导出es6和commonjs模块
  "eslint": true, // 是否开启eslint代码检测
  "port": 5000, // 【dev】端口
  "hot": true, // 【dev】是否开启热更新
  "https": false, // 【dev】是否开启https
  "extract": false, // 是否需要编译css文件（若js库无css样式，建议关闭，减少冗余代码）
  "remUnit": 50,
  "browsers": [
    "last 2 versions",
    "ie >= 9",
    "ios >= 7",
    "android >= 4"
  ]
}
```

说明：

vendors配置，分离多个第三方模块，避免集中在一个文件导致体积太大。

```
{
  "react": ["react", "react-dom"],
  "router": ["react-router", "redux"]
}
```

prejs和js可以设置externals，例如：

```
// 一般用法
"js": ["https://cdn.com/xxx.js"]

// 设置externals，会合并到externals字段
// 以下配置会忽略源码中对react的引用，转而使用window.React，因为我们通过cdn引入react代码，无需再打包编译
"js": [
  {
    "src": "https://cdn.com/react.js",
    "name": "react",
    "value": "window.React"
  }
]
```

**app.json**

```
{
  "title": "示例", // 页面标题
  "keyswords": "example", // 页面关键词
  "description": "示例页面", // 页面描述
  "icon": "https://easyread.nosdn.127.net/web/trunk/1519626068077/logo.png", // 页面icon
  "template": "index.html", // 页面模版，也可以自行扩展，或者/开头来使用系统配置好的模版，如：/default.html
  "entry": "index.js", // 设置页面入口
  "module": "module.js", // 设置组件入口
  "moduleName": "name", // 分离出的组件名称，若不设置则取该目录的名称
  "compiled": true // 是否要编译本页面，若为false则不编译
}
```

说明：除以上字段外，可以额外添加字段，在html模版中通过以下方式获取：如额外添加name，则htmlWebpackPlugin.options.name可以获取该值

## Config

需要自定义额外配置，可在项目根目录新建以下文件，系统会自动合并到默认配置并覆盖

* .babelrc babel配置
* .eslintrc eslint配置
* webpack.dev.config.js 开发模式配置
* webpack.build.config.js 生产模式配置
* webpack.dll.config.js dll配置
* webpack.lib.config.js 组件配置

## Others

js：

* 别名：@，表示src目录的绝对路径，如：@/common/module，即 src/common/module.js 或 src/common/module/index.js

css：

* px：正常输出px
* rpx：转换为rem，默认1rem=50px，根据配置来定
* 以`.module.css`为后缀的样式文件会自动启动css-modules功能，解决类名嵌套和冲突的情况

## Issues

* `.ico`类型的图片无法上传，会导致报错