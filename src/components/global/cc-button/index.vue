<template>
  <!-- 父组件的未被props接收的属性会透传到根节点上 -->
  <div @click="click" v-bind="$attrs">
    <button>我是全局按钮cc</button>
  </div>
</template>
<script setup>
import { useAttrs } from 'vue';
// 配置组件名称
defineOptions({
  name: "CcButton",
  // 父组件的未被props接收的属性会透传到根节点上
  inheritAttrs: false
})
// const emits = defineEmits(['click'])
console.log(useAttrs());
const click = function () {
  console.log('子组件click');
  // emits("click",1111)
}

</script>
<style lang='scss' scoped></style>