import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// 注册事件总线
import "./utils/Message";
import "@/styles/main.scss";
import "@/styles/iconfont.scss";
import scale from "@/directive/scale";
import registerGlobalComponents from "./components";
const token = localStorage.getItem("token");
// 没token，跳转到鉴权页，无需去发包，直接跳转登录页即可
if (token) {
  store.dispatch("loginUser/whomai");
}
const app = createApp(App);
registerGlobalComponents(app);
app.directive("scale", scale);
app.use(store).use(router).mount("#app");
