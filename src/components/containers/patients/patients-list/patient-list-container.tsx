import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Table } from '@/components/common/table/table';
import { Button, ButtonVariant } from '@/components/common/button/button';
import { usePatientList } from './use-patient-list';
import { AlertCircle, Edit2, Eye, FileSpreadsheet, Inbox, RefreshCw, Search, UserPlus } from 'lucide-react';
import { TEXT } from '@/static/texts/i18n';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { PatientStatusFilter } from '@/shared/api/querys/patients-query';
import { PatientImportModal } from '@/components/containers/patients/patient-import/patient-import-modal';

const STATUS_FILTER_OPTIONS: { value: PatientStatusFilter; label: string }[] = [
    { value: 'active', label: 'Activos' },
    { value: 'inactive', label: 'Inactivos' },
    { value: 'all', label: 'Todos' },
];

export const PatientListContainer: React.FC = () => {
    const { t } = useTranslation();
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const {
        patients,
        meta,
        searchTerm,
        statusFilter,
        page,
        hasActiveFilters,
        handleSearch,
        handleStatusFilter,
        handlePageChange,
        handleRetry,
        navigateToCreate,
        navigateToDetail,
        navigateToEdit,
        isLoading,
        isError,
    } = usePatientList();

    const formattedData = useMemo(() => {
        return patients.map(patient => ({
            ...patient,
            id: patient.uuid,
            fullName: `${patient.firstName} ${patient.lastName}`,
            documentIdDisplay: patient.documentId || '—',
            createdAtDisplay: new Date(patient.createdAt).toLocaleDateString('es-CR'),
            statusDisplay: patient.isActive === false ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-500">
                    {t(TEXT.PATIENTS.LIST.STATUS_INACTIVE)}
                </span>
            ) : null,
        }));
    }, [patients, t]);

    const columns = [
        { header: t(TEXT.PATIENTS.LIST.COLUMNS.PATIENT), accessor: 'fullName', width: '30%' },
        { header: t(TEXT.PATIENTS.LIST.COLUMNS.DOCUMENT_ID), accessor: 'documentIdDisplay', width: '18%' },
        { header: t(TEXT.PATIENTS.LIST.COLUMNS.PHONE), accessor: 'phone', width: '18%' },
        { header: t(TEXT.PATIENTS.LIST.COLUMNS.REGISTERED_AT), accessor: 'createdAtDisplay', width: '15%' },
        { header: t(TEXT.PATIENTS.LIST.COLUMNS_STATUS), accessor: 'statusDisplay', width: '12%' },
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
            onClick: (row: { uuid: string }) => navigateToEdit(row.uuid),
        },
    ];

    return (
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 space-y-6">
            <div className="flex justify-between items-center mt-6 md:mt-8">
                <Typography variant={TypographyVariant.HEADER} className="text-xl md:text-2xl font-bold text-neutral-800">
                    {t(TEXT.PATIENTS.LIST.TITLE)}
                </Typography>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsImportModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 border border-neutral-200 text-neutral-600 hover:border-primary/40 hover:text-primary bg-white rounded-app-sm text-sm font-bold transition-colors"
                    >
                        <FileSpreadsheet size={16} />
                        <span className="hidden md:inline">Importar pacientes</span>
                    </button>
                    <Button variant={ButtonVariant.PRIMARY} onClick={navigateToCreate}>
                        <UserPlus size={18} className="mr-0 md:mr-2" />
                        <Typography variant={TypographyVariant.BUTTON_TEXT} className="hidden md:inline">
                            {t(TEXT.PATIENTS.LIST.NEW_BUTTON)}
                        </Typography>
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-app-md shadow-sm border border-neutral-100 p-4 flex flex-col sm:flex-row gap-3">
                {/* Buscador */}
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                    <input
                        type="text"
                        placeholder={t(TEXT.PATIENTS.LIST.SEARCH_PLACEHOLDER)}
                        className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-100 rounded-app-sm text-sm outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/30 transition-all"
                        value={searchTerm}
                        onChange={(event) => handleSearch(event.target.value)}
                    />
                </div>

                {/* Filtro de estado */}
                <div className="flex gap-1 bg-neutral-50 border border-neutral-100 rounded-app-sm p-1 shrink-0">
                    {STATUS_FILTER_OPTIONS.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => handleStatusFilter(option.value)}
                            className={`px-3 py-1.5 rounded-sm text-xs font-bold transition-all ${
                                statusFilter === option.value
                                    ? 'bg-white text-primary shadow-sm border border-neutral-100'
                                    : 'text-neutral-500 hover:text-neutral-700'
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
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
                isError={isError}
                onRowClick={(row) => navigateToDetail(row.uuid)}
                errorState={
                    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-4">
                        <div className="w-12 h-12 rounded-app-md bg-red-50 flex items-center justify-center">
                            <AlertCircle size={22} className="text-red-400" />
                        </div>
                        <Typography variant={TypographyVariant.BODY_SEMIBOLD} className="text-neutral-700">
                            {t(TEXT.PATIENTS.LIST.ERROR.TITLE)}
                        </Typography>
                        <Typography variant={TypographyVariant.HELPER}>
                            {t(TEXT.PATIENTS.LIST.ERROR.DESCRIPTION)}
                        </Typography>
                        <button
                            onClick={() => handleRetry()}
                            className="flex items-center gap-2 mt-1 px-4 py-2 border border-neutral-200 text-neutral-600 hover:border-primary/40 hover:text-primary bg-white rounded-app-sm text-sm font-bold transition-colors"
                        >
                            <RefreshCw size={16} />
                            {t(TEXT.PATIENTS.LIST.ERROR.RETRY_BUTTON)}
                        </button>
                    </div>
                }
                emptyState={
                    hasActiveFilters ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-4">
                            <div className="w-12 h-12 rounded-app-md bg-neutral-50 flex items-center justify-center">
                                <Search size={22} className="text-neutral-300" />
                            </div>
                            <Typography variant={TypographyVariant.BODY_SEMIBOLD} className="text-neutral-700">
                                {t(TEXT.PATIENTS.LIST.EMPTY.NO_RESULTS_TITLE)}
                            </Typography>
                            <Typography variant={TypographyVariant.HELPER}>
                                {t(TEXT.PATIENTS.LIST.EMPTY.NO_RESULTS_DESCRIPTION)}
                            </Typography>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-4">
                            <div className="w-12 h-12 rounded-app-md bg-neutral-50 flex items-center justify-center">
                                <Inbox size={22} className="text-neutral-300" />
                            </div>
                            <Typography variant={TypographyVariant.BODY_SEMIBOLD} className="text-neutral-700">
                                {t(TEXT.PATIENTS.LIST.EMPTY.NO_PATIENTS_TITLE)}
                            </Typography>
                            <Typography variant={TypographyVariant.HELPER}>
                                {t(TEXT.PATIENTS.LIST.EMPTY.NO_PATIENTS_DESCRIPTION)}
                            </Typography>
                            <Button variant={ButtonVariant.PRIMARY} onClick={navigateToCreate} className="mt-1">
                                <UserPlus size={16} className="mr-2" />
                                {t(TEXT.PATIENTS.LIST.EMPTY.NEW_BUTTON)}
                            </Button>
                        </div>
                    )
                }
            />

            <PatientImportModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
            />
        </div>
    );
};
