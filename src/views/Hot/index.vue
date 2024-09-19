<!-- 热销商品：饼图 -->
<template>
    <div class="hot-container">
        <!-- 图标容器 -->
        <div ref="hot" class="hot-chart"></div>
        <!-- 底部标题 -->
        <div class="title" :style="{ fontSize: titleSize + 'px' }">
            {{ firstTitle }}
        </div>
        <!-- 左箭头 -->
        <i class="iconfont icon-xiangzuojiantou" @click="setActiveIndex('-')"
            :style="{ fontSize: titleSize + 'px' }"></i>
        <!-- 右箭头 -->
        <i class="iconfont icon-xiangyoujiantou" @click="setActiveIndex('+')"
            :style="{ fontSize: titleSize + 'px' }"></i>
    </div>
</template>

<script setup>
//导入axios
import { $getHot } from "@/apis/api";
import * as echarts from 'echarts';
import "@/utils/chalk.js"
//导入组合式api
import { computed, onMounted, ref, watch } from "vue";
//定义一个ref对象指向一个容器 ref响应式写法
const hot = ref(null);
//定义echarts对象
let myChart = null;
//定义数据
const myData = ref(null);
//标题大小(用于控制自适应)  地区销售趋势
const titleSize = ref(50);
//分类索引
const activeIndex = ref(0);
//更新activeIndex的方法
const setActiveIndex = (type) => {
    if (type == '+') {
        if (++activeIndex.value >= myData.value.length) {
            activeIndex.value = 0
        }
    } else {
        if (--activeIndex.value <= -1) {
            activeIndex.value = myData.value.length - 1
        }
    }
    //更新echarts数据
    updateChartData()
}
//更新echarts数据
const updateChartData = () => {
    //设置选项
    myChart.setOption({
        //系列
        series: [
            {
                //饼图的数据
                data: myData.value[activeIndex.value].children,
            }
        ]
    })
}
//一级标题
const firstTitle = computed(() => {
    if (myData.value) {
        return myData.value[activeIndex.value].name;
    } else {
        return "";
    }
});
//初始化数据
const initData = async () => {
    //async异步
    const { data } = await $getHot();
    myData.value = data;
    //初始化echarts对象
    initChart();
    //调整图表中的自适应部分
    adaptionChart();
};
//初始化echarts对象
const initChart = () => {
    myChart = echarts.init(hot.value, "chalk");
    myChart.setOption({
        //标题
        title: {
            text: "热销商品销售金额占比统计",
            left: "2%",
            top: "3%",
        },
        //绘制图表区域  也就是边框
        grid: {
            top: "50%",
            left: "3%",
            right: "3%",
            bottom: "2%",
            containLabel: true,
        },
        //提示框
        tooltip: {
            formatter: (e) => {
                //总数
                const total = e.data.value;
                let str = "<div>";
                e.data.children.forEach((r) => {
                    str += `<div><span>${r.name}:</span><span>${((r.value / total) * 100).toFixed(0) + "%"
                        }</span></div>`;
                });
                str += "</div>";
                return str;
            },
        },
        //系列
        series: [
            {
                type: "pie",
                name: "女装",
                radius: "68%",
                //控制饼图的位置
                center: ["50%", "60%"],
                //去除文本标签
                label: {
                    show: false,
                },
                //去除视觉引导线
                labelLine: {
                    show: false,
                },
                //高亮状态的扇区和标签样式
                emphasis: {
                    label: {
                        show: true,
                    },
                },
                //饼图的数据
                data: myData.value[activeIndex.value].children,
            },
        ],
    });
};
//自适应echarts对象
const adaptionChart = () => {
    //计算出自适应标题的大小(其他所有的自适应,都是根据该大小去计算的)
    titleSize.value = (hot.value.offsetWidth / 100) * 3.6;
    myChart.setOption({
        title: {
            textStyle: {
                fontSize: titleSize.value,
            },
        },
        //图例组件  上面的裙装 女士上衣
        legend: {
            top: "14%",
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
//统一的自适应方法
const resize = () => {
    //调整图表大小
    myChart.resize();
    //调整图表中的自适应部分
    adaptionChart();
}
//页面挂载完成
onMounted(() => {
    //初始化数据
    initData();
    //注册窗口大小调整大小事件
    window.addEventListener("resize", resize);
});


//暴露给父组件使用的成员
defineExpose({
    resize
})
</script>

<style scoped lang='scss'>
.hot-container {
    position: relative;
    width: 100vw;
    height: 100vh;
    background-color: #222733;

    .hot-chart {
        width: 100%;
        height: 100%;
    }

    .title {
        position: absolute;
        z-index: 1;
        bottom: 3%;
        right: 10%;
        color: white;
    }

    .iconfont {
        position: absolute;
        z-index: 1;
        top: 55%;
        color: white;
        cursor: pointer;
    }

    .icon-xiangzuojiantou {
        left: 10%;
    }

    .icon-xiangyoujiantou {
        right: 10%;
    }
}
</style>