import { getToken, clearToken } from "./auth";

// All API calls use relative URLs (same-origin) by default, falling back to env var
export const API_URL = import.meta.env.VITE_API_URL || "";

export function apiUrl(path: string): string {
  return `${API_URL}${path}`;
}

export function wsUrl(path: string): string {
  let base;
  if (API_URL) {
    const url = new URL(API_URL, window.location.origin);
    const protocol = url.protocol === "https:" ? "wss:" : "ws:";
    base = `${protocol}//${url.host}`;
  } else {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    base = `${protocol}//${window.location.host}`;
  }
  const token = getToken();
  const separator = path.includes("?") ? "&" : "?";
  const tokenParam = token ? `${separator}token=${encodeURIComponent(token)}` : "";
  return `${base}${path}${tokenParam}`;
}

export async function apiFetch<T>(path: string): Promise<T> {
  const headers: HeadersInit = {};
  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(apiUrl(path), { headers });
  if (res.status === 401) {
    clearToken();
    window.location.reload();
    throw new Error("Unauthorized");
  }
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }
  return res.json();
}
