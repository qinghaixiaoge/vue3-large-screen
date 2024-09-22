import store from '@/store'
import axios from 'axios'
import router from "@/router"

const instance = axios.create({
    baseURL: process.env.MY_BASE_URL,
    timeout: 5000
})

instance.interceptors.request.use(config => {
    const token = window.localStorage.getItem('token')
    if (token) {
        config.headers.token = token
    }
    return config
})

instance.interceptors.response.use(res => {
    if (res.data?.data?.token) {
        window.localStorage.setItem('token', res.data.data.token)
    } else if (res.data?.msg === "token无效") {
        // 清除失效token
        console.log("清除token和仓库的用户信息");
        window.localStorage.removeItem('token')
        store.commit("loginUser/setUser", null)
        router.push("/login")
    }
    return res.data
}, err => {
    return Promise.reject(err)
})

export default instance