<template>
  <div class="login-container">
    <div class="container">
      <h2>大屏项目</h2>
      <form @submit.prevent="login">
        <ul>
          <li>
            <input type="text" placeholder="账号" v-model.lazy="formData.loginId" class="message">
          </li>
          <li>
            <input type="text" placeholder="密码" v-model.lazy="formData.loginPwd" class="message">
          </li>
          <li>
            <button type="submit" :disabled="isLoading">
              {{ isLoading ? '登录中...' : '登录' }}
            </button>
          </li>
        </ul>
      </form>
    </div>
  </div>
</template>
<script setup>
import { onBeforeUnmount, reactive, ref } from 'vue'
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { cancelAllRequest } from "@/utils/request"
const route = useRoute()
const router = useRouter();
const store = useStore()
const isLoading = ref(false)
const formData = reactive({
  loginId: 'admin',
  loginPwd: '123456'
})
/* onBeforeUnmount(() => {
  console.log("销毁所有请求");
  cancelAllRequest && cancelAllRequest()
}) */

onBeforeRouteLeave((req, res, next) => {
  console.log("销毁所有请求");
  cancelAllRequest()
  next()
})
const login = async () => {
  // 取消令牌映射
  /*   $getPromise({ id: 1 }).then(res => {
      console.log("success====>", res);
    }).catch(err => {
      console.log("err====>", err);
    })
    $getPromise({ id: 2 }).then(res => {
      console.log("success====>", res);
    }).catch(err => {
      console.log("err====>", err);
    })
    $getPromise({ id: 3 }).then(res => {
      console.log("success====>", res);
    }).catch(err => {
      console.log("err====>", err);
    })
    console.log(6666);
    router.push("/hot")
    console.log(7777); */
  isLoading.value = true
  const res = await store.dispatch("loginUser/login", formData)
  if (res?.code) {
    router.push(route.query.returnUrl || "/home")
  }
  isLoading.value = false
}

</script>
<style lang='scss' scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f2f2f2;

  .container {
    width: 300px;
    background-color: #fff;
    border-radius: 15px;
    box-shadow: 0 0 15px rgba(0, 0, 0, .2);
    padding: 30px;

    h2 {
      text-align: center;
      color: #8a4fe3;
      margin-bottom: 20px;
    }

    li {
      padding: 10px;
      margin-bottom: 20px;

      .message {
        padding-left: 5px;
        outline: none;
        border: none;
        width: 100%;
        height: 40px;
        border-radius: 5px;
        box-shadow: 0 0 5px rgba(0, 0, 0, .2);
        background-color: #fff;
      }

      button {
        border: none;
        width: 100%;
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
  }
}
</style>