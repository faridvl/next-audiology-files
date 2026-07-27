import { useEffect, useRef, useState } from 'react';
import {
  EncounterStatus,
  useEncounterDetailQuery,
  useEncountersByPatientQuery,
} from '@/shared/api/querys/encounters-query';
import { useCreateEncounterMutation } from '@/shared/api/mutations/encounters/create-encounter-mutation';
import { useQueryClient } from '@tanstack/react-query';
import { FETCH_ENCOUNTERS_BY_PATIENT_KEY } from '@/shared/api/querys/encounters-query';

// Reemplaza ConsultaSessionStorage (sessionStorage) — el encuentro abierto vive
// en la base de datos, no se pierde al cerrar la pestaña (DOMAIN_ANALYSIS.md §2.3, §4.1).
export function useActiveEncounter(patientUuid: string, especialidad: string) {
  const queryClient = useQueryClient();
  const { data: encounters, isLoading: isLoadingEncounters } = useEncountersByPatientQuery(patientUuid);
  const { executeCreateEncounter, isPending: isCreatingEncounter } = useCreateEncounterMutation();
  const [encounterUuid, setEncounterUuid] = useState<string | null>(null);
  const hasAttemptedCreate = useRef(false);

  useEffect(() => {
    if (!encounters || isLoadingEncounters) return;
    if (encounterUuid) return;

    const openEncounter = encounters.find((encounter) => encounter.status === EncounterStatus.OPEN);
    if (openEncounter) {
      setEncounterUuid(openEncounter.uuid);
      return;
    }

    if (hasAttemptedCreate.current) return;
    hasAttemptedCreate.current = true;

    executeCreateEncounter(
      { patientUuid, especialidad },
      {
        onSuccess: (data) => {
          const created = data as { uuid: string };
          setEncounterUuid(created.uuid);
          queryClient.invalidateQueries({ queryKey: [FETCH_ENCOUNTERS_BY_PATIENT_KEY, patientUuid] });
        },
      },
    );
  }, [encounters, isLoadingEncounters, encounterUuid, executeCreateEncounter, patientUuid, especialidad, queryClient]);

  const { data: encounterDetail, isLoading: isLoadingDetail } = useEncounterDetailQuery(encounterUuid);

  return {
    encounterUuid,
    encounterDetail,
    isLoading: isLoadingEncounters || isCreatingEncounter || (!!encounterUuid && isLoadingDetail),
  };
}
