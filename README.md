# fle-cli

[![npm package](https://img.shields.io/npm/v/fle-cli.svg?style=flat-square)](https://www.npmjs.org/package/fle-cli)
[![NPM downloads](http://img.shields.io/npm/dt/fle-cli.svg?style=flat-square)](https://npmjs.org/package/fle-cli)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/ansenhuang/fle-cli/blob/master/LICENSE)

A command line tool for front-end developer with zero configuration. It aims to improve efficiency and make workflow easily.

Just install once and you will get all the following features.

## Features

* Support multiple boilerplate (react, vue, ...)
* Support javaScript library (es6, iife, commonjs, ...)
* Support upload files in compile
* Support phone debug in development
* Powerful postcss plugin with css modules
* flexible code split by default with webpack4+
* standard code style with eslint
* optimize image in compile if necessary
* Build-in rem layout solution for H5
* freemarker for Java template (ftl)

## Installation

```bash
$ npm install fle-cli -g
```

or use yarn

```bash
$ yarn global add fle-cli
```

## Quick Start

### Init a project

```bash
$ fle init <project>
```

### Development

```bash
$ fle dev
```

### Production

```bash
$ fle build
```

### Library

```bash
$ fle lib
```

### Help

```bash
$ fle [command] -h
```

## Docs

For more details, please go to [https://ansenhuang.github.io/docs/fle-cli/zh-cn/](https://ansenhuang.github.io/docs/fle-cli/zh-cn/).

## Changelog

[Changelog](CHANGELOG.md)

## License

[MIT](https://tldrlegal.com/license/mit-license)
