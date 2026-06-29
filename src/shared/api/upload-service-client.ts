import { CookiesManager } from '../utils/cookies-manager';

export const uploadFile = async (baseUrl: string, endpoint: string, file: File): Promise<{ url: string }> => {
  const token = CookiesManager.getAccessToken();
  const formData = new FormData();
  formData.append('file', file);

  let response: Response;
  try {
    response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: formData,
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor. Verifica tu conexión o intenta más tarde.');
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error al subir el archivo.');
  }

  return data as { url: string };
};
