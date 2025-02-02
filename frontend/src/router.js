import { createRouter, createWebHistory } from 'vue-router';
import Login from './views/Login.vue';
import Register from './views/Register.vue';
import Dashboard from './views/Dashboard.vue';
import Transactions from './views/Transactions.vue';
import Reports from './views/Reports.vue';
import Projections from './views/Projections.vue';
import Settings from './views/Settings.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  {
    path: '/dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/transactions',
    component: Transactions,
    meta: { requiresAuth: true }
  },
  {
    path: '/reports',
    component: Reports,
    meta: { requiresAuth: true }
  },
  {
    path: '/projections',
    component: Projections,
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    component: Settings,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Middleware para proteger rotas autenticadas
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token'); // Verifica se o token está armazenado

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login'); // Redireciona para login se não estiver autenticado
  } else {
    next();
  }
});

export default router;
