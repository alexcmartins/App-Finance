import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    username: null,
    token: localStorage.getItem("token") || null
  }),
  getters: {
    isAuthenticated: (state) => !!state.token // Se existir token, usuário está autenticado
  },
  actions: {
    setUser(username, token) {
      this.username = username;
      this.token = token;
      localStorage.setItem("token", token);
    },
    logout() {
      this.username = null;
      this.token = null;
      localStorage.removeItem("token");
    }
  }
});
