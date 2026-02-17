import React from 'react';
import { useLogin } from './use-login';
import { LoginForm } from './login-form';

export const LoginContainer: React.FC = () => {
    const { handleLoginSubmit, isLoading, error } = useLogin();

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6">
            <LoginForm
                onSubmit={handleLoginSubmit}
                isLoading={isLoading}
                externalError={error}
            />
        </div>
    );
};