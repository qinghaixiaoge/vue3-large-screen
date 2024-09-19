<!-- 销量排行：垂直柱状图 -->
<template>
  <div class="rank-container">
      <!-- 图标容器 -->
      <div ref="rank" class="rank-chart"></div>
  </div>
</template>

<script setup>
import { $getRank } from "@/apis/api";
import * as echarts from 'echarts';
import "@/utils/chalk.js"
//导入组合式api
import { onMounted, ref } from "vue";
//定义一个ref对象指向一个容器 ref响应式写法
const rank = ref(null);
//定义echarts对象
let myChart = null;
//定义数据
const myData = ref(null);
//标题大小(用于控制自适应)  地区销售趋势
const titleSize = ref(50);
//定时器变量
let timer = null;
//起始位置
let startIndex = 0;
//结束位置
let endIndex = 9;
//开启定时器
const start = () => {
  if (timer != null) {
      return;
  }
  timer = setInterval(() => {
      //起始位置
      startIndex++;
      //结束位置
      endIndex++;
      if (endIndex > myData.value.length - 1) {
          //起始位置
          startIndex = 0;
          //结束位置
          endIndex = 9;
      }
      //更新图表数据
      updateChartData();
  }, 2000);
};
//停止定时器
const stop = () => {
  clearInterval(timer);
  timer = null;
};
//初始化数据
const initData = async () => {
  //async异步
  const { data } = await $getRank();
  //对数据排序(降序)
  data.sort((a, b) => b.value - a.value);
  myData.value = data;
  //初始化echarts对象
  initChart();
  //更新echarts数据的方法
  updateChartData();
  //调整图表中的自适应部分
  adaptionChart();
  //开启定时器
  start();
};
//初始化echarts对象
const initChart = () => {
  myChart = echarts.init(rank.value, "chalk");
  //颜色数组
  const colorArr = [
      ["#0dab2e", "#4df576"],
      ["#2e77c1", "#24e3e5"],
      ["#5353ed", "#a86de6"],
  ];
  //给echarts注册事件
  myChart.on("mouseover", () => {
      //停止定时器
      stop();
  });
  myChart.on("mouseout", () => {
      //重新开启定时器
      start();
  });
  myChart.setOption({
      //标题
      title: {
          text: "地区销售排行",
          left: "2%",
          top: "3%",
      },
      //绘制图表区域  也就是边框
      grid: {
          top: "22%",
          left: "3%",
          right: "3%",
          bottom: "2%",
          containLabel: true,
      },
      //x轴
      xAxis: {
          //类目轴
          type: "category",
          //类目数据
          data: myData.value.map((r) => r.name),
      },
      //y轴
      yAxis: {
          //数值轴
          type: "value",
      },
      //提示框
      tooltip: {},
      //系列
      series: [
          {
              //柱状图
              type: "bar",
              //数据
              data: myData.value,
              itemStyle: {
                  color: ({ data: { value } }) => {
                      //当前颜色数组
                      let currentColor = [];
                      if (value > 300) {
                          currentColor = colorArr[0];
                      } else if (value > 200) {
                          currentColor = colorArr[1];
                      } else {
                          currentColor = colorArr[2];
                      }
                      return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                          {
                              color: currentColor[0],
                              offset: 0,
                          },
                          {
                              color: currentColor[1],
                              offset: 1,
                          },
                      ]);
                  },
              },
          },
      ],
  });
};
//更新echarts数据的方法
const updateChartData = () => {
  myChart.setOption({
      //区域缩放
      dataZoom: {
          //隐藏滚动条
          show: false,
          //开始位置
          startValue: startIndex,
          //结束位置
          endValue: endIndex,
      },
  });
};
//自适应echarts对象
const adaptionChart = () => {
  //计算出自适应标题的大小(其他所有的自适应,都是根据该大小去计算的)
  titleSize.value = (rank.value.offsetWidth / 100) * 3.6;

  myChart.setOption({
      title: {
          textStyle: {
              fontSize: titleSize.value,
          },
      },
      //提示框
      tooltip: {},
      //系列
      series: [
          {
              itemStyle: {
                  //设置柱的圆角
                  barBorderRadius: [titleSize.value / 2, titleSize.value / 2, 0, 0],
              },
              //设置柱的宽度
              barWidth: titleSize.value,
          },
      ],
  });
};
//页面挂载完成
onMounted(() => {
  //初始化数据
  initData();
  //注册窗口大小调整大小事件
  window.addEventListener("resize", () => {
      resize()
  });
});
//统一的自适应方法
const resize = () => {
  //调整图表大小
  myChart.resize();
  //调整图表中的自适应部分
  adaptionChart();
}

//暴露给父组件使用的成员
defineExpose({
  resize
})
</script>

<style scoped lang='scss'>
.rank-container {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #222733;

  .rank-chart {
      width: 100%;
      height: 100%;
  }
}
</style>