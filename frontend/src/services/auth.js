import { fetchWithAuth } from "@/services/api";

export function isAuthenticated() {
  const token = localStorage.getItem("token");
  return token !== null;
}

export async function validateToken() {
  try {
    await fetchWithAuth("/me"); // Tenta validar o token chamando a API
    return true;
  } catch (error) {
    localStorage.removeItem("token");
    return false;
  }
}
