import store from '@/store'
import axios from 'axios'
import router from "@/router"
import { Message } from './Message'
const instance = axios.create({
    baseURL: process.env.MY_BASE_URL,
    timeout: 5000
})
// 存储所有请求的停止
window.cancelTokenObject = {}
instance.interceptors.request.use(config => {
    const token = window.localStorage.getItem('token')
    if (token) {
        config.headers.token = token
    }
    const cancelTokenSource = axios.CancelToken.source()
    // config.url格式如下：/promise?a=1&b=2
    const key = `${config.method}-${config.url}-${JSON.stringify(config.params) || ''}`
    cancelTokenObject[key] = cancelTokenSource
    config.cancelToken = cancelTokenSource.token
    return config
})

instance.interceptors.response.use(res => {
    const key = `${res.config.method}-${res.config.url}-${JSON.stringify(res.config.params) || ''}`
    delete cancelTokenObject[key]
    if (res.data?.data?.token) {
        window.localStorage.setItem('token', res.data.data.token)
    }
    return res.data
}, err => {
    if (axios.isCancel(err)) {
        // console.log("请求已取消");
        return Promise.reject(err)
    }
    if (!err.response) {
        if (err.message === "Network Error") {
            Message.error("网络错误");
        } else if (err.message.includes("timeout")) {
            Message.error("请求超时");
        }
        return Promise.reject(err)
    }
    const responseCode = err.response.status
    const errorMessage = err.response.data.msg
    switch (responseCode) {
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

// 停止所有请求
export const cancelAllRequest = () => {
    Object.values(cancelTokenObject).forEach(cancelTokenSource => {
        cancelTokenSource && cancelTokenSource.cancel("请求已取消")
    })
    // 取消令牌映射
    for (const key in cancelTokenObject) {
        delete cancelTokenObject[key]
    }
}

export default instance