<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">Configurações</h2>

    <!-- Tipo de Uso -->
    <div class="mb-6">
      <label class="block text-lg font-semibold mb-2">Tipo de Uso:</label>
      <select v-model="usageType" class="w-full p-2 border rounded" @change="handleUsageChange">
        <option value="pessoal">Pessoal</option>
        <option value="empresarial">Empresarial</option>
        <option value="multiempresas">Multiempresas</option>
      </select>
    </div>

    <!-- Plano de Contas -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-2">Plano de Contas</h3>
      <ul class="mb-2">
        <li v-for="(category, index) in categories" :key="index" class="flex justify-between items-center bg-gray-200 p-2 rounded mb-2">
          <span>{{ category }}</span>
          <button @click="removeCategory(index)" class="text-red-500">✖</button>
        </li>
      </ul>
      <div class="flex">
        <input v-model="newCategory" type="text" class="w-full p-2 border rounded" placeholder="Nova Categoria" />
        <button @click="addCategory" class="ml-2 bg-blue-500 text-white px-4 py-2 rounded">Adicionar</button>
      </div>
    </div>

    <!-- Cadastro de Empresas (Somente para Multiempresas) -->
    <div v-if="usageType === 'multiempresas'" class="mb-6">
      <h3 class="text-lg font-semibold mb-2">Cadastro de Empresas</h3>
      <ul class="mb-2">
        <li v-for="(company, index) in companies" :key="index" class="flex justify-between items-center bg-gray-200 p-2 rounded mb-2">
          <span>{{ company.name }}</span>
          <button @click="removeCompany(index)" class="text-red-500">✖</button>
        </li>
      </ul>
      <div class="flex">
        <input v-model="newCompanyName" type="text" class="w-full p-2 border rounded" placeholder="Nome da Empresa" />
        <button @click="addCompany" class="ml-2 bg-blue-500 text-white px-4 py-2 rounded">Adicionar</button>
      </div>
    </div>

    <!-- Botão de Salvar -->
    <button @click="saveSettings" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Salvar Configurações</button>

    <p v-if="mensagem" class="text-green-500 mt-4">{{ mensagem }}</p>
    <p v-if="erro" class="text-red-500 mt-4">{{ erro }}</p>
  </div>
</template>

<script>
//import { API_URL } from "@/config";
import { fetchWithAuth } from "@/services/api";
import { useUserStore } from "@/store/user"; 

export default {
  data() {
    return {
      usageType: "pessoal",
      categories: ["Salário", "Investimentos", "Despesas Fixas", "Despesas Variáveis"],
      newCategory: "",
      companies: [],
      newCompanyName: "",
      userStore: useUserStore(),
      mensagem: "",
      erro: "",
    };
  },
  methods: {
    handleUsageChange() {
      if (this.usageType !== "multiempresas") {
        this.companies = [];
      }
    },
    addCategory() {
      if (this.newCategory.trim() !== "" && !this.categories.includes(this.newCategory.trim())) {
        this.categories.push(this.newCategory.trim());
        this.newCategory = "";
      }
    },
    removeCategory(index) {
      this.categories.splice(index, 1);
    },
    addCompany() {
      if (this.newCompanyName.trim() !== "") {
        this.companies.push({ name: this.newCompanyName.trim() });
        this.newCompanyName = "";
      }
    },
    removeCompany(index) {
      this.companies.splice(index, 1);
    },
    async saveSettings() {
      try {
        const settingsData = {
          usageType: this.usageType,
          categories: this.categories,
          companies: this.companies,
        };

        const data = await fetchWithAuth("/settings", {
          method: "POST",
          body: JSON.stringify(settingsData),
        });

        this.mensagem = "Configurações salvas com sucesso!";
        this.erro = "";
      } catch (error) {
        this.erro = error.message;
      }
    },

    async loadSettings() {
      try {
        const data = await fetchWithAuth("/settings"); // 🔥 Já retorna JSON

        this.usageType = data.usageType || "pessoal";
        this.categories = data.categories || [];
        this.companies = data.companies || [];
      } catch (error) {
        this.erro = error.message;
      }
    },
  },
  mounted() {
    this.loadSettings(); // Carrega as configurações ao abrir a página
  },
};
</script>

<style scoped>
button {
  transition: background 0.3s;
}
</style>