# Change Log

## 4.1.0

* 修复了optimize-css-assets-webpack-plugin将css的浏览器前缀移除的问题
* 优化了图片资源的最小尺寸，从10KB修改为2KB，避免文件体积过大、
* lib编译支持多模式：babel导出es6代码以便按需加载编译；iife导出自执行匿名函数；umd；commonjs等
* 新增node项目样板工程
* 移除了rollup的编译配置
