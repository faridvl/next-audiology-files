import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { LoginContainer } from '@/components/containers/login/login-container';
import { SuccessAlert } from '@/components/common/alerts/success-alert';

const LoginPage = () => {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (router.query.registered === 'true') {
      setShowSuccess(true);


      const { registered, ...restQuery } = router.query;
      router.replace({ pathname: router.pathname, query: restQuery }, undefined, { shallow: true });

      // Auto-cerrar
      const timer = setTimeout(() => setShowSuccess(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [router.query]);

  return (
    <div className="relative min-h-screen bg-slate-50">
      <Head>
        <title>Login | AudiologyFiles</title>
      </Head>

      {showSuccess && (
        <div className="fixed top-6 right-6 z-[9999]">
          <SuccessAlert
            onClose={() => setShowSuccess(false)}
            title="¡Registro Exitoso!"
            message="Ya puedes iniciar sesión con tu nueva cuenta."
          />
        </div>
      )}

      <LoginContainer />
    </div>
  );
};

export default LoginPage;