export default [
    {
        path: '/seller',
        name: 'seller',
        component: () => import(/* webpackChunkName: "seller" */ '@/views/Seller/index.vue')
    }
]