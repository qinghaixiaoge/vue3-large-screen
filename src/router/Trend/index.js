export default [
    {
        path: '/trend',
        name: 'trend',
        component: () => import(/* webpackChunkName: "trend" */ '@/views/Trend/index.vue')
    }
]