export default [
    {
        path: '/hot',
        name: 'hot',
        component: () => import(/* webpackChunkName: "hot" */ '@/views/Hot/index.vue')
    }
]