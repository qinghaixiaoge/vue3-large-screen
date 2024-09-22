const { defineConfig } = require('@vue/cli-service')
const TerserPlugin = require('terser-webpack-plugin');
const cdn = ["https://cdn.bootcdn.net/ajax/libs/echarts/5.4.3/echarts.min.js"]
const externals = {
  "echarts": "echarts",
}
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  productionSourceMap: false,
  chainWebpack: config => {
    config.plugin('define').tap(args => {
      args[0]['process.env'].MY_BASE_URL = JSON.stringify(process.env.MY_BASE_URL)
      args[0]['process.env'].XIAO_YU = JSON.stringify(process.env.XIAO_YU)
      return args
    })
    console.log(process.env.NODE_ENV);
    if (process.env.NODE_ENV === "production") {
      config.plugin("html")
        .tap(args => {
          args[0].title = "自适应大屏项目";
          args[0].cdn = cdn;
          return args;
        }).end()
        .externals(externals)
      config.optimization.minimize(true);
      config.optimization.minimizer('terser').use(TerserPlugin, [{
        terserOptions: {
          compress: {
            drop_console: true, // 删除所有 console 语句
          },
        },
      }]);
    }
  }
})
