<template>
    <div class="home-container" ref="home" v-scale="{ width: 1920, height: 1080 }">
        <div class="left">
            <div class="item1" :class="{ fullscreen: isHot }">
                <Hot ref="hot"></Hot>
                <i v-if="isHot" class="iconfont icon-quanping" @click="isHot = false"></i>
                <i v-else class="iconfont icon-suoxiao" @click="isHot = true"></i>
            </div>
            <div class="item2" :class="{ fullscreen: isRank }">
                <Rank ref="rank"></Rank>
                <i v-if="isRank" class="iconfont icon-quanping" @click="isRank = false"></i>
                <i v-else class="iconfont icon-suoxiao" @click="isRank = true"></i>
            </div>
        </div>
        <div class="middle">
            <div class="item3" :class="{ fullscreen: isMap }">
                <Map ref="map"></Map>
                <i v-if="isMap" class="iconfont icon-quanping" @click="isMap = false"></i>
                <i v-else class="iconfont icon-suoxiao" @click="isMap = true"></i>
            </div>
            <div class="item4" :class="{ fullscreen: isSeller }">
                <Seller ref="seller"></Seller>
                <i v-if="isSeller" class="iconfont icon-quanping" @click="isSeller = false"></i>
                <i v-else class="iconfont icon-suoxiao" @click="isSeller = true"></i>
            </div>
        </div>
        <div class="right">
            <div class="item5" :class="{ fullscreen: isStock }">
                <Stock ref="stock"></Stock>
                <i v-if="isStock" class="iconfont icon-quanping" @click="isStock = false"></i>
                <i v-else class="iconfont icon-suoxiao" @click="isStock = true"></i>
            </div>
            <div class="item6" :class="{ fullscreen: isTrend }">
                <Trend ref="trend"></Trend>
                <i v-if="isTrend" class="iconfont icon-quanping" @click="isTrend = false"></i>
                <i v-else class="iconfont icon-suoxiao" @click="isTrend = true"></i>
            </div>
        </div>
    </div>
</template>
<script setup>
import Hot from "@/components/Hot"
import Rank from "@/components/Rank"
import Map from "@/components/Map"
import Seller from "@/components/Seller"
import Stock from "@/components/Stock"
import Trend from "@/components/Trend"
import { nextTick, ref, watch } from "vue";
const isHot = ref(false)
const isRank = ref(false)
const isMap = ref(false)
const isSeller = ref(false)
const isStock = ref(false)
const isTrend = ref(false)
const hot = ref(null)
const rank = ref(null)
const map = ref(null)
const seller = ref(null)
const stock = ref(null)
const trend = ref(null)

watch(() => isHot.value, (val) => {
    nextTick(() => {
        hot.value.resize()
    })
})
watch(() => isRank.value, (val) => {
    nextTick(() => {
        rank.value.resize()
    })
})
watch(() => isMap.value, (val) => {
    nextTick(() => {
        map.value.resize()
    })
})
watch(() => isSeller.value, (val) => {
    nextTick(() => {
        seller.value.resize()
    })
})
watch(() => isStock.value, (val) => {
    nextTick(() => {
        stock.value.resize()
    })
})
watch(() => isTrend.value, (val) => {
    nextTick(() => {
        trend.value.resize()
    })
})
</script>
<style lang='scss' scoped>
.home-container {
    width: 1920px;
    height: 1080px;
    border: 1px solid;
    display: flex;
    background-color: #161522;
    justify-content: space-evenly;
    transition: 0.5s;

    .left,
    .middle,
    .right {
        width: 32%;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;

        .fullscreen {
            /* 根据home-container包含块定位 */
            width: 100% !important;
            height: 100% !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            z-index: 1000 !important;
        }
    }

    .item1 {
        height: 42%;
        border: 1px solid;
        background-color: yellow;
        border-radius: 5px;
        position: relative;

    }

    .item2 {
        height: 53%;
        border: 1px solid;
        background-color: yellow;
        border-radius: 5px;
        position: relative;
    }

    .item3 {
        height: 46%;
        border: 1px solid;
        background-color: yellow;
        border-radius: 5px;
        position: relative;
    }

    .item4 {
        height: 49%;
        border: 1px solid;
        background-color: yellow;
        border-radius: 5px;
        position: relative;
    }

    .item5 {
        height: 50%;
        border: 1px solid;
        background-color: yellow;
        border-radius: 5px;
        position: relative;
    }

    .item6 {
        height: 45%;
        border: 1px solid;
        background-color: yellow;
        border-radius: 5px;
        position: relative;
    }

    .iconfont {
        position: absolute;
        right: 10px;
        top: 10px;
        font-size: 20px;
        color: #fff;
    }
}
</style>