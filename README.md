# fle-cli

[![version](https://img.shields.io/npm/v/fle-cli.svg)](https://www.npmjs.org/package/fle-cli)

方便、灵活、零配置的全局代码编译器。

它可以在任何目录工作，不需要安装编译文件即可运行，而且也不需要安装各种编译需要的依赖包，这就意味着项目工程将会变得非常简洁。

它兼容`Mac`和`Windows`，在使用过程中有任何问题和建议，欢迎邮件发给我：*ancheng1992@126.com*。

## 开始安装

``` bash
$ npm install -g fle-cli

# yarn
$ yarn global add fle-cli
```

## 如何使用

``` bash
# for help
$ fle

# generate the project
$ fle init <project>

# open server in development
$ fle dev

# build pages or demo in production
$ fle build

# build library or module in production
$ fle lib

# upload files to cdn
$ fle upload <file|glob>
```

## 命令选项

``` bash
# create page in project
$ fle init <page> --page

# show debug on phone
$ fle dev --log

# build and upload files to cdn
$ fle build --upload

# configure secretKey before upoload files
$ fle upload --init

# upload and optimize images
$ fle upload --min <images>
```

## 命令别名

```
i => init
d => dev
l => lib
b => build
u => upload
```

**提示:**

* 如果需要使用上传功能，需要配置密钥（只需配置一次，然后系统会自动保存为文件），你可以在这里[申请](https://www.163yun.com/help/documents/15677635979624448)。
* build命令不会清空原先的dist目录文件，原因是为了避免清空了线上正在使用的文件，导致线上故障，如需清理不必要的文件，建议手动清理，但一般情况下也无需清理。

## 工程模版

```
app      # pure javascript project
react    # react project
vue      # vue project
lib      # javascript library (build from src/common)
node     # node project
```

## 目录结构

```
├── fle.json                    # fle configuration
├── dist                        # compiled pages
└── src                         # source code
    └── common                  # common files (ignore for page)
    └── index                   # page (compiled a index.html)
        ├── app.json            # page configuration
        ├── index.html          # page template
        ├── index.js            # page entry (defined entry in app.json)
        ├── style.css           # css file
        └── style.module.css    # css file with css-modules
```

## 配置文件

### 工程配置（fle.json）

```
{
  "boilerplate": "app",        # project boilerplate
  "business": "test",          # business unique name, it is nice for cdn cache
  "eslint": true,              # eslint switch
  "notify": true,              # [dev] system notify
  "vendors": {},               # compile vendor from node_modules by yourself, format: { name: 'RegExp' }
  "splitVendor": true,         # split code from node_modules
  "splitCommon": true,         # split code that include at least 3 times
  "inlineManifest": true,      # [build] inject manifest code to html
  "publicPath": "/",           # [build] publicPath of compiled files
  "remUnit": 50,               # root size, 1rem=50px [default]
  "port": 5000,                # [dev] dev server port
  "proxy": {},                 # [dev] dev server proxy
  "historyApiFallback": true,  # [dev] history controller
  "hot": true,                 # [dev] refresh browser when file changed
  "open": false,               # [dev] open browser when dev server start
  "https": false,              # [dev] use https
  "browsers": [                # browserlist
    "last 4 versions",
    "ie >= 9",
    "IOS >= 7",
    "Android >= 4"
  ],
  "externals": {},             # ignore package for page
  "libExternals": {},          # ignore package for component
}
```

**提示：**

* `proxy`可以在本地开发时，配置接口代理，[文档说明](https://webpack.js.org/configuration/dev-server/#devserver-proxy)
* `historyApiFallback`可以配置单页面路由控制，[文档说明](https://webpack.js.org/configuration/dev-server/#devserver-historyapifallback)

### 页面配置（app.json）

src目录下，含有`app.json`的文件夹会被当成页面来编译。

```
{
  "title": "example",          # page title
  "keyswords": "",             # page keyswords
  "description": "",           # page description
  "icon": "/favicon.ico",      # page icon
  "template": "index.html",    # page template (rootPath: projectPath)
  "filename": "index.html",    # buile filename (rootPath: projectPath/dist)
  "freemarker": {              # buile template for freemarker (java template)
    "template": "index.ftl",
    "filename": "index.ftl"
  },
  "prejs": [],                 # js url，inject to head
  "js": [],                    # js url，inject to body
  "css": [],                   # css url, inject to head
  "publicPath": "html/",       # html publicPath
  "entry": "index.js",         # page entry
  "compiled": true             # when set false, it will be ignore during building
}
```

**提示:**
你也可以在html模板中使用app.json自定义的字段，通过`htmlWebpackPlugin.options.[name]`来取得值。

## Babel

默认配置

* ignore: `.min.js`
* presets:
  - env
  - react (for react)
  - stage-2
* plugins:
  - transform-vue-jsx (for vue)
  - transform-decorators-legacy
  - transform-runtime
  - transform-class-properties (include from stage-2)
  - syntax-dynamic-import (include from stage-2)

**提示:**
你可以在工程目录下新建`.babelrc`文件来添加自定义配置。

## Eslint

当前使用的是规则是[standard rules](https://github.com/standard/standard/blob/master/docs/RULES-zhcn.md)。

**提示:**
你可以在工程目录下新建`.eslintrc`文件来添加自定义规则。

## 补充说明

如果需要自定义webpack配置，可以添加下列文件：

```
webpack.dev.config.js      # dev [webpack]
webpack.build.config.js    # build [webpack]
webpack.lib.config.js      # component [webpack]
```

* 文件引用别名： `@ => src`
* CSS单位：`rpx`将会编译成`rem`，转换比率根据remUnit定义
* 图片压缩：生产环境会自动优化图片体积，若不需要优化可以给图片命名为`xxx.origin.png`
* 上传图片：暂不支持上传后缀为`.ico`的图片
