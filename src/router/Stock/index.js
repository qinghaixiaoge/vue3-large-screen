export default [
    {
        path: '/stock',
        name: 'stock',
        component: () => import(/* webpackChunkName: "stock" */ '@/views/Stock/index.vue')
    }
]