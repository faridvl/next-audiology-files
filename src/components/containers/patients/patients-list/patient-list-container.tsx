import React, { useMemo } from 'react';
import { Table } from '@/components/common/table/table';
import { Input } from '@/components/common/input/input';
import { Button, ButtonVariant } from '@/components/common/button/button';
import { usePatientList } from './use-patient-list';
import { Edit2, Eye, Search, UserPlus } from 'lucide-react';

export const PatientListContainer: React.FC = () => {
    const {
        patients,
        meta,
        searchTerm,
        page,
        handleSearch,
        handlePageChange,
        navigateToCreate,
        navigateToDetail,
        isLoading
    } = usePatientList();

    const formattedData = useMemo(() => {
        return patients.map(p => ({
            ...p,
            id: p.uuid,
            fullName: `${p.firstName} ${p.lastName}`,
            createdAtDisplay: new Date(p.createdAt).toLocaleDateString()
        }));
    }, [patients]);

    const columns = [
        { header: 'Paciente', accessor: 'fullName', width: '40%' },
        { header: 'Teléfono', accessor: 'phone', width: '25%' },
        { header: 'Fecha Registro', accessor: 'createdAtDisplay', width: '20%' },
    ];

    const actions = [
        {
            name: 'Ver Ficha',
            onClick: (row: any) => navigateToDetail(row.uuid),
            icon: <Eye size={14} />,
        },
        {
            name: 'Editar',
            icon: <Edit2 size={14} />,
            onClick: (row: any) => console.log('Editar', row.uuid),
        },
    ];

    return (
        <div className="max-w-[1400px] mx-auto px-6 space-y-6">
            <div className="flex justify-between items-center mt-8">
                <h1 className="text-2xl font-bold text-slate-800">Pacientes</h1>
                <Button
                    variant={ButtonVariant.PRIMARY}
                    onClick={navigateToCreate}
                >
                    <UserPlus size={18} className="mr-2" />
                    Nuevo Paciente
                </Button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>
            </div>

            <Table
                columns={columns}
                data={formattedData}
                currentPage={page}
                totalRows={meta?.total || 0}
                itemsPerPage={meta?.limit || 10}
                onPageChange={handlePageChange}
                actions={actions}
                isLoading={isLoading}
                onRowClick={(row) => navigateToDetail(row.uuid)}
            />
        </div>
    );
};