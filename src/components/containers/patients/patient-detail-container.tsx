import React from 'react';
import { PencilSquareIcon, PlusIcon } from '@heroicons/react/24/outline';
import { usePatientDetail } from './use-patient-detail';
import { Button, ButtonVariant } from '@/components/common/button/button';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { useNavigation } from '@/hooks/use-navigation';
import { ClinicalControl, ControlType } from '@/types/otros/clinical';
// Importamos los types que acabas de agregar

export const PatientDetailContainer = ({ id }: { id: string }) => {
    const navigation = useNavigation();

    // TODO(Farid): Asegúrate que usePatientDetail devuelva history: ClinicalControl[]
    const { patient, history, isLoading, canEdit } = usePatientDetail(id);

    if (isLoading) {
        return (
            <div className="p-10 text-center">
                <Typography variant={TypographyVariant.BODY_SEMIBOLD}>
                    Cargando expediente...
                </Typography>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4">
            {/* Columna Izquierda: Info Personal */}
            <div className="lg:col-span-4 space-y-6">
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 relative overflow-hidden">
                    {canEdit && (
                        <button
                            // TODO(Farid): Agregar navigateToEditPatient en useNavigation
                            onClick={() => console.log('Navegar a edición')}
                            className="absolute top-6 right-6 p-2 hover:bg-blue-50 text-blue-600 rounded-full transition-colors"
                        >
                            <PencilSquareIcon className="h-6 w-6" />
                        </button>
                    )}
                    <div className="flex flex-col items-center mb-6">
                        <div className="h-24 w-24 bg-blue-600 rounded-3xl flex items-center justify-center text-white text-3xl font-black mb-4 shadow-lg shadow-blue-100">
                            {patient.name.charAt(0)}
                        </div>
                        <Typography variant={TypographyVariant.HEADER} className="text-slate-800">
                            {patient.name}
                        </Typography>
                        <Typography variant={TypographyVariant.CAPTION} className="text-slate-400 font-bold">
                            {patient.idNumber}
                        </Typography>
                    </div>

                    <div className="space-y-4 border-t border-slate-50 pt-6">
                        <DetailItem label="Email" value={patient.email} />
                        <DetailItem label="Teléfono" value={patient.phone} />
                        <DetailItem label="F. Nacimiento" value={patient.dob} />
                        <DetailItem label="Ocupación" value={patient.employment} />
                    </div>
                </div>
            </div>

            {/* Columna Derecha: Historial */}
            <div className="lg:col-span-8 space-y-6">
                <div className="flex justify-between items-center">
                    <Typography variant={TypographyVariant.HEADER} className="text-slate-800">
                        Historial Médico
                    </Typography>

                    <Button
                        variant={ButtonVariant.PRIMARY}
                        className="bg-slate-900 shadow-slate-200 hover:bg-blue-600"
                        // Navegación usando el ID dinámico
                        onClick={() => navigation.patients.addControl(id)}
                    >
                        <PlusIcon className="h-5 w-5 stroke-[3px]" />
                        <Typography variant={TypographyVariant.BODY_BOLD} className="text-white">
                            Nuevo Control
                        </Typography>
                    </Button>
                </div>

                <div className="grid gap-4">
                    {/* Tipamos explícitamente el record para tener autocompletado */}
                    {history.map((record: ClinicalControl) => (
                        <div
                            key={record.id}
                            className="bg-white p-6 rounded-[2rem] border border-slate-100 hover:border-blue-200 transition-all group shadow-sm cursor-pointer"
                            // TODO(Farid): Agregar navigateToControlDetail en useNavigation
                            onClick={() => console.log('Navegar al detalle del control:', record.id)}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${getTypeStyle(record.type)}`}>
                                    {record.type}
                                </span>
                                <Typography variant={TypographyVariant.OVERLINE} className="text-slate-400">
                                    {record.date}
                                </Typography>
                            </div>

                            {/* Usamos record.note del interface ClinicalControl */}
                            <Typography variant={TypographyVariant.BODY_SEMIBOLD} className="text-slate-700 mb-2">
                                {record.note}
                            </Typography>

                            <div className="flex items-center gap-1">
                                <Typography variant={TypographyVariant.CAPTION} className="text-slate-400 uppercase font-black">
                                    Atendido por:
                                </Typography>
                                <Typography variant={TypographyVariant.CAPTION} className="text-blue-600 font-black">
                                    {record.specialistName}
                                </Typography>
                            </div>
                        </div>
                    ))}

                    {history.length === 0 && (
                        <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                            <Typography variant={TypographyVariant.HELPER}>
                                No hay registros médicos previos para este paciente.
                            </Typography>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const DetailItem = ({ label, value }: { label: string, value: string }) => (
    <div>
        <Typography variant={TypographyVariant.OVERLINE} className="text-slate-400">
            {label}
        </Typography>
        <Typography variant={TypographyVariant.BODY_BOLD} className="text-slate-700">
            {value}
        </Typography>
    </div>
);

// Función de estilos usando el ControlType Enum
const getTypeStyle = (type: ControlType) => {
    switch (type) {
        case ControlType.AUDIOLOGY: return 'bg-purple-50 text-purple-600';
        case ControlType.DENTAL: return 'bg-blue-50 text-blue-600';
        case ControlType.DERMATOLOGY: return 'bg-emerald-50 text-emerald-600';
        default: return 'bg-slate-50 text-slate-600';
    }
};