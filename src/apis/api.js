import instance from "@/utils/request"

function delay(duration=2000){
    return new Promise(resolve=>{
        setTimeout(()=>{
            resolve()
        },duration)
    })
}
export const $login = async function (params) {
    return instance.post('/login', params)
}

export const $whoami = async function () {
    return instance.get('/whoami')
}

export const $loyout = async function () {
    return instance.get('/logout')
}

export const $getHot = async function () {
    return instance.get('/getHot')
}

export const $getRank = async function () {
    return instance.get('/getRank')
}

export const $getMap = async function () {
    return instance.get('/getMap')
}

export const $getChina = async function () {
    return instance.get('/getChina')
}

export const $getProvince = async function (params) {
    return instance.get(`/getProvince?key=${params}`)
}

export const $getSeller = async function () {
    return instance.get('/getSeller')
}

export const $getStock = async function () {
    return instance.get('/getStock')
}

export const $getTrend = async function () {
    return instance.get('/getTrend')
}