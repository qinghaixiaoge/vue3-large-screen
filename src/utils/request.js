import store from '@/store'
import axios from 'axios'
import router from "@/router"
import { Message } from './Message'
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
    } 
    return res.data
}, err => {
    if (!err.response) {
        if (err.message === "Network Error") {
            Message.error("网络错误");
        } else if (err.message.includes("timeout")) {
            Message.error("请求超时");
        }
        return
    }
    const responseCode = err.response.status
    const errorMessage = err.response.data.msg
    switch (responseCode){
        case 401:
            // 无效的token/不携带token
            Message.error(errorMessage)
            window.localStorage.removeItem('token')
            store.commit("loginUser/setUser", null)
            // 执行router还是会执行后面的逻辑
            router.push("/login").then(res => {
                
            })
            break;
        case 403:
            // token过期/token注销
            Message.error(errorMessage)
            window.localStorage.removeItem('token')
            store.commit("loginUser/setUser", null)
            // 执行router还是会执行后面的逻辑
            router.push("/login").then(res => {
                
            })
            break;
        case 404:// 请求地址不存在
            Message.error(errorMessage)
            break;
        default:
            Message.error(errorMessage)
    }
    return Promise.reject(err)
})

export default instance