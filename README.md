# fle-cli

[![version](https://img.shields.io/npm/v/fle-cli.svg)](https://www.npmjs.org/package/fle-cli)

A convenient and flexible compiler with no configuration .

It run anywhere with no build files. furthermore, you needn't install any package for build. It means your project just include source code and the used packages.

It works on Mac and Windows, if you have any questions, please email me: *huangancheng@corp.netease.com*

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

# upload files to cdn
$ fle upload <file|glob>
```

### command options

``` bash
# create page of project（webpack）
$ fle init <project-name> --page

# show debug on phone
$ fle dev --log

# build and upload files to cdn
$ fle build --upload

# split base code in development (framework, library)
$ fle dll --dev

# split base code in production and upload (framework, library)
$ fle dll --build --upload

# configure secretKey before upoload files
$ fle upload --init

# upload and optimize images
$ fle upload --min <images>
```

### command alias

```
i => init
d => dev
l => lib
b => build
u => upload
```

**Notes:**

You should configure secretKey before upload, here is [configuration](https://g.hz.netease.com/huangancheng/documents/blob/master/fle/nosConfig.md) (it is private). If you have no permission, You can apply for a key by yourself, here is [document](https://www.163yun.com/help/documents/15677635979624448).

## Boilerplate

```
app      # pure javascript project
react    # react project
vue      # vue project
lib      # javascript library (ES6 or IIFE, it is nice for tree shaking)
module   # component of react or vue
```

## Project

webpack

```
├── fle.json                    # fle configuration
├── dist                        # compiled pages
└── src                         # source code
    └── common                  # common files (ignore for page)
    └── index                   # page (compiled a index.html)
        ├── app.json            # page configuration
        ├── index.html          # page template
        ├── index.js            # page entry (defined entry in app.json)
        ├── module.js           # component entry (defined module in app.json)
        ├── style.css           # css file
        └── style.module.css    # css file with css-modules
```

rollup (just for lib boilerplate)

```
├── fle.json                    # fle configuration
├── lib                         # compiled library from src
├── public                      # example page
│   ├── index.html              # page
│   ├── demo                    # source code of example
│   └── dist                    # compiled demo
└── src                         # source code of library
    └── index.js                # library entry
```

## Configuration

fle.json

```
{
  "boilerplate": "app",       # project boilerplate

  # the following options is for webpack #

  "business": "test",          # business unique name, it is nice for cdn cache
  "eslint": true,              # eslint switch
  "notify": true,              # [dev] system notify
  "vendors": {},               # pre compile framework and library with dll, format: [ name: ['xxx'] ]
  "inlineManifest": true,      # [build] inject manifest code to html
  "publicPath": "/",           # [build] publicPath of compiled files
  "splitCommon": false,        # split code that all pages was used to a file
  "remUnit": 50,               # root size, 1rem=50px [default]

  "port": 5000,                # [dev] dev server port
  "proxy": {},                 # [dev] dev server proxy
  "historyApiFallback": true,  # [dev] history controller
  "hot": true,                 # [dev] refresh browser when file changed
  "open": false,               # [dev] open browser when dev server start
  "https": false,              # [dev] use https

  "browsers": [                # browserlist
    "last 2 versions",
    "ie >= 9",
    "ios >= 7",
    "android >= 4"
  ],
  "externals": {},             # ignore package for page
  "libExternals": {},          # ignore package for component

  # the following options is for rollup [lib] #

  "iife": false,               # build a iife library
  "extract": false,            # export css file from library
  "eslint": true,              # eslint switch
  "port": 5000,                # [dev] dev server port
  "hot": true,                 # [dev] refresh browser when file changed
  "https": false,              # [dev] use https
  "browsers": [
    "last 2 versions",
    "ie >= 9",
    "ios >= 7",
    "android >= 4"
  ]
}
```

## MultiPage [webpack]

Add directory in src and it will be compiled as a page. The `app.json` and entry js are necessary.

app.json

```
{
  "title": "example",          # page title
  "keyswords": "",             # page keyswords
  "description": "",           # page description
  "icon": "https://xxx",       # page icon
  "template": "index.html",    # page template
  "prejs": [],                 # js url，inject to head
  "js": [],                    # js url，inject to body
  "css": [],                   # css url, inject to head
  "publicPath": "html/",       # html publicPath
  "entry": "index.js",         # page entry
  "module": "module.js",       # component entry
  "moduleName": "name",        # component name, default is directory name
  "compiled": true             # when set false, it will be ignore during building
}
```

**Notes:**

You can add options by yourself, and it will be export for html. For example: when you add `"name": "xxx"`, and you can get value `htmlWebpackPlugin.options.name` in html template, it is useful when you use custom template.

## Babel

default configuration

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

**Notes:**

You can add `.babelrc` file in root project if you want to add configuration.

## Eslint

We use standard eslint by defalut and system will help you fixed most code. For detail, here is [standard rules](https://github.com/standard/standard/blob/master/docs/RULES-zhcn.md).

**Notes:**

You can add `.eslintrc` file in root project if you want to add configuration.

## Extend

If you want to configure something by yourself, you can add following files to root project and it will be merge into system configuration.

```
webpack.dev.config.js      # dev [webpack]
webpack.build.config.js    # build [webpack]
webpack.dll.config.js      # dll for vendors [webpack]
webpack.lib.config.js      # component [webpack]
```

## Remark

* js import alias: `@ => src`
* css unit: `rpx` will be transform to `rem`
* suffix of `.ico` is not supported to upload
* proxy data api: [dev server proxy options](https://www.npmjs.com/package/http-proxy-middleware#http-proxy-options)
