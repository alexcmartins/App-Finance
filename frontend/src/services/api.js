import { API_URL } from "@/config";
import { refreshToken } from "./auth";

/*
export async function fetchWithAuth(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

  if (!response.ok) {
    const data = await response.json().catch(() => null); // Evita erro se a resposta não for JSON
    if (data?.redirect) {
      localStorage.removeItem("token");
      window.location.href = "/login"; // Redireciona para login
    }
    throw new Error(data?.error || "Erro ao processar requisição");
  }

  return response.json(); // Retorna os dados em JSON
}
*/

/*
export async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login"; // 🔥 Redireciona se não houver token
    return;
  }

  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(url, options);
  
  if (response.status === 403) {
    // 🔥 Token expirado ou inválido -> Redireciona para login
    localStorage.removeItem("token");
    window.location.href = "/login";
    return;
  }

  return response.json();
}*/



export async function fetchWithAuth(url, options = {}) {
  let token = localStorage.getItem("token");

  // 🔥 Caso o token esteja expirado ou inválido, tenta renovar antes de continuar
  if (!token) {
    token = await refreshToken();
    if (!token) {
      window.location.href = "/login";
      return;
    }
  }

  const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

  const headers = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  // 🔥 Se o token expirou e o backend retornou 403, tenta renovar
  if (response.status === 403) {
    token = await refreshToken();
    if (!token) return window.location.href = "/login";

    return fetchWithAuth(url, options); // 🔥 Tenta novamente com o novo token
  }

  return response.json();
}
