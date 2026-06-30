import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { LoginContainer } from '@/components/containers/login/login-container';
import { SuccessAlert } from '@/components/common/alerts/success-alert';
import { ClockIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { TEXT } from '@/static/texts/i18n';

const LoginPage = () => {
  const { t } = useTranslation();
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
    <div className="relative min-h-screen bg-neutral-50">
      <Head>
        <title>Login </title>
      </Head>

      {showSuccess && (
        <div className="fixed top-6 right-6 z-[9999]">
          <SuccessAlert
            onClose={() => setShowSuccess(false)}
            title={t(TEXT.LOGIN.REGISTERED.TITLE)}
            message={t(TEXT.LOGIN.REGISTERED.MESSAGE)}
          />
        </div>
      )}

      {showExpired && (
        <div className="fixed top-6 right-6 z-[9999] animate-slide-in">
          <div className="bg-white/80 backdrop-blur-xl border border-warning/20 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-3xl p-5 flex items-center gap-5 max-w-[400px]">
            <div className="bg-warning p-2.5 rounded-2xl shadow-lg shadow-warning/20">
              <ClockIcon className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-neutral-900 font-black text-sm uppercase tracking-wider">{t(TEXT.LOGIN.EXPIRED.TITLE)}</h3>
              <p className="text-neutral-500 text-sm font-medium">{t(TEXT.LOGIN.EXPIRED.MESSAGE)}</p>
            </div>
            <button onClick={() => setShowExpired(false)} className="p-1.5 hover:bg-neutral-100 rounded-xl transition-colors text-neutral-400">
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