export default [
    {
        path: '/',
        redirect: { name: 'login' },
    },
    {
        path: '/login',
        name: 'login',
        component: () => import(/* webpackChunkName: "login" */ '@/views/Login/index.vue')
    }
]