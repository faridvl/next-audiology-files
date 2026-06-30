import React, { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';
import { useNavigation } from '@/hooks/use-navigation';
import { usePatientDetailQuery } from '@/shared/api/querys/get-patient-query';
import { useCreateMedicalControlMutation } from '@/shared/api/mutations/medical-control-mutation/medical-control-mutation';
import { AudiometryCapture } from '@/components/containers/audiogram-capture/audiogram-capture';
import { MedicalSpeciality } from '@/types/medical-controls/medical-control.types';
import { ConsultaSessionStorage } from '@/shared/utils/consulta-session';
import { useSession } from '@/hooks/use-session';
import { UserSpecialty } from '@/types/auth/auth';
import { toast } from 'sonner';

interface Props {
  patientUuid: string;
}

const userSpecialtyToApiSpeciality: Record<UserSpecialty, MedicalSpeciality> = {
  [UserSpecialty.AUDIOLOGY]: MedicalSpeciality.AUDIOLOGY,
  [UserSpecialty.DENTAL]: MedicalSpeciality.DENTAL,
  [UserSpecialty.GENERAL]: MedicalSpeciality.GENERAL,
};

export const ConsultaAudiogramaContainer: React.FC<Props> = ({ patientUuid }) => {
  const navigation = useNavigation();
  const { user } = useSession();
  const { data: patient } = usePatientDetailQuery(patientUuid);
  const [audiogramData, setAudiogramData] = useState<{ OD: Record<number, string>; OI: Record<number, string> }>({ OD: {}, OI: {} });

  const apiSpeciality: MedicalSpeciality = user?.specialty
    ? userSpecialtyToApiSpeciality[user.specialty]
    : MedicalSpeciality.AUDIOLOGY;

  const { executeCreateControl, isPending } = useCreateMedicalControlMutation();

  function handleSave() {
    const hasData = Object.values(audiogramData.OD).some((v) => v !== '') || Object.values(audiogramData.OI).some((v) => v !== '');
    if (!hasData) {
      toast.error('Ingresa al menos un valor en el audiograma');
      return;
    }

    executeCreateControl(
      {
        header: { patientUUID: patientUuid, speciality: apiSpeciality, schemaVersion: 1 },
        clinicalData: {
          findings: { audiogram: audiogramData, type: 'audiogram-only' },
          diagnosis: 'Audiograma',
        },
        followUp: { hasFollowUp: false, tentativeDate: null },
      },
      {
        onSuccess: (data) => {
          const saved = data as { uuid: string };
          ConsultaSessionStorage.update(patientUuid, { savedAudiogram: true, savedControlUuid: saved.uuid });
          toast.success('Audiograma guardado');
          navigation.patients.consulta(patientUuid);
        },
        onError: () => toast.error('Error al guardar el audiograma. Intenta nuevamente.'),
      },
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 pb-24 space-y-6 animate-in fade-in duration-500">

      {/* HEADER */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigation.patients.consulta(patientUuid)}
          className="w-10 h-10 rounded-app-sm bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors shrink-0"
        >
          <ArrowLeft size={16} className="text-neutral-500" />
        </button>
        <div>
          <Typography variant={TypographyVariant.CAPTION} className="text-[9px] font-black uppercase tracking-widest text-accent">
            Audiograma
          </Typography>
          <Typography variant={TypographyVariant.SUBTITLE} className="text-neutral-800 leading-tight">
            {patient ? `${patient.firstName} ${patient.lastName}` : '…'}
          </Typography>
        </div>
      </div>

      <div className="bg-white border border-neutral-100 rounded-app-md p-5 md:p-8 shadow-sm">
        <AudiometryCapture onChange={setAudiogramData} />
      </div>

      <div className="flex justify-end gap-3">
        <Button variant={ButtonVariant.CANCEL} onClick={() => navigation.patients.consulta(patientUuid)} text="Cancelar" />
        <Button
          variant={ButtonVariant.PRIMARY}
          className="!h-12 !px-10 !rounded-app-sm shadow-lg shadow-accent/20"
          onClick={handleSave}
          disabled={isPending}
        >
          <Save size={16} className="mr-2" />
          {isPending ? 'Guardando...' : 'Guardar audiograma'}
        </Button>
      </div>
    </div>
  );
};
