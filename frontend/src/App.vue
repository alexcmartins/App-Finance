<!--<template>
  <div class="flex h-screen">
     Área Principal 
    <div class="flex flex-col flex-initial transition-all"
        :class="{ 'ml-40': isAuthenticated && !collapsed, 'ml-20': isAuthenticated && collapsed }">
      
      Sidebar (Aparece Apenas Quando Logado) 
      <Sidebar v-if="isAuthenticated" :collapsed="collapsed" @toggle="collapsed = !collapsed" />
      
    </div>
    <div class="flex flex-col w-100 flex-auto transition-all"
        :class="{ 'ml-80': isAuthenticated && !collapsed, 'ml-60': isAuthenticated && collapsed }">
      <main class="p-6 bg-gray-100 flex-auto transition-all">
        <router-view />
      </main>
    </div>
  </div>
</template>-->

<template>
  <div class="flex flex-col md:flex-row h-screen">
    <!-- Sidebar (Ele se ajusta automaticamente para mobile/desktop) -->
    <Sidebar v-if="isAuthenticated" />

    <!-- Área Principal -->
    <div class="flex-auto bg-gray-100 transition-all">
      <main class="p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import Sidebar from "@/components/Sidebar.vue";
import { useUserStore } from "@/store/user";
import { storeToRefs } from "pinia";

export default {
  components: {
    Sidebar
  },
  data() {
    return {
      collapsed: false // Agora o App.vue controla o estado do Sidebar
    };
  },
  setup() {
    const userStore = useUserStore();
    const { isAuthenticated } = storeToRefs(userStore);

    return {
      isAuthenticated
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
        userStore.setUser(data.username, token);
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
    }
  }
};
</script>
