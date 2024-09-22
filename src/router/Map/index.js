export default [
    {
        path: '/map',
        name: 'map',
        component: () => import(/* webpackChunkName: "map" */ '@/views/Map/index.vue')
    }
]