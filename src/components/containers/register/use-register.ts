import { useRegisterMutation } from '@/shared/api/mutations/auth/use-register-mutation';
import { useState } from 'react';

export const useRegister = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any | null>(null);

  const { executeRegister, isPending: isLoading, error } = useRegisterMutation();

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleAccountInfo = (values: any) => {
    executeRegister(values, {
      onSuccess: (data) => {
        setFormData(data);
        nextStep();
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
    formData,
  };
};
