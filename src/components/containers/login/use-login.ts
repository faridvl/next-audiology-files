import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { routesPrivate } from '@/shared/navigation/routes';
import { CookiesManager } from '@/shared/utils/cookies-manager';
export const useLogin = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Limpieza de seguridad al entrar al login
    CookiesManager.clearAll();
  }, []);

  const handleLoginSubmit = async (values: any, actions: any) => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await fetch('http://localhost:7170/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Manejo de errores específicos del API (401, 404, etc)
        throw new Error('Credenciales incorrectas');
      }

      // 1. Extraemos el token usando el nombre exacto de tu JSON: access_token
      const { access_token, user } = data;

      if (access_token) {
        // 2. Guardamos el token (el manager ya tiene configurada la hora de expiración)
        CookiesManager.setSessionToken(access_token);

        // Opcional: Guardar el nombre del usuario en localStorage para la UI
        localStorage.setItem('user_name', user.name);

        // 3. Redirección al Home
        await router.push(routesPrivate.home);
      }
    } catch (err: any) {
      setError(err.message || 'No se pudo conectar con el servidor');
    } finally {
      setIsLoading(false);
      actions.setSubmitting(false);
    }
  };

  return {
    handleLoginSubmit,
    isLoading,
    error,
    handleResetError: () => setError(null),
  };
};
