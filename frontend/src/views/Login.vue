<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-6 rounded shadow-md w-96">
      <h2 class="text-xl font-semibold text-center mb-4">Login</h2>
      <form @submit.prevent="login">
        <input v-model="username" type="text" placeholder="Usuário" class="w-full p-2 border rounded mb-3" required />
        <input v-model="password" type="password" placeholder="Senha" class="w-full p-2 border rounded mb-3" required />
        <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Entrar
        </button>
      </form>
      <p class="text-center text-sm mt-4">
        Não tem uma conta? <router-link to="/register" class="text-blue-500">Registre-se</router-link>
      </p>
      <p v-if="error" class="text-red-500 text-center mt-2">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '../store/user';
import { API_URL } from '../config';

export default {
  data() {
    return {
      username: '',
      password: '',
      error: null
    };
  },
  methods: {
    async login() {
      try {
        
        const response = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: this.username, password: this.password })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Erro ao fazer login');
        }

        //window.location.reload(); 

        // Atualiza o estado do usuário no Pinia
        const userStore = useUserStore();
        userStore.setUser(data.username, data.token);

        //localStorage.setItem('token', data.token); // Apenas o token fica salvo
        this.$router.push('/dashboard'); // Redireciona para o Dashboard
        
      } catch (err) {
        this.error = err.message;
      }
    }
  }
};
</script>
