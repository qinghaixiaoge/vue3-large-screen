<!-- 商家销量：横向柱状图 -->
<template>
    <div class="seller-container">
        <!-- 图标容器 -->
        <div ref="seller" class="seller-chart"></div>
    </div>
</template>

<script setup>
import { $getSeller } from "@/apis/api";
import * as echarts from 'echarts';
import "@/utils/chalk.js"
//导入组合式api
import { onMounted, ref } from "vue";
//定义一个ref对象指向一个容器 ref响应式写法
const seller = ref(null);
//定义echarts对象
let myChart = null;
//定义数据
const myData = ref(null);
//标题大小(用于控制自适应)  地区销售趋势
const titleSize = ref(50);
//当前页
let currentPage = 1;
//总页数
let totalPage = 1;
//定时器变量
let timer = null;
//开启定时器
const start = () => {
    if (timer != null) {
        return;
    }
    timer = setInterval(() => {
        //更新页码
        if (++currentPage > totalPage) {
            currentPage = 1;
        }
        //更新图表数据
        updateChartData();
    }, 5000);
};
//停止定时器
const stop = () => {
    clearInterval(timer);
    timer = null;
};
//初始化数据
const initData = async () => {
    //async异步
    const { data } = await $getSeller();
    //对数据排序(升序)
    data.sort((a, b) => a.value - b.value);
    myData.value = data;
    //计算总页数
    totalPage = Math.ceil(data.length / 5);
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
    myChart = echarts.init(seller.value, "chalk");
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
            text: "商家销售统计",
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
            //数值轴
            type: "value",
        },
        //y轴
        yAxis: {
            //类目轴
            type: "category",
        },
        //提示框
        tooltip: {
            trigger: "axis",
            axisPointer: {
                type: "line",
                z: 0,
                lineStyle: {
                    color: "#2d3443",
                },
            },
        },
        //系列
        series: [
            {
                //柱状图
                type: "bar",
                label: {
                    show: true,
                    position: "right",
                    color: "#fff",
                },
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                        {
                            color: "#5052ee",
                            offset: 0,
                        },
                        {
                            color: "#aa6ee5",
                            offset: 1,
                        },
                    ]),
                },
            },
        ],
    });
};
//更新echarts数据的方法
const updateChartData = () => {
    //开始位置
    const start = (currentPage - 1) * 5;
    //结束位置
    const end = start + 5;
    //设置选项
    myChart.setOption({
        //y轴
        yAxis: {
            //类目数据
            data: myData.value.slice(start, end).map((r) => r.name),
        },
        //系列
        series: [
            {
                //数据
                data: myData.value.slice(start, end),
            },
        ],
    });
};
//自适应echarts对象
const adaptionChart = () => {
    //计算出自适应标题的大小(其他所有的自适应,都是根据该大小去计算的)
    titleSize.value = (seller.value.offsetWidth / 100) * 3.6;

    myChart.setOption({
        //标题
        title: {
            textStyle: {
                fontSize: titleSize.value,
            },
        },
        //提示框
        tooltip: {
            axisPointer: {
                lineStyle: {
                    width: titleSize.value
                },
            },
        },
        //系列
        series: [
            {
                itemStyle: {
                    //设置柱的圆角
                    barBorderRadius: [0, titleSize.value / 2, titleSize.value / 2, 0],
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
.seller-container {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #222733;

    .seller-chart {
        width: 100%;
        height: 100%;
    }
}
</style>