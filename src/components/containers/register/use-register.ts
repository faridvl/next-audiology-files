import { useRegisterMutation } from '@/shared/api/mutations/auth/use-register-mutation';
import { RegisterPayload, BusinessType } from '@/types/auth/auth';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { routesPublic } from '@/shared/navigation/routes';

export type RegisterFormValues = {
  businessName: string;
  businessType: BusinessType;
  ownerName: string;
  phone: string;
  email: string;
  password: string;
  isSpecialist: boolean;
  specialty: string;
};

export const REGISTER_INITIAL_VALUES: RegisterFormValues = {
  businessName: '',
  businessType: BusinessType.GENERAL,
  ownerName: '',
  phone: '',
  email: '',
  password: '',
  isSpecialist: false,
  specialty: '',
};

export const useRegister = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const { executeRegister, isPending: isLoading, error } = useRegisterMutation();

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleAccountInfo = (values: RegisterFormValues) => {
    const payload: RegisterPayload = {
      businessName: values.businessName,
      businessType: values.businessType,
      ownerName: values.ownerName,
      email: values.email,
      password: values.password,
      isSpecialist: values.isSpecialist,
      ...(values.phone && { phone: values.phone }),
      ...(values.isSpecialist && values.specialty && { specialty: values.specialty }),
    };

    executeRegister(payload, {
      onSuccess: () => {
        router.push(`${routesPublic.login}?registered=true`);
      },
    });
  };

  return {
    step,
    nextStep,
    prevStep,
    handleAccountInfo,
    isLoading,
    error: error?.message || null,
  };
};
