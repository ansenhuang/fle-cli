# 小程序

### 目录结构

root  
 |----components/常用组件   
 |----deps/     常用依赖包引入  
 |----assets/    图片等资源文件，不过建议之后添加的图片放入子包目录  
 |----model/   数据模型文件  
 |----utils   常用方法文件   
 |----pages/  主包页面文件  
 |----packageA/  子包文件  
 |----packageB/  子包文件  
 |----packageC/  子包文件  
  


### 开发说明

#### 统一请求出口

* `model/fetchAPI.js`定义了统一的数据请求接口，reqwest（普通数据请求）、uploadFile（文件上传)
* 开发过程中把数据源定为测试环境、提交审核之前记得将数据源改为线上；

#### 常用方法

 * `utils/format.js` 封装时间格式化方法
 * `utils/utils.js` 封装常用的方法，第三方登录，formId上报等；
 * `utils/wxAPI.js` 微信提供的常用api Promise化封装方法
 
### 注意事项

* pages放主入口相关页面，packageA,packageB,packageC放次要加载页面
* 页面参数不需要encode，否则解析不出来

