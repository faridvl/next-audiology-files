import { CookiesManager } from '../utils/cookies-manager';

export const ApiServiceClient = (baseUrl: string) => {
  const fetcher = async (endpoint: string, options: RequestInit = {}) => {
    const token = CookiesManager.getAccessToken();

    const headers = new Headers({
      'Content-Type': 'application/json',
      ...options.headers,
    });

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    let response: Response;
    try {
      response = await fetch(`${baseUrl}${endpoint}`, {
        ...options,
        headers,
      });
    } catch {
      throw new Error('No se pudo conectar con el servidor. Verifica tu conexión o intenta más tarde.');
    }

    if (response.status === 204) return null;

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Ocurrió un error inesperado. Intenta nuevamente.');
    }

    return data;
  };

  return {
    get: <T = any>(endpoint: string) => fetcher(endpoint, { method: 'GET' }),
    post: <T = any>(endpoint: string, body: any) =>
      fetcher(endpoint, { method: 'POST', body: JSON.stringify(body) }),
    put: <T = any>(endpoint: string, body: any) =>
      fetcher(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
    patch: <T = any>(endpoint: string, body: any) =>
      fetcher(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: <T = any>(endpoint: string) => fetcher(endpoint, { method: 'DELETE' }),
  };
};
