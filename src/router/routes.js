
const routes = [
    {
        path: '/',
        redirect: { name: 'login' },
    },
    {
        path: '/login',
        name: 'login',
        component: () => import(/* webpackChunkName: "login" */ '../views/Login/index.vue')
    },
    {
        path: '/home',
        name: 'home',
        meta:{
            auth: true
        },
        component: () => import(/* webpackChunkName: "home" */ '../views/Home/index.vue')
    },
    {
        path: '/loading',
        name: 'loading',
        component: () => import(/* webpackChunkName: "loading" */ '../views/Loading/index.vue')
    },
    {
        path: '/hot',
        name: 'hot',
        component: () => import(/* webpackChunkName: "hot" */ '../views/Hot/index.vue')
    },
    {
        path: '/rank',
        name: 'rank',
        component: () => import(/* webpackChunkName: "rank" */ '../views/Rank/index.vue')
    },
    {
        path: '/map',
        name: 'map',
        component: () => import(/* webpackChunkName: "map" */ '../views/Map/index.vue')
    },
    {
        path: '/seller',
        name: 'seller',
        component: () => import(/* webpackChunkName: "seller" */ '../views/Seller/index.vue')
    },
    {
        path: '/stock',
        name: 'stock',
        component: () => import(/* webpackChunkName: "stock" */ '../views/Stock/index.vue')
    },
    {
        path: '/trend',
        name: 'trend',
        component: () => import(/* webpackChunkName: "trend" */ '../views/Trend/index.vue')
    },
    {
        path: '/:pathMatch(.*)*',
        name: '404',
        component: () => import(/* webpackChunkName: "notFound" */ '../views/NotFound/index.vue')
    }
]

export default routes