<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
      <div class="bg-white p-6 rounded shadow-md w-96">
        <h2 class="text-xl font-semibold text-center mb-4">Registro</h2>
        <form @submit.prevent="register">
          <input v-model="username" type="text" placeholder="Usuário" class="w-full p-2 border rounded mb-2" required />
          <input v-model="password" type="password" placeholder="Senha" class="w-full p-2 border rounded mb-4" required />
          <button type="submit" class="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
            Registrar
          </button>
        </form>
        <p class="text-center text-sm mt-4">
          Já tem uma conta? <router-link to="/login" class="text-blue-500">Faça login</router-link>
        </p>
        <p v-if="error" class="text-red-500 text-center mt-2">{{ error }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        username: '',
        password: '',
        error: null
      };
    },
    methods: {
      async register() {
        try {
          const response = await fetch('http://localhost:5000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: this.username, password: this.password })
          });
  
          const data = await response.json();
  
          if (!response.ok) {
            throw new Error(data.message || 'Erro ao registrar');
          }
  
          this.$router.push('/login'); // Redireciona para a página de login após o registro
        } catch (err) {
          this.error = err.message;
        }
      }
    }
  };
  </script>
  