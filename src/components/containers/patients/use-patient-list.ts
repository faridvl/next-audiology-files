import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { routesPrivate } from '@/shared/navigation/routes';

export type Patient = {
  id: number | string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive' | 'Pending';
};

export function usePatientList() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const mockData: Patient[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Inactive' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor', status: 'Active' },
    { id: 4, name: 'Alice Williams', email: 'alice@example.com', role: 'User', status: 'Pending' },
    { id: 5, name: 'Tom Davis', email: 'tom@example.com', role: 'Admin', status: 'Active' },
    { id: 6, name: 'Sara Lee', email: 'sara@example.com', role: 'User', status: 'Inactive' },
    { id: 7, name: 'Mike Brown', email: 'mike@example.com', role: 'Editor', status: 'Active' },
    { id: 8, name: 'Emily Wilson', email: 'emily@example.com', role: 'User', status: 'Pending' },
    { id: 9, name: 'David Anderson', email: 'david@example.com', role: 'Admin', status: 'Active' },
    {
      id: 10,
      name: 'Olivia Taylor',
      email: 'olivia@example.com',
      role: 'User',
      status: 'Inactive',
    },
  ];

  useEffect(() => {
    const fetchPatients = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800)); // Delay artificial
      setPatients(mockData);
      setIsLoading(false);
    };

    fetchPatients();
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    // Aquí podrías filtrar localmente o disparar una nueva petición
  };

  const navigateToCreate = () => {
    router.push(routesPrivate.patients.create);
  };

  const navigateToDetail = (id: string | number) => {
    router.push(`${routesPrivate.patients.index}/${id}`);
  };

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return {
    patients: filteredPatients,
    searchTerm,
    isLoading,
    handleSearch,
    navigateToCreate,
    navigateToDetail,
  };
}
