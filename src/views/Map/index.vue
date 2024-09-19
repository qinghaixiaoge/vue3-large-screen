<!-- 商家分布：地图 -->
<template>
    <div class="map-container">
        <!-- 图标容器 -->
        <div ref="map" class="map-chart"></div>
    </div>
</template>

<script setup>
import { $getMap, $getChina,$getProvince } from "@/apis/api";
import * as echarts from 'echarts';
import "@/utils/chalk.js"
//返回省份地图信息的方法
import { getProvinceMapInfo } from "@/utils/map_utils";
//导入组合式api
import { computed, onMounted, ref, watch } from "vue";
//定义一个ref对象指向一个容器 ref响应式写法
const map = ref(null);
//定义echarts对象
let myChart = null;
//定义数据
const myData = ref(null);
//标题大小(用于控制自适应)  地区销售趋势
const titleSize = ref(50);
//初始化数据
const initData = async () => {
    //获取商家信息 async异步
    const { data } = await $getMap();
    myData.value = data;
    //获取地图数据
    const ret = await $getChina();
    //注册地图数据
    echarts.registerMap("china", ret.data);
    //初始化echarts对象
    initChart();
    //调整图表中的自适应部分
    adaptionChart();
};
//初始化echarts对象
const initChart = () => {
    //初始化
    myChart = echarts.init(map.value, "chalk");
    //给myChart注册点击事件
    myChart.on("click", async (e) => {
        //获取省份地图的key和path
        const ret = getProvinceMapInfo(e.name);
        if (ret) {
            const { key, path } = ret;
            //发送请求，获取省份地图数据
            const { data } = await $getProvince(key);
            //将个省份地图数据注册给echarts
            echarts.registerMap(key, data);
            //更新地图显示
            myChart.setOption({
                geo: {
                    //指定地图数据
                    map: key,
                },
            });
        }
    });
    //给图表容器注册双击事件
    map.value.addEventListener("dblclick", () => {
        //恢复到中国地图
        //更新地图显示
        myChart.setOption({
            geo: {
                //指定地图数据
                map: 'china',
            },
        });
    });
    //系列数据
    const seriesData = myData.value.map((r) => {
        return {
            type: "effectScatter",
            name: r.name,
            //涟漪动画配置
            rippleEffect: {
                brushType: "stroke",
                number: 5,
            },
            data: r.children,
            //指定地图坐标系
            coordinateSystem: "geo",
        };
    });
    //图例数据
    const legendData = myData.value.map((r) => {
        return {
            name: r.name,
        };
    });
    myChart.setOption({
        //标题
        title: {
            text: "商家分布",
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
        //配置地图数据
        geo: {
            //指定地图数据
            map: "china",
            //缩放比例
            zoom: 1.1,
            //地图区域
            itemStyle: {
                areaColor: "#2e72bf",
                borderColor: "#333",
            },
        },
        //提示框
        tooltip: {},
        //系列
        series: seriesData,
        //图例组件
        legend: {
            data: legendData,
        },
    });
};
//自适应echarts对象
const adaptionChart = () => {
    //计算出自适应标题的大小(其他所有的自适应,都是根据该大小去计算的)
    titleSize.value = (map.value.offsetWidth / 100) * 3.6;

    myChart.setOption({
        title: {
            textStyle: {
                fontSize: titleSize.value,
            },
        },
        //图例组件  上面的黄金用户 白金用户
        legend: {
            bottom: "5%",
            left: "5%",
            icon: "circle",
            orient: "vertical",
            itemWidth: titleSize.value / 2,
            itemHeight: titleSize.value / 2,
            itemGap: titleSize.value / 2,
            textStyle: {
                fontSize: titleSize.value / 2,
            },
        },
    });
};
//页面挂载完成
onMounted(() => {
    //初始化数据
    initData();
    //注册窗口大小调整大小事件
    addEventListener("resize", () => {
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

<style lang="scss" scoped>
.map-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #222733;

  .map-chart {
      width: 100%;
      height: 100%;
  }
}
</style>