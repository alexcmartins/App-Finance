<!--<template>
  <div class="left-0 top-0 h-screen bg-gray-900 text-white p-4 flex flex-col transition-all"
       :class="{'w-64': !collapsed, 'w-16': collapsed}">
    
    Botão de Expandir/Recolher 
    <button @click="$emit('toggle')" class="mb-4 text-white focus:outline-none">
      <span v-if="collapsed">📖</span> Ícone quando recolhido 
      <span v-else>📂 Fechar</span> Ícone quando expandido 
    </button>

    <nav class="flex flex-col space-y-2">
      <button 
        v-for="item in menuItems" 
        :key="item.name"
        @click="$router.push(item.path)"
        class="w-full p-3 text-left rounded bg-gray-800 hover:bg-gray-700 transition-all flex items-center"
      >
        <span class="mr-2">📌</span>  Ícone genérico 
        <span v-if="!collapsed">{{ item.name }}</span>
      </button>
    </nav>

     Seção de Usuário e Logout 
    <div class="mt-auto flex items-center space-x-4 p-3 text-left rounded bg-gray-800 hover:bg-gray-700 transition-all justify-between">
      <span v-if="!collapsed" class="text-sm">User: {{ userStore.username || "Carregando..." }}</span>
      <button @click="logout" class="bg-red-500 px-3 py-1 rounded hover:bg-red-700">🚪</button>
    </div>
  </div>
</template>-->

<template>
  <div class="group/sidebar">
    <!-- Sidebar para Desktop (Fixo à Esquerda) -->
    <div 
      class="hidden md:flex bg-gray-900 text-white p-4 flex-col w-64 h-screen transition-all"
      :class="{ 'w-16': collapsed }"
    >
      <!-- Botão de Expandir/Recolher -->
      <!--<button @click="collapsed = !collapsed" class="mb-4 text-white focus:outline-none">-->
      <button @click="$emit('toggle')" class="mb-4 text-white focus:outline-none">
        <span v-if="collapsed">☰</span>
        <span v-else>📂 Fechar</span>
      </button>

      <nav class="flex flex-col space-y-2">
        <button 
          v-for="item in menuItems" 
          :key="item.name"
          @click="$router.push(item.path)"
          class="w-full p-3 text-left rounded bg-gray-800 hover:bg-gray-700 transition-all flex items-center"
        >
        <span class="mr-2" v-html="item.icon"></span>
          <span v-if="!collapsed">{{ item.name }}</span>
        </button>
      </nav>

      <!-- Usuário e Logout -->
      <div class="mt-auto flex items-center space-x-4 p-3 text-left rounded bg-gray-800 hover:bg-gray-700 transition-all justify-between">
        <span v-if="!collapsed" class="text-sm">User: {{ userStore.username || "Carregando..." }}</span>
        <button @click="logout" class="bg-red-500 px-3 py-1 rounded hover:bg-red-700">🚪</button>
      </div>
    </div>

    <!-- Sidebar para Mobile (Fixo no Bottom) -->
    <div class="md:hidden fixed z-50 bottom-0 w-full h-16 bg-gray-900 flex justify-around items-center">
      <button 
        v-for="item in menuItems" 
        :key="item.name"
        @click="$router.push(item.path)"
        class="p-2 text-white"
      >
      <span v-html="item.icon"></span>
      </button>
      <button @click="logout" class="bg-red-500 px-3 py-1 rounded hover:bg-red-700">🚪</button>
    </div>
  </div>
</template>

<script>
import { useUserStore } from "@/store/user";

export default {
  data() {
    return {
      collapsed: false, // Estado do sidebar recolhido ou expandido
      menuItems: [
        { name: 'Dashboard', path: '/dashboard', icon: '📊' }, 
        { name: 'Transações', path: '/transactions', icon: '💰' }, 
        { name: 'Relatórios', path: '/reports', icon: '📜' }, 
        { name: 'Projeções', path: '/projections', icon: '📈' }, 
        { name: 'Configurações', path: '/settings', icon: '⚙️' } 
      ]
    };
  },
  props: {
    collapsed: Boolean // Recebe o estado do App.vue
  },
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

<style scoped>
button {
  cursor: pointer;
}
</style>
