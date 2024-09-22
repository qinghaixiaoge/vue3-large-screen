export default [
    {
        path: '/loading',
        name: 'loading',
        component: () => import(/* webpackChunkName: "loading" */ '@/views/Loading/index.vue')
    }
]