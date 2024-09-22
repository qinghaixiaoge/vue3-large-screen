export default [
    {
        path: '/home',
        name: 'home',
        meta:{
            auth: true
        },
        component: () => import(/* webpackChunkName: "home" */ '@/views/Home/index.vue')
    }
]