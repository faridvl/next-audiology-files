import { useState } from 'react';
import { useRouter } from 'next/router';
import { routesPublic } from '@/shared/navigation/routes';

export const useRegister = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegisterSubmit = async (values: any, actions: any) => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await fetch('http://localhost:7170/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al registrar la clínica');
      }

      // Registro exitoso, redirigimos al login
      router.push(`${routesPublic.login}?registered=true`);
    } catch (err: any) {
      setError(err.message || 'No se pudo conectar con el servidor');
    } finally {
      setIsLoading(false);
      actions.setSubmitting(false);
    }
  };

  return {
    handleRegisterSubmit,
    isLoading,
    error,
    handleResetError: () => setError(null),
  };
};
