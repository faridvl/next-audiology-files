import React from 'react';
import { Table } from '@/components/common/table/table';
import { Input } from '@/components/common/input/input';
import { Button, ButtonVariant } from '@/components/common/button/button';
import { Patient, usePatientList } from './use-patient-list';

export const PatientListContainer: React.FC = () => {
    const {
        patients,
        searchTerm,
        handleSearch,
        navigateToCreate,
        navigateToDetail,
        isLoading
    } = usePatientList();

    const columns = [
        { header: 'Nombre', accessor: 'name', width: '40%' },
        { header: 'Correo', accessor: 'email', width: '30%' },
        { header: 'Role', accessor: 'role', width: '15%' },
        { header: 'Estado', accessor: 'status', width: '15%' },
    ];

    const actions = [
        {
            name: 'Ver',
            onClick: (row: Patient) => navigateToDetail(row.id),
        },
        {
            name: 'Editar',
            onClick: (row: Patient) => console.log('Editar', row),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="w-full md:w-96">
                        <Input
                            variant="primary"
                            type="text"
                            placeholder="Buscar por nombre o correo..."
                            value={searchTerm}
                            onChange={(e: any) => handleSearch(e.target.value)}
                        />
                    </div>
                    <Button
                        variant={ButtonVariant.PRIMARY}
                        text="Nuevo Paciente"
                        onClick={navigateToCreate}
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {isLoading ? (
                    <div className="p-20 text-center text-slate-400">Cargando pacientes...</div>
                ) : (
                    <Table
                        columns={columns}
                        data={patients}
                        currentPage={1}
                        totalRows={patients.length}
                        actions={actions}
                        onRowClick={(row) => navigateToDetail(row.id)}
                    />
                )}
            </div>
        </div>
    );
};