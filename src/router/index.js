import { createRouter, createWebHistory } from 'vue-router'
import routes from "./routes"
import store from "@/store"
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
// 刷新from.path = '/'
router.beforeEach((to, from, next) => {
  const status = store.getters["loginUser/status"]
  console.log(status, to.path);
  if (to.meta.auth) {
    if (status === "login") {
      console.log("已登录");
      next()
    } else if (status === "unlogin") {
      console.log("未登录");
      next({
        path: "/login",
        query: {
          returnUrl: to.path
        }
      })
    } else {
      console.log("正在登录中");
      next({
        path: "/loading",
        query: {
          returnUrl: to.path
        }
      })
    }
  } else {
    const token = localStorage.getItem("token")
    if (to.path === "/login" && status === "loading" && token) {
      next({
        path: "/loading"
      })
      return
    }
    next()
  }
})

export default router
