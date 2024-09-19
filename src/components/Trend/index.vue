<!--  销量趋势：折线图  -->
<template>
    <div class="trend-container">
        <!-- 分类下拉框 -->
        <div class="type">
            <select v-model="chooseType" :style="{ fontSize: titleSize + 'px' }">
                <!-- 与item.key绑定 -->
                <option v-for="item in typeData" :key="item.key" :value="item.key">
                    {{ item.text }}
                </option>
            </select>
        </div>
        <!-- 图标容器 -->
        <div ref="thend" class="trend-chart"></div>
    </div>
</template>

<script setup>
import { $getTrend } from "@/apis/api";
import * as echarts from 'echarts';
import "@/utils/chalk.js"
//导入组合式api
import { computed, onMounted, ref, watch, defineExpose } from "vue";
//定义一个ref对象指向一个容器
 const thend = ref(null);
//定义echarts对象
 let myChart = null;
//定义数据
 const myData = ref(null);
//选择的分类
 const chooseType = ref("map"); //需要.value才能拿到字符串map
//标题大小(用于控制自适应)  地区销售趋势
 const titleSize = ref(50);
//监视chooseType
watch(chooseType, () => {
    //初始化echarts对象
    initChart();
});
//分类数据
 const typeData = computed(() => {
    if (myData.value) {
        return myData.value.type;
    }
    return [];
});
//初始化数据
 const initData = async () => {
    //async异步
     const { data } = await $getTrend();
    myData.value = data;
    //初始化echarts对象
    initChart();
    //调整图表中的自适应部分
    adaptionChart();
};
//初始化echarts对象
 const initChart = () => {
    if (myChart) {
        myChart.dispose();
    }
    myChart = echarts.init(thend.value, "chalk");
    //颜色数组
    //渐变的起始颜色
     const color1 = [
        "#0ba82c7f",
        "#2c6eff7f",
        "#16f2d97f",
        "#fe211e7f",
        "#fa69007f",
    ];
    //渐变的终止颜色
     const color2 = [
        "#0ba82c00",
        "#2c6eff00",
        "#16f2d900",
        "#fe211e00",
        "#fa690000",
    ];
    //准备系列数据
     const seriesData = myData.value[chooseType.value].map((r, i) => {
        return {
            //系列名称  上海 北京 深圳 广州 重庆
            name: r.name,
            //堆叠折线图
            stack: "value",
            //系列数据
            data: r.data.split(","),
            //折线图
            type: "line",
            //面积折线图
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                        color: color1[i],
                        offset: 0,
                    },
                    {
                        color: color2[i],
                        offset: 1,
                    },
                ]),
            },
        };
    });
     const month = myData.value.month.map((r, i) => {
        return {
            value: myData.value.month[i],
            textStyle: {
                fontSize: titleSize.value / 5,
            },
        };
    });
    myChart.setOption({
        //绘制图表区域
        grid: {
            top: "30%",
            left: "3%",
            right: "3%",
            bottom: "2%",
            containLabel: true,
        },
        tooltip: {
            //是否显示提示框，默认为true
            show: true,
            //触发类型，item表示在指定的项上触发，axis表示在指定的系列中触发
            trigger: "axis",
            textStyle: {
                fontSize: titleSize.value / 6,
            },
        },
        //X轴
        xAxis: {
            //折线图顶格
            boundaryGap: false,
            //X轴数据
            data: month,
        },
        //Y轴
        yAxis: {},
        //系列
        series: seriesData,
        //图例组件  上面的上海 北京 深圳 广州 重庆
        legend: {
            /* borderColor: "red", */
            /*       borderWidth: 2, */
            left: "2%",
            top: "15%",
            icon: "circle",
            itemWidth: titleSize.value / 1.2,
            itemHeight: titleSize.value / 1.2,
            itemGap: titleSize.value / 2,
            textStyle: {
                fontSize: titleSize.value / 2,
            },
        },
    });
};
//自适应echarts对象
 const adaptionChart = () => {
    //计算出自适应标题的大小(其他所有的自适应,都是根据该大小去计算的)
    titleSize.value = (thend.value.offsetWidth / 100) * 3.6;

    myChart.setOption({
        //图例组件  上面的上海 北京 深圳 广州 重庆
        legend: {
            borderColor: "red",
            /*       borderWidth: 2, */
            left: "2%",
            top: "15%",
            icon: "circle",
            itemWidth: titleSize.value / 1.2,
            itemHeight: titleSize.value / 1.2,
            itemGap: titleSize.value,
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

<style scoped lang='scss'>
.trend-container {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #222733;

    .trend-chart {
        width: 100%;
        height: 100%;
    }

    .type {
        position: absolute;
        z-index: 1;
        left: 3%;
        top: 3%;
        display: flex;
        align-items: center;

        select {
            border: none;
            padding: 2px;
            /* padding-right: 40px; */
            background-color: transparent;
            color: white;
            //取消下拉框原生箭头
            appearance: none;

            option {
                background-color: #222733;
            }
        }
    }
}
</style>