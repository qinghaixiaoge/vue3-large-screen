# large-screen

## 安装依赖

npm i

## 启动服务

npm run dev  开发环境启动
npm run prod   生产环境启动

## 打包

npm run build:dev  开发环境打包
npm run build:prod   生产环境打包

## 基于打包的优化，详情看vue.confing.js

- 本项目基于减少项目打包体积，使用cdn的方式加载echarts，这种方式适用于服务器带宽小的情况，如果cdn挂了，那么网页也就无法正常访问了。

- 打包结果剔除core-js模块，不兼容老版本游览器api缺失的情况，例如promise等，如果需要考虑兼容老版本游览器，请把babel.config.js的注解打开。

- 打包结果剔除console.log等调试信息，避免影响tree-shaking

## 优化

- 通过 require.context 实现动态加载路由模块，方便地自动化管理项目的路由，避免手动引入每个路由文件