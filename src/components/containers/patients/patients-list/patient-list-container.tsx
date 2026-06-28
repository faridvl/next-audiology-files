import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Table } from '@/components/common/table/table';
import { Button, ButtonVariant } from '@/components/common/button/button';
import { usePatientList } from './use-patient-list';
import { Edit2, Eye, Search, UserPlus } from 'lucide-react';
import { TEXT } from '@/static/texts/i18n';

export const PatientListContainer: React.FC = () => {
    const { t } = useTranslation();
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
        return patients.map(patient => ({
            ...patient,
            id: patient.uuid,
            fullName: `${patient.firstName} ${patient.lastName}`,
            createdAtDisplay: new Date(patient.createdAt).toLocaleDateString()
        }));
    }, [patients]);

    const columns = [
        { header: t(TEXT.PATIENTS.LIST.COLUMNS.PATIENT), accessor: 'fullName', width: '40%' },
        { header: t(TEXT.PATIENTS.LIST.COLUMNS.PHONE), accessor: 'phone', width: '25%' },
        { header: t(TEXT.PATIENTS.LIST.COLUMNS.REGISTERED_AT), accessor: 'createdAtDisplay', width: '20%' },
    ];

    const actions = [
        {
            name: t(TEXT.PATIENTS.LIST.ACTIONS.VIEW_FILE),
            onClick: (row: { uuid: string }) => navigateToDetail(row.uuid),
            icon: <Eye size={14} />,
        },
        {
            name: t(TEXT.PATIENTS.LIST.ACTIONS.EDIT),
            icon: <Edit2 size={14} />,
            // TODO(!): Conectar a PATCH /patients/:uuid cuando el endpoint esté disponible
            onClick: (_row: { uuid: string }) => undefined,
        },
    ];

    return (
        <div className="max-w-[1400px] mx-auto px-6 space-y-6">
            <div className="flex justify-between items-center mt-8">
                <h1 className="text-2xl font-bold text-slate-800">{t(TEXT.PATIENTS.LIST.TITLE)}</h1>
                <Button
                    variant={ButtonVariant.PRIMARY}
                    onClick={navigateToCreate}
                >
                    <UserPlus size={18} className="mr-2" />
                    {t(TEXT.PATIENTS.LIST.NEW_BUTTON)}
                </Button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder={t(TEXT.PATIENTS.LIST.SEARCH_PLACEHOLDER)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                        value={searchTerm}
                        onChange={(event) => handleSearch(event.target.value)}
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
