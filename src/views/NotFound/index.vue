<template>
  <div class="notFound-container">
    <h2>页面丢失啦~~</h2>
    <button @click="$router.push('/home')">回到首页</button>
  </div>
</template>
<script setup>
</script>
<style lang='scss' scoped>
.notFound-container{
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    button {
        border: none;
        height: 40px;
        font-size: 16px;
        font-weight: bold;
        border-radius: 5px;
        box-shadow: 0 0 5px rgba(0, 0, 0, .2);
        background-color: #8a4fe3;
        color: #f2f2f2;
        cursor: pointer;

        &:hover {
          background-color: #b66dff;
        }
      }
}
</style>