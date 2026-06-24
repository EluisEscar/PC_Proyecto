// Cliente ligero de la API. Centraliza la URL base y el manejo del token JWT.

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

export interface Worker {
  id: string;
  fullName: string;
  description?: string | null;
  photoUrl?: string | null;
  crossing: string;
  latitude?: number | null;
  longitude?: number | null;
  phone?: string | null;
  active: boolean;
  createdAt: string;
}

export interface Tip {
  id: string;
  amount: string;
  message?: string | null;
  donorName?: string | null;
  createdAt: string;
}

export interface WorkerDetail extends Worker {
  tips: Tip[];
  totalTips: string | number;
  _count: { tips: number };
}

const TOKEN_KEY = 'mv_token';

export const auth = {
  getToken: () =>
    typeof window === 'undefined' ? null : localStorage.getItem(TOKEN_KEY),
  setToken: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = auth.getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `Error ${res.status}`);
  }
  return res.status === 204 ? (undefined as T) : res.json();
}

export const api = {
  login: (email: string, password: string) =>
    request<{ accessToken: string; user: { name: string } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  listWorkers: () => request<Worker[]>('/workers'),

  getWorker: (id: string) => request<WorkerDetail>(`/workers/${id}`),

  createWorker: (data: Partial<Worker>) =>
    request<Worker>('/workers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  deleteWorker: (id: string) =>
    request<void>(`/workers/${id}`, { method: 'DELETE' }),

  sendTip: (
    workerId: string,
    data: { amount: number; donorName?: string; message?: string },
  ) =>
    request<Tip>(`/workers/${workerId}/tips`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
