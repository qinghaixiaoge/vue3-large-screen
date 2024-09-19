import store from '@/store'
import axios from 'axios'

const instance = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? "【服务器node访问接口】" : "http://192.168.0.106:3000/",
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
    }
    return res.data
}, err => {
    return Promise.reject(err)
})

export default instance