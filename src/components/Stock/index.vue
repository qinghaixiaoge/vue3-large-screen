<!--  库存信息：圆环图  -->
<template>
    <div class="stock-container">
        <!-- 图标容器 -->
        <div ref="stock" class="stock-chart"></div>
    </div>
</template>

<script setup>
import { $getStock } from "@/apis/api";
import * as echarts from 'echarts';
import "@/utils/chalk.js"
//导入组合式api
import { onMounted, ref } from "vue";
//定义一个ref对象指向一个容器 ref响应式写法
const stock = ref(null);
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
    const { data } = await $getStock();
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
    myChart = echarts.init(stock.value, "chalk");
    //给echarts注册事件
    myChart.on("mouseover", () => {
        //停止定时器
        stop();
    });
    myChart.on("mouseout", () => {
        //重新开启定时器
        start();
    });

    //设置选项
    myChart.setOption({
        //标题
        title: {
            text: "库存和销量分析",
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
    });
};
//更新echarts数据的方法
const updateChartData = () => {
    //开始位置
    const start = (currentPage - 1) * 5;
    //结束位置
    const end = start + 5;
    //准备颜色数组
    const colorArr = [
        ["#0ca92d", "#4cf475"],
        ["#e8d21d", "#e5db43"],
        ["#e55544", "#e8801e"],
        ["#aa6ee5", "#5554ee"],
        ["#2e75c0", "#24d9e1"],
    ];
    //准备系列数据
    const seriesData = myData.value.slice(start, end).map((r, i) => {
        return {
            //饼图
            type: "pie",
            //取消鼠标悬停动画
            hoverAnimation: true,
            //文本
            label: {
                show: true, // 始终显示文本
                formatter: () => `${r.name}\n\n${r.sales}`, // 设置显示文本的格式
                position: "center",
                color: colorArr[i][0],
            },
            //文本线
            labelLine: {
                show: true,
            },
            data: [
                {
                    name: r.name + "\n\n" + r.sales,
                    value: r.sales,
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                            {
                                color: colorArr[i][0],
                                offset: 0,
                            },
                            {
                                color: colorArr[i][1],
                                offset: 1,
                            },
                        ]),
                    },
                },
                {
                    /* name: "库存", */
                    value: r.stock,
                    itemStyle: {
                        color: "#333843",
                    },
                },
            ],
        };
    });

    //设置选项
    myChart.setOption({
        //系列
        series: seriesData,
    });
};
//自适应echarts对象
const adaptionChart = () => {
    //计算出自适应标题的大小(其他所有的自适应,都是根据该大小去计算的)
    titleSize.value = (stock.value.offsetWidth / 100) * 3.5;
    myChart.setOption({
        //标题
        title: {
            textStyle: {
                fontSize: titleSize.value,
            },
        },
        //系列
        series: [
            {
                center: ["18%", "40%"],
                label: {
                    fontSize: titleSize.value / 2,
                },
                radius: [titleSize.value * 2.6, titleSize.value * 3],
            },
            {
                center: ["48%", "40%"],
                label: {
                    fontSize: titleSize.value / 2,
                },
                radius: [titleSize.value * 2.6, titleSize.value * 3],
            },
            {
                center: ["78%", "40%"],
                label: {
                    fontSize: titleSize.value / 2,
                },
                radius: [titleSize.value * 2.6, titleSize.value * 3],
            },
            {
                center: ["33%", "73%"],
                label: {
                    fontSize: titleSize.value / 2,
                },
                radius: [titleSize.value * 2.6, titleSize.value * 3],
            },
            {
                center: ["63%", "73%"],
                label: {
                    fontSize: titleSize.value / 2,
                },
                radius: [titleSize.value * 2.6, titleSize.value * 3],
            },
        ],
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

<style scoped lang='scss'>
.stock-container {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #222733;

    .stock-chart {
        width: 100%;
        height: 100%;
    }
}
</style>