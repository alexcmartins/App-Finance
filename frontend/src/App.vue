<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <Sidebar v-if="isAuthenticated" />
    <div class="flex-1 flex flex-col">
      <!-- Header -->
      <Header v-if="isAuthenticated" />
      <!-- Conteúdo principal -->
      <main class="p-6 bg-gray-100 flex-1">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import Sidebar from "@/components/Sidebar.vue";
import Header from "@/components/Header.vue";
import { useUserStore } from "@/store/user";

export default {
  components: {
    Sidebar,
    Header,
  },
  setup() {
    const userStore = useUserStore();
    return {
      isAuthenticated: userStore.isAuthenticated // Pegando a autenticação do Pinia
    };
  },
  async mounted() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:5000/me', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (response.ok) {
        const userStore = useUserStore();
        userStore.setUser(data.username, token); // Atualiza o estado do usuário
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
    }
  }
};
</script>
