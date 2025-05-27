import { defineStore } from "pinia";
import { login as loginApi, logout as logoutApi } from "@/services/authService";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.token && !!state.user,
  },
  actions: {
    async login({ email, password }) {
      const res = await loginApi({ email, password });
      this.token = res.data.access_token;
      this.user = res.data.user;

      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("loginTime", Date.now().toString());
    },
    async logout() {
      try {
        await logoutApi();
      } catch (e) {
        console.error("Logout failed:", e);
      }
      this.user = null;
      this.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("loginTime");
    },
  },
});