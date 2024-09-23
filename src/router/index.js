import { createRouter, createWebHistory } from 'vue-router'
import store from "@/store"

let routes = []
const routerContext = require.context("./", true, /index\.js$/)
routerContext.keys().forEach(route => {
  if (route.startsWith("./index")) return
  const routeModule = routerContext(route)
  routes = [...routes, ...(routeModule.default || routeModule)]
})

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
// 刷新from.path = '/'
router.beforeEach((to, from, next) => {
  const status = store.getters["loginUser/status"]
  // console.log(status, to.path);
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
    if (to.path === "/login" && status === "loading") {
      next({
        path: "/loading"
      })
      return
    }
    next()
  }
})

export default router
