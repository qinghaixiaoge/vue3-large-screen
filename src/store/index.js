import { createStore } from "vuex";
import loginUser from "./loginUser";
import $bus from "@/utils/bus";

$bus.on("API:INVALID", () => {
  store.commit("loginUser/setUser", null);
});
$bus.on("API:UN_AUTH", () => {
  store.commit("loginUser/setUser", null);
});

const store = createStore({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    loginUser,
  },
});

export default store;
