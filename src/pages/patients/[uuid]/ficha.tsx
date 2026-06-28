import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Printer, ArrowLeft } from 'lucide-react';
import { authorizeServerSidePage } from '@/hocs/auth';
import { usePatientDetailQuery } from '@/shared/api/querys/get-patient-query';
import { useMedicalControlsQuery } from '@/shared/api/querys/medical-controls-query';
import { useAppointmentByPatientQuery } from '@/shared/api/querys/get-appoinment-by-patient-query';
import { useNavigation } from '@/hooks/use-navigation';
import { MedicalSpeciality } from '@/types/medical-controls/medical-control.types';

const specialityLabels: Record<string, string> = {
  [MedicalSpeciality.AUDIOLOGY]: 'Audiología',
  [MedicalSpeciality.DENTAL]: 'Odontología',
  [MedicalSpeciality.GENERAL]: 'Medicina General',
};

const FichaPage: React.FC = () => {
  const router = useRouter();
  const { uuid } = router.query;
  const navigation = useNavigation();

  const patientUuid = uuid as string;

  const { data: patient, isLoading: isLoadingPatient } = usePatientDetailQuery(patientUuid);
  const { data: controlsData, isLoading: isLoadingControls } = useMedicalControlsQuery(patientUuid, 1, 50);
  const { data: appointmentsData, isLoading: isLoadingAppointments } = useAppointmentByPatientQuery(patientUuid);

  const isLoading = isLoadingPatient || isLoadingControls || isLoadingAppointments;

  const controls = controlsData?.data ?? [];
  const appointments = appointmentsData?.appointments ?? [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">
          Cargando ficha del paciente...
        </p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
          No se encontró el paciente.
        </p>
      </div>
    );
  }

  const patientFullName = `${patient.firstName} ${patient.lastName}`.toUpperCase();
  const patientIdShort = patient.uuid.split('-')[0].toUpperCase();

  return (
    <>
      <Head>
        <title>Ficha Técnica — {patient.firstName} {patient.lastName}</title>
      </Head>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
        }
      `}</style>

      {/* BARRA DE ACCIONES (solo en pantalla) */}
      <div className="no-print fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm">
        <button
          onClick={() => navigation.patients.detail(patientUuid)}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-xs uppercase tracking-widest transition-all"
        >
          <ArrowLeft size={14} /> Volver al expediente
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all"
        >
          <Printer size={14} /> Imprimir ficha
        </button>
      </div>

      {/* CONTENIDO DE LA FICHA */}
      <div className="pt-20 pb-12 px-6 max-w-4xl mx-auto no-print-padding">

        {/* ENCABEZADO */}
        <div className="border-b-4 border-slate-900 pb-6 mb-8 flex justify-between items-end">
          <div>
            <p className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
              Ficha Técnica del Paciente
            </p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">
              Sistema de Gestión de Expedientes Digitales — Zynka
            </p>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Fecha de emisión: {new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
          </p>
        </div>

        {/* SECCIÓN 1: DATOS DEL PACIENTE */}
        <section className="mb-10">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 border-b border-slate-100 pb-2">
            1. Datos del Paciente
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <DataField label="Nombre completo" value={patientFullName} />
            <DataField label="Identificador" value={patientIdShort} />
            <DataField label="Teléfono" value={patient.phone || '—'} />
            <DataField label="Correo electrónico" value={patient.email || '—'} />
            <DataField label="Dirección" value={patient.address || '—'} />
            <DataField
              label="Fecha de nacimiento"
              value={
                patient.birthDate
                  ? new Date(patient.birthDate).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })
                  : '—'
              }
            />
          </div>
        </section>

        {/* SECCIÓN 2: HISTORIAL DE CONTROLES */}
        <section className="mb-10">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 border-b border-slate-100 pb-2">
            2. Historial de Controles Médicos
          </h2>
          {controls.length === 0 ? (
            <p className="text-xs text-slate-400 italic">Sin controles registrados.</p>
          ) : (
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left p-3 text-[9px] font-black uppercase tracking-widest text-slate-500 border border-slate-200">Fecha</th>
                  <th className="text-left p-3 text-[9px] font-black uppercase tracking-widest text-slate-500 border border-slate-200">Especialidad</th>
                  <th className="text-left p-3 text-[9px] font-black uppercase tracking-widest text-slate-500 border border-slate-200">Diagnóstico</th>
                </tr>
              </thead>
              <tbody>
                {controls.map((control) => (
                  <tr key={control.uuid} className="hover:bg-slate-50">
                    <td className="p-3 border border-slate-200 text-slate-700 font-medium whitespace-nowrap">
                      {new Date(control.createdAt).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="p-3 border border-slate-200 text-slate-700 font-medium">
                      {specialityLabels[control.header.speciality] ?? control.header.speciality}
                    </td>
                    <td className="p-3 border border-slate-200 text-slate-600">
                      {control.clinicalData.diagnosis || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* SECCIÓN 3: CITAS */}
        <section className="mb-10">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 border-b border-slate-100 pb-2">
            3. Historial de Citas
          </h2>
          {appointments.length === 0 ? (
            <p className="text-xs text-slate-400 italic">Sin citas registradas.</p>
          ) : (
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left p-3 text-[9px] font-black uppercase tracking-widest text-slate-500 border border-slate-200">Fecha</th>
                  <th className="text-left p-3 text-[9px] font-black uppercase tracking-widest text-slate-500 border border-slate-200">Notas</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment: { id: string; schedule: { date: string }; notes: string }) => (
                  <tr key={appointment.id} className="hover:bg-slate-50">
                    <td className="p-3 border border-slate-200 text-slate-700 font-medium whitespace-nowrap">
                      {appointment.schedule?.date
                        ? new Date(appointment.schedule.date).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })
                        : '—'}
                    </td>
                    <td className="p-3 border border-slate-200 text-slate-600">
                      {appointment.notes || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* PIE */}
        <div className="border-t border-slate-200 pt-6 text-center text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">
          Documento confidencial — Propiedad privada del paciente — Ley de Protección de Datos
        </div>
      </div>
    </>
  );
};

const DataField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="bg-slate-50 rounded-xl p-4">
    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-xs font-bold text-slate-800">{value}</p>
  </div>
);

export const getServerSideProps = authorizeServerSidePage();

export default FichaPage;
