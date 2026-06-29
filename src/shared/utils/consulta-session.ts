export interface ConsultaSession {
  patientUuid: string;
  startedAt: string;
  savedControlUuid: string | null;
  savedMaintenanceUuid: string | null;
  savedAudiogram: boolean;
}

function key(patientUuid: string) {
  return `consulta-${patientUuid}`;
}

export const ConsultaSessionStorage = {
  init(patientUuid: string): ConsultaSession {
    const existing = ConsultaSessionStorage.get(patientUuid);
    if (existing) return existing;
    const session: ConsultaSession = {
      patientUuid,
      startedAt: new Date().toISOString(),
      savedControlUuid: null,
      savedMaintenanceUuid: null,
      savedAudiogram: false,
    };
    sessionStorage.setItem(key(patientUuid), JSON.stringify(session));
    return session;
  },

  get(patientUuid: string): ConsultaSession | null {
    const raw = sessionStorage.getItem(key(patientUuid));
    if (!raw) return null;
    try {
      return JSON.parse(raw) as ConsultaSession;
    } catch {
      return null;
    }
  },

  update(patientUuid: string, patch: Partial<ConsultaSession>) {
    const current = ConsultaSessionStorage.get(patientUuid) ?? ConsultaSessionStorage.init(patientUuid);
    sessionStorage.setItem(key(patientUuid), JSON.stringify({ ...current, ...patch }));
  },

  clear(patientUuid: string) {
    sessionStorage.removeItem(key(patientUuid));
  },
};
