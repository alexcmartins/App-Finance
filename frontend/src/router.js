import { createRouter, createWebHistory } from 'vue-router';
import { isAuthenticated, validateToken } from "@/services/auth";
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

/*
// Middleware para proteger rotas autenticadas
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    if (!isAuthenticated()) {
      next("/login");
    } else {
      const isValid = await validateToken();
      if (!isValid) {
        next("/login");
      } else {
        next();
      }
    }
  } else {
    next();
  }
});*/

// Middleware de proteção de rota
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  if (to.meta.requiresAuth && !token) {
    next("/login"); // Redireciona para login se não estiver autenticado
  } else {
    next();
  }
});

export default router;
