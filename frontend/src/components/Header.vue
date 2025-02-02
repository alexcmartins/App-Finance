<template>
  <header class="bg-gray-800 text-white p-4 flex justify-between items-center">
    <h1 class="text-lg font-semibold">Dashboard</h1>
    <div class="flex items-center space-x-4">
      <span class="text-sm">{{ userStore.username || "Carregando..." }}</span>
      <button @click="logout" class="bg-red-500 px-3 py-1 rounded hover:bg-red-700">Sair</button>
    </div>
  </header>
</template>

<script>
import { useUserStore } from "@/store/user";

export default {
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },
  methods: {
    logout() {
      this.userStore.logout();
      this.$router.push("/login");
    }
  }
};
</script>
