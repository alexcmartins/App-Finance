<template>
  <div class="p-6">
    <h2 class="text-2xl font-semibold mb-4">Transações</h2>

    <!-- Botão para Adicionar Nova Transação -->
    <div class="flex justify-between items-center mb-4">
      <div>
        <label class="mr-2">Filtrar:</label>
        <select v-model="filtro" class="p-2 border rounded">
          <option value="">Todas</option>
          <option value="entrada">Entradas</option>
          <option value="saida">Saídas</option>
        </select>
      </div>
      <button
        @click="toggleForm"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {{ showForm ? "Fechar Formulário" : "+ Nova Transação" }}
      </button>
    </div>

    <!-- Lista de Transações -->
    <table class="w-full border-collapse border border-gray-300">
      <thead>
        <tr class="bg-gray-200">
          <th class="border p-2">Data</th>
          <th class="border p-2">Descrição</th>
          <th class="border p-2">Categoria</th>
          <th class="border p-2">Valor</th>
          <th class="border p-2">Tipo</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="transacao in transacoesFiltradas" :key="transacao.id" class="border-b">
          <td class="border p-2">{{ formatarData(transacao.data) }}</td>
          <td class="border p-2">{{ transacao.descricao }}</td>
          <td class="border p-2">{{ transacao.categoria }}</td>
          <td class="border p-2">{{ formatarValor(transacao.valor) }}</td>
          <td class="border p-2">
            <span :class="transacao.tipo === 'entrada' ? 'text-green-500' : 'text-red-500'">
              {{ transacao.tipo }}
            </span>
          </td>
          <td class="border p-2 flex gap-2">
            <button @click="editTransaction(transacao)" class="text-blue-500">✏️</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Formulário de Transação -->
    <TransactionForm
      v-if="showForm"
      :categorias="categorias"
      :transaction="transactionToEdit"
      @addTransaction="adicionarTransacao"
      @updateTransaction="updateTransaction"
      @cancelEdit="cancelEdit"
    />
  </div>
</template>

<script>
//import { API_URL } from "../config";
import { fetchWithAuth } from "@/services/api";
import TransactionForm from "@/components/TransactionForm.vue";

export default {
  components: {
    TransactionForm,
  },
  data() {
    return {
      transacoes: [],
      categorias: [],
      filtro: "",
      showForm: false,
      transactionToEdit: null,
    };
  },
  computed: {
    transacoesFiltradas() {
      if (!this.filtro) return this.transacoes;
      return this.transacoes.filter((t) => t.tipo === this.filtro);
    },
  },
  async mounted() {
    await this.carregarTransacoes();
    await this.carregarCategorias();
  },
  methods: {
    async carregarTransacoes() {
      try {
        this.transacoes = await fetchWithAuth("/transactions"); // 🔥 Já retorna JSON
      } catch (error) {
        console.error("Erro ao carregar transações:", error);
      }
    },

    async carregarCategorias() {
      try {
        const settings = await fetchWithAuth("/settings"); // 🔥 Já retorna JSON
        this.categorias = settings.categories || [];
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    },

    async adicionarTransacao(transaction) {
      try {
        await fetchWithAuth("/transactions", {
          method: "POST",
          body: JSON.stringify(transaction),
        });

        this.showForm = false;
        await this.carregarTransacoes();
      } catch (error) {
        console.error(error);
      }
    },

    async updateTransaction(transaction) {
      try {
        await fetchWithAuth(`/transactions/${transaction.id}`, {
          method: "PUT",
          body: JSON.stringify(transaction),
        });

        this.showForm = false;
        await this.carregarTransacoes();
      } catch (error) {
        console.error(error);
      }
    },

    editTransaction(transaction) {
      this.transactionToEdit = transaction;
      this.showForm = true;
    },

    toggleForm() {
      this.transactionToEdit = null;
      this.showForm = !this.showForm;
    },

    cancelEdit() {
      this.transactionToEdit = null;
      this.showForm = false;
    },

    formatarData(data) {
      return new Date(data).toLocaleDateString();
    },

    formatarValor(valor) {
      return `R$ ${parseFloat(valor).toFixed(2).replace(".", ",")}`;
    },
  },
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}
</style>
