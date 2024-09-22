export default [
    {
        path: '/rank',
        name: 'rank',
        component: () => import(/* webpackChunkName: "rank" */ '@/views/Rank/index.vue')
    }
]