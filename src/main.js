import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import "@/styles/main.scss"
import "@/styles/iconfont.scss"
import scale from "@/directive/scale"
store.dispatch("loginUser/whomai")
const app = createApp(App)
app.directive("scale",scale)
app.use(store).use(router).mount('#app')
