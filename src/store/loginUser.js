import { $login, $whoami, $loyout } from "@/apis/api"

export default {
    namespaced: true,
    state: {
        user: null,
        loading: false
    },
    getters: {
        status(state) {
            if (state.loading) {
                return "loading"
            } else if (state.user) {
                return "login"
            } else {
                return "unlogin"
            }
        }
    },
    mutations: {
        setLoading(state, payload) {
            state.loading = payload
        },
        setUser(state, payload) {
            state.user = payload
        }
    },
    actions: {
        async login(ctx, payload) {
            ctx.commit("setLoading", true)
            try{
                const res = await $login(payload)
                ctx.commit("setUser", res?.data)
                return res
            }catch (err) {
                console.log(err);
            } finally {
                ctx.commit("setLoading", false)
            }
        },
        async whomai(ctx) {
            ctx.commit("setLoading", true)
            try {
                const res = await $whoami()
                ctx.commit("setUser", res?.data)
            } catch (err) {
                console.log(err);
            } finally {
                ctx.commit("setLoading", false)
            }
        },
        async loyout(ctx) {
            ctx.commit("setLoading", true)
            const res = await $loyout()
            ctx.commit("setLoading", false)
            ctx.commit("setUser", null)
            return res
        }
    }
}