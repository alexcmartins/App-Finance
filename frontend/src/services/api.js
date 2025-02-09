import { API_URL } from "@/config";

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
