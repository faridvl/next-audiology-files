import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { LoginContainer } from '@/components/containers/login/login-container';
import { SuccessAlert } from '@/components/common/alerts/success-alert';
import { ClockIcon, XMarkIcon } from '@heroicons/react/24/outline';

const LoginPage = () => {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showExpired, setShowExpired] = useState(false);

  useEffect(() => {
    if (router.query.registered === 'true') {
      setShowSuccess(true);
      const { registered, ...restQuery } = router.query;
      router.replace({ pathname: router.pathname, query: restQuery }, undefined, { shallow: true });
      const timer = setTimeout(() => setShowSuccess(false), 6000);
      return () => clearTimeout(timer);
    }
    if (router.query.expired === 'true') {
      setShowExpired(true);
      const { expired, ...restQuery } = router.query;
      router.replace({ pathname: router.pathname, query: restQuery }, undefined, { shallow: true });
      const timer = setTimeout(() => setShowExpired(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [router.query]);

  return (
    <div className="relative min-h-screen bg-slate-50">
      <Head>
        <title>Login </title>
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

      {showExpired && (
        <div className="fixed top-6 right-6 z-[9999] animate-slide-in">
          <div className="bg-white/80 backdrop-blur-xl border border-amber-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-3xl p-5 flex items-center gap-5 max-w-[400px]">
            <div className="bg-amber-500 p-2.5 rounded-2xl shadow-lg shadow-amber-200">
              <ClockIcon className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-slate-900 font-black text-sm uppercase tracking-wider">Sesión expirada</h3>
              <p className="text-slate-500 text-sm font-medium">Tu sesión expiró después de 1 hora. Ingresa nuevamente.</p>
            </div>
            <button onClick={() => setShowExpired(false)} className="p-1.5 hover:bg-slate-100 rounded-xl transition-colors text-slate-400">
              <XMarkIcon className="h-5 w-5 stroke-[2.5px]" />
            </button>
          </div>
        </div>
      )}

      <LoginContainer />
    </div>
  );
};

export default LoginPage;