import { Preferences } from "@capacitor/preferences";

const API_URL = "http://127.0.0.1:8000/api";

export async function getToken(): Promise<string | null> {
  const { value } = await Preferences.get({ key: "token" });
  return value;
}

export async function setToken(token: string) {
  await Preferences.set({ key: "token", value: token });
}

export async function clearToken() {
  await Preferences.remove({ key: "token" });
}

async function request(path: string, options: RequestInit = {}) {
  const token = await getToken();

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Token ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.detail || `Erreur ${response.status}`);
  }

  return response.json();
}

export const api = {
  get: (path: string) => request(path),
  post: (path: string, body?: unknown) =>
    request(path, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),
};
