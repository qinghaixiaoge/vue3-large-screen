const { defineConfig } = require('@vue/cli-service')
const cdn = ["https://cdn.bootcdn.net/ajax/libs/echarts/5.4.3/echarts.min.js"]
const externals = {
  "echarts": "echarts",
}
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  productionSourceMap: false,
  chainWebpack: config => {
    if (process.env.NODE_ENV === "production") {
      config.plugin("html")
        .tap(args => {
          args[0].title = "大屏项目";
          args[0].cdn = cdn;
          return args;
        }).end()
        .externals(externals)
    }
  }
})
