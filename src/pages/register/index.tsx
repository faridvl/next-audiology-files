import React from 'react';
import Head from 'next/head';
import { RegisterForm } from '@/components/containers/register/register-form';

const RegisterPage = () => {

    return (
        <>
            <Head>
                <title>Registro </title>
            </Head>

            <main className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 sm:p-6">
                <div className="w-full flex justify-center">
                    <RegisterForm />
                </div>
            </main>
        </>
    );
};

export default RegisterPage;