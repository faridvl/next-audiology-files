import React from 'react';
import Head from 'next/head';
import { RegisterForm } from '@/components/containers/register/register-form';

const RegisterPage = () => {

    return (
        <>
            <Head>
                <title>Registro </title>
            </Head>

            <main className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
                {/* Decoración de fondo */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-slate-800/50 rounded-full blur-[120px]" />

                <div className="relative z-10 w-full flex justify-center">
                    <RegisterForm />
                </div>
            </main>
        </>
    );
};

export default RegisterPage;