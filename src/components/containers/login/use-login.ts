import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { routesPrivate } from '@/shared/navigation/routes';
import { CookiesManager } from '@/shared/utils/cookies-manager';
import { useLoginMutation } from '@/shared/api/mutations/auth/use-login-mutation';
import { FormActions, LoginCredentials } from '@/types/auth/auth';

export function useLogin() {
  const router = useRouter();
  const { executeLogin, isPending, error, reset } = useLoginMutation();

  useEffect(function clearSessionOnMount() {
    CookiesManager.clearAll();
  }, []);

  //TODO(!): MOVER 'FormActions'
  async function handleLoginSubmit(values: LoginCredentials, actions: FormActions) {
    executeLogin(values, {
      onSuccess: async (data) => {
        CookiesManager.setSession(data.access_token, data.user.name);
        await router.push(routesPrivate.dashboard);
      },
      onSettled: () => {
        actions.setSubmitting(false);
      },
    });
  }

  return {
    handleLoginSubmit,
    isLoading: isPending,
    error: error?.message || null,
    handleResetError: reset,
  };
}
