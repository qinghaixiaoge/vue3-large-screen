<template>
  <div class="loading-container">
    <h1>正在登录中...</h1>
  </div>
</template>
<script setup>
import { onMounted, watch } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from 'vue-router';
const route = useRoute()
const router = useRouter();
const store = useStore();

watch(() => store.getters["loginUser/status"], (newValue) => {
  // console.log("watch");
  if (newValue === "login") {
    router.push(route.query.returnUrl || "/home")
  } else if (newValue === "unlogin") {
    router.push(route.query.returnUrl || "/login")
  }
}, {
  immediate: true
})

</script>
<style lang='scss' scoped>
.loading-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  h1 {
    color: white;
  }
}
</style>