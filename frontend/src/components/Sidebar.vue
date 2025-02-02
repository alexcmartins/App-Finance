<template>
    <div class="w-64 h-screen bg-gray-900 text-white p-4 flex flex-col">
      <h2 class="text-xl font-bold mb-4">FinanceApp</h2>
      <nav class="flex ">
        <ul class="space-y-2">
          <li v-for="item in menuItems" :key="item.name">
            <router-link :to="item.path" class="block p-2 rounded hover:bg-gray-700">
              {{ item.name }}
            </router-link>
          </li>
        </ul>
      </nav>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        menuItems: [
          { name: 'Dashboard', path: '/' },
          { name: 'Transações', path: '/transactions' },
          { name: 'Relatórios', path: '/reports' },
          { name: 'Projeções', path: '/projections' },
          { name: 'Configurações', path: '/settings' }
        ]
      };
    }
  };
  </script>
  
  <style scoped>
  nav ul li a {
    display: flex;
    padding: 10px;
    border-radius: 5px;
    text-decoration: none;
    color: rgb(0, 0, 0);
  }
  </style>
  