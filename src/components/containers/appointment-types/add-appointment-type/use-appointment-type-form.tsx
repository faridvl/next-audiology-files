import * as Yup from 'yup';
import { useState } from 'react';

export enum Speciality {
    AUDIOLOGY = 'AUDIOLOGY',
    DENTAL = 'DENTAL',
    GENERAL = 'GENERAL'
}

export enum RecordTemplate {
    STANDARD = 'STANDARD',   // Notas de texto
    GRAPHIC = 'GRAPHIC',     // Gráficos/Diagramas
    PROCEDURE = 'PROCEDURE', // Checklists
}

export type AppointmentTypeFormValues = {
    name: string;
    duration: number;
    price: string;
    speciality: Speciality | '';
    recordTemplate: RecordTemplate;
    color: string;
    description: string;
};

export function useAppointmentTypeForm(onSuccess?: () => void) {
    const [isLoading, setIsLoading] = useState(false);

    const initialValues: AppointmentTypeFormValues = {
        name: '',
        duration: 30,
        price: '',
        speciality: '',
        recordTemplate: RecordTemplate.STANDARD,
        color: '#3B82F6',
        description: '',
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('El nombre del servicio es requerido'),
        duration: Yup.number().min(5, 'Mínimo 5 min').required('Requerido'),
        price: Yup.string().required('El precio es requerido'),
        speciality: Yup.string().required('Seleccione una especialidad'),
        recordTemplate: Yup.string().required('Seleccione un tipo de registro'),
        color: Yup.string().required(),
    });

    const handleSubmit = async (values: AppointmentTypeFormValues) => {
        setIsLoading(true);
        try {
            console.log('Enviando nuevo tipo de cita:', values);
            await new Promise(resolve => setTimeout(resolve, 1000));
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return { initialValues, validationSchema, handleSubmit, isLoading };
}