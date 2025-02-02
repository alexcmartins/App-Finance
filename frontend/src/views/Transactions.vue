<template>
  <div class="p-6">
    <h2 class="text-2xl font-semibold mb-4">Transações</h2>

    <!-- Filtro -->
    <div class="mb-4">
      <label class="mr-2">Filtrar:</label>
      <select v-model="filtro" class="p-2 border rounded">
        <option value="">Todas</option>
        <option value="entrada">Entradas</option>
        <option value="saida">Saídas</option>
      </select>
    </div>

    <!-- Lista de Transações -->
    <table class="w-full border-collapse border border-gray-300">
      <thead>
        <tr class="bg-gray-200">
          <th class="border p-2">Data</th>
          <th class="border p-2">Descrição</th>
          <th class="border p-2">Valor</th>
          <th class="border p-2">Tipo</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="transacao in transacoesFiltradas" :key="transacao.id" class="border-b">
          <td class="border p-2">{{ formatarData(transacao.data) }}</td>
          <td class="border p-2">{{ transacao.descricao }}</td>
          <td class="border p-2">{{ formatarValor(transacao.valor) }}</td>
          <td class="border p-2">
            <span :class="transacao.tipo === 'entrada' ? 'text-green-500' : 'text-red-500'">
              {{ transacao.tipo }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Formulário para Adicionar Transação -->
    <h3 class="text-xl font-semibold mt-6">Nova Transação</h3>
    <form @submit.prevent="adicionarTransacao" class="mt-4">
      <input v-model="novaTransacao.descricao" type="text" placeholder="Descrição" class="p-2 border rounded w-full mb-2" required />
      <input v-model="novaTransacao.valor" type="number" placeholder="Valor" class="p-2 border rounded w-full mb-2" required />
      <select v-model="novaTransacao.tipo" class="p-2 border rounded w-full mb-2" required>
        <option value="">Selecione o Tipo</option>
        <option value="entrada">Entrada</option>
        <option value="saida">Saída</option>
      </select>
      <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
        Adicionar Transação
      </button>
    </form>

    <p v-if="mensagem" class="text-green-500 mt-4">{{ mensagem }}</p>
    <p v-if="erro" class="text-red-500 mt-4">{{ erro }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      transacoes: [],
      filtro: "",
      novaTransacao: {
        descricao: "",
        valor: "",
        tipo: ""
      },
      mensagem: "",
      erro: ""
    };
  },
  computed: {
    transacoesFiltradas() {
      if (!this.filtro) return this.transacoes;
      return this.transacoes.filter(t => t.tipo === this.filtro);
    }
  },
  async mounted() {
    await this.carregarTransacoes();
  },
  methods: {
    async carregarTransacoes() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://192.168.0.26:5000/transactions", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();

        if (response.ok) {
          this.transacoes = data;
        } else {
          throw new Error(data.error || "Erro ao carregar transações");
        }
      } catch (error) {
        this.erro = error.message;
      }
    },
    async adicionarTransacao() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://192.168.0.26:5000/transactions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(this.novaTransacao)
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Erro ao adicionar transação");

        this.mensagem = "Transação adicionada com sucesso!";
        this.erro = "";
        this.novaTransacao = { descricao: "", valor: "", tipo: "" };
        await this.carregarTransacoes(); // Atualiza a lista
      } catch (error) {
        this.erro = error.message;
      }
    },
    formatarData(data) {
      return new Date(data).toLocaleDateString();
    },
    formatarValor(valor) {
      return `R$ ${parseFloat(valor).toFixed(2).replace(".", ",")}`;
    }
  }
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}
</style>
