// pages/login.tsx
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { LoginContainer } from '@/components/containers/login/login-container';
import { useRouter } from 'next/router';
import { SuccessAlert } from '@/components/common/alerts/success-alert';

const LoginPage = () => {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Si la URL tiene ?registered=true, mostramos la alerta
    if (router.query.registered === 'true') {
      setShowSuccess(true);

      // Opcional: Cerrar automáticamente después de 8 segundos
      const timer = setTimeout(() => setShowSuccess(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [router.query]);

  return (
    <>
      {showSuccess && <SuccessAlert onClose={() => setShowSuccess(false)} />}
      <Head>
        <title>Login | AudiologyFiles</title>
      </Head>

      <LoginContainer />
    </>
  );
};


export default LoginPage;