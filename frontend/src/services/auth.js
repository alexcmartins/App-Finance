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

export async function refreshToken() {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    window.location.href = "/login";
    return;
  }

  try {
    const response = await fetch("/auth/refresh-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error);

    localStorage.setItem("token", data.token);
    return data.token;
  } catch (error) {
    console.error("Erro ao renovar token:", error);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
  }
}
