<template>
    <div>
      <h3 class="text-xl font-semibold">{{ isEdit ? "Editar Transação" : "Nova Transação" }}</h3>
      <form @submit.prevent="handleSubmit" class="mt-4">
        <input v-model="transactionData.descricao" type="text" placeholder="Descrição" class="p-2 border rounded w-full mb-2" required />
        <input v-model="transactionData.valor" type="number" step="0.01" placeholder="Valor" class="p-2 border rounded w-full mb-2" required />
  
        <!-- Seleção de Categoria puxando do Plano de Contas -->
        <select v-model="transactionData.categoria" class="p-2 border rounded w-full mb-2" required>
          <option value="" disabled>Selecione uma categoria</option>
          <option v-for="cat in categorias" :key="cat" :value="cat">{{ cat }}</option>
        </select>
  
        <select v-model="transactionData.tipo" class="p-2 border rounded w-full mb-2" required>
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
        </select>
  
        <input v-model="transactionData.data" type="date" class="p-2 border rounded w-full mb-4" required />
  
        <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          {{ isEdit ? "Salvar Alterações" : "Adicionar Transação" }}
        </button>
  
        <button v-if="isEdit" @click="$emit('cancelEdit')" type="button" class="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600 mt-2">
          Cancelar
        </button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      categorias: Array,
      transaction: Object, // Para edição
    },
    data() {
      return {
        transactionData: {
          id: this.transaction?.id || null,
          descricao: this.transaction?.descricao || "",
          valor: this.transaction?.valor || "",
          categoria: this.transaction?.categoria || "",
          tipo: this.transaction?.tipo || "entrada",
          data: this.transaction?.data ? this.formatDate(this.transaction.data) : "",
        },
      };
    },
    computed: {
      isEdit() {
        return !!this.transaction?.id;
      },
    },
    methods: {
      handleSubmit() {
        this.$emit(this.isEdit ? "updateTransaction" : "addTransaction", this.transactionData);
      },
      formatDate(date) {
        return new Date(date).toISOString().split("T")[0]; // Formato YYYY-MM-DD
      },
    },
  };
  </script>
  
  <style scoped>
  button {
    transition: background 0.3s;
  }
  </style>
  