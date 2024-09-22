export default [
    {
        path: '/:pathMatch(.*)*',
        name: '404',
        component: () => import(/* webpackChunkName: "notFound" */ '@/views/NotFound/index.vue')
    }
]