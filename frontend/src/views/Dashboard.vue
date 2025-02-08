<template>
    <div class="p-6">
      <h2 class="text-2xl font-semibold mb-4">Dashboard</h2>
  
      <!-- Cards de Resumo -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="bg-blue-500 text-white p-4 rounded-lg">
          <h3 class="text-lg font-semibold">Saldo Atual</h3>
          <p class="text-2xl font-bold">{{ formatarValor(saldoAtual) }}</p>
        </div>
        <div class="bg-green-500 text-white p-4 rounded-lg">
          <h3 class="text-lg font-semibold">Receitas Totais</h3>
          <p class="text-2xl font-bold">{{ formatarValor(receitasTotais) }}</p>
        </div>
        <div class="bg-red-500 text-white p-4 rounded-lg">
          <h3 class="text-lg font-semibold">Despesas Totais</h3>
          <p class="text-2xl font-bold">{{ formatarValor(despesasTotais) }}</p>
        </div>
      </div>
  
      <!-- Gráficos -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10px">
        <div class="bg-white p-4 rounded-lg shadow-md">
          <h3 class="text-lg font-semibold text-center">Fluxo de Caixa</h3>
          <LineChart v-if="fluxoCaixaData.datasets.length > 0" :chart-data="fluxoCaixaData" :chart-options="chartOptions" />
        </div>
        <div class="bg-white p-4 rounded-lg shadow-md mt-10px">
          <h3 class="text-lg font-semibold text-center">Comparação de Receitas vs Despesas</h3>
          <BarChart v-if="comparacaoReceitasDespesasData.datasets.length > 0" :chart-data="comparacaoReceitasDespesasData" :chart-options="chartOptions" />
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { LineChart, BarChart } from 'vue-chart-3';
  import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, LineController, BarController } from 'chart.js';
  import { API_URL } from '../config';

  // Registrando os componentes do Chart.js
  ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, LineController, BarController);
  
  export default {
    components: {
      LineChart,
      BarChart
    },
    data() {
      return {
        saldoAtual: 0,
        receitasTotais: 0,
        despesasTotais: 0,
        fluxoCaixaData: { labels: [], datasets: [] },  // Inicializado como objeto vazio
        comparacaoReceitasDespesasData: { labels: [], datasets: [] },  // Inicializado como objeto vazio
        chartOptions: {
          responsive: true,
          plugins: {
            legend: { display: true }
          }
        }
      };
    },
    async mounted() {
      await this.carregarDados();
    },
    methods: {
      async carregarDados() {
        try {
          const token = localStorage.getItem("token");
          
          const response = await fetch(`${API_URL}/dashboard`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await response.json();
  
          if (!response.ok) throw new Error(data.error || "Erro ao carregar dados financeiros");
  
          this.saldoAtual = data.saldo_atual;
          this.receitasTotais = data.total_receitas;
          this.despesasTotais = data.total_despesas;
  
          this.atualizarGraficos();
        } catch (error) {
          console.error("Erro ao carregar dados:", error.message);
        }
      },
      atualizarGraficos() {
        this.fluxoCaixaData = {
          labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
          datasets: [
            {
              label: "Receitas",
              data: [1000, 2000, 1500, 3000, 2500, this.receitasTotais],
              borderColor: "green",
              backgroundColor: "rgba(0, 255, 0, 0.3)"
            },
            {
              label: "Despesas",
              data: [800, 1200, 1100, 2200, 2000, this.despesasTotais],
              borderColor: "red",
              backgroundColor: "rgba(255, 0, 0, 0.3)"
            }
          ]
        };
  
        // Dados para gráfico de comparação
        this.comparacaoReceitasDespesasData = {
          labels: ["Receitas", "Despesas"],
          datasets: [
            {
              label: "Total",
              data: [this.receitasTotais, this.despesasTotais],
              backgroundColor: ["green", "red"]
            }
          ]
        };
      },
      formatarValor(valor) {
        return `R$ ${parseFloat(valor).toFixed(2).replace(".", ",")}`;
      }
    }
  };
  </script>
  
  <style scoped>
  .bg-white {
    background-color: #fff;
  }
  </style>
  