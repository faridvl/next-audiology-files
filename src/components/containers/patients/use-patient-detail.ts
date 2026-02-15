import { useState, useEffect } from 'react';

export function usePatientDetail(id: string) {
  const [patient, setPatient] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulamos el rol del usuario (esto vendría de un AuthContext)
  const userRole = 'admin';

  useEffect(() => {
    if (!id) return;

    const fetchFullData = async () => {
      setIsLoading(true);
      // Simulación de API
      await new Promise((r) => setTimeout(r, 1000));

      setPatient({
        id,
        name: 'Andrés Iniesta',
        email: 'a.iniesta@vissel.jp',
        phone: '+506 8888-8888',
        dob: '1984-05-11',
        idNumber: '1-1111-1111',
        gender: 'male',
        employment: 'Deportista de alto rendimiento',
      });

      setHistory([
        {
          id: 1,
          date: '2026-02-10',
          type: 'Audiología',
          note: 'Prueba de audición completa. Resultados estables.',
          specialist: 'Dr. House',
        },
        {
          id: 2,
          date: '2026-01-15',
          type: 'Odontología',
          note: 'Limpieza semestral y revisión de cordales.',
          specialist: 'Dra. Smile',
        },
        {
          id: 3,
          date: '2025-12-20',
          type: 'Control de Piel',
          note: 'Revisión de lunares en espalda. Sin cambios.',
          specialist: 'Dr. Derm',
        },
      ]);

      setIsLoading(false);
    };

    fetchFullData();
  }, [id]);

  const canEdit = userRole === 'admin' || userRole === 'specialist';

  return { patient, history, isLoading, canEdit };
}
