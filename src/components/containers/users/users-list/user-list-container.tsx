import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Search, Info, UserPlus, Mail, CheckCircle2,
    XCircle, Edit, Trash2
} from 'lucide-react';

import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';
import { Table } from '@/components/common/table/table';
import { Action } from '@/components/common/menu-item/menu-item';

import { useNavigation } from '@/hooks/use-navigation';
import { tailwind } from '@/utils/tailwind-utils';
import { useUsersContainer, ROLES_FILTER } from './use-user-list';
import { TEXT } from '@/static/texts/i18n';

interface InfoTooltipProps {
    title: string;
    description: string;
}

/**
 * Componente local para mostrar información de seguridad al hacer hover
 */
export function InfoTooltip({ title, description }: InfoTooltipProps) {
    const [show, setShow] = useState(false);

    return (
        <div className="relative inline-block">
            <button
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
                className="p-1.5 text-blue-500 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
            >
                <Info size={16} />
            </button>
            {show && (
                <div className="absolute left-8 top-0 w-64 p-3 bg-slate-900 text-white text-[10px] rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in duration-200 border border-slate-700">
                    <p className="font-bold mb-1 border-b border-slate-700 pb-1 text-blue-400 uppercase tracking-tight">
                        {title}
                    </p>
                    <p className="text-slate-300 leading-relaxed">
                        {description}
                    </p>
                </div>
            )}
        </div>
    );
}

export function UsersContainer() {
    const { t } = useTranslation();
    const nav = useNavigation();

    const {
        users,
        meta,
        isLoading,
        searchTerm,
        activeRole,
        page,
        columns,
        handleSearch,
        handleRoleChange,
        handlePageChange
    } = useUsersContainer();

    // Formateamos los datos para que incluyan el JSX antes de pasar a la Tabla
    const formattedData = useMemo(() => {
        return users.map((user: any) => ({
            ...user,
            id: user.uuid,
            userDisplay: (
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs uppercase shadow-sm">
                        {user.fullName ? user.fullName.charAt(0) : 'U'}
                    </div>
                    <div className="flex flex-col">
                        <Typography variant={TypographyVariant.BODY_BOLD} className="text-sm leading-tight text-slate-700">
                            {user.fullName}
                        </Typography>
                        <div className="flex items-center gap-1 text-slate-400 text-[10px] mt-0.5">
                            <Mail size={10} /> {user.email}
                        </div>
                    </div>
                </div>
            ),
            roleDisplay: (
                <div className="flex flex-col gap-1">
                    <span className={tailwind(
                        "text-[9px] font-black uppercase w-fit px-2 py-0.5 rounded-md",
                        user.role === 'ADMIN' ? 'bg-purple-50 text-purple-600' :
                            user.role === 'DOCTOR' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                    )}>
                        {user.role}
                    </span>
                    <Typography variant={TypographyVariant.CAPTION} className="text-slate-500 italic">
                        {user.specialty || 'General'}
                    </Typography>
                </div>
            ),
            statusDisplay: (
                <div className={tailwind(
                    "flex items-center gap-1.5 text-[11px] font-bold",
                    user.status === 'ACTIVE' ? 'text-emerald-500' : 'text-slate-300'
                )}>
                    {user.status === 'ACTIVE' ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                    {user.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                </div>
            )
        }));
    }, [users]);

    const tableActions: Action[] = [
        {
            name: 'Editar Usuario',
            icon: <Edit size={14} />,
            onClick: (row) => nav.users.edit(row.uuid)
        },
        {
            name: 'Eliminar',
            icon: <Trash2 size={14} />,
            onClick: (row) => console.log('Eliminar:', row.uuid)
        },
    ];

    return (
        <div className="max-w-[1400px] mx-auto px-6 pb-20">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                    <Typography variant={TypographyVariant.SUBTITLE}>
                        {t(TEXT.USERS.CREATE.LAYOUT_TITLE)}
                    </Typography>
                    <InfoTooltip
                        title="Seguridad de Acceso"
                        description={t(TEXT.USERS.CREATE.DESCRIPTION)}
                    />
                </div>

                <Button variant={ButtonVariant.PRIMARY} onClick={() => nav.users.create()}>
                    <UserPlus size={18} className="mr-2" />
                    {t(TEXT.USERS.CREATE.FORM.SUBMIT)}
                </Button>
            </div>

            {/* Filtros */}
            <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap gap-4 items-center mb-6">
                <div className="relative flex-1 min-w-[300px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder={t(TEXT.USERS.CREATE.FORM.FULL_NAME_PLACEHOLDER)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>

                <div className="flex gap-1 bg-slate-50 p-1 rounded-xl">
                    {ROLES_FILTER.map(role => (
                        <button
                            key={role}
                            onClick={() => handleRoleChange(role)}
                            className={tailwind(
                                "px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all",
                                activeRole === role ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                            )}
                        >
                            {role}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tabla */}
            <Table
                columns={columns}
                data={formattedData}
                currentPage={page}
                totalRows={meta?.total || 0}
                itemsPerPage={meta?.limit || 10}
                actions={tableActions}
                isLoading={isLoading}
                onPageChange={handlePageChange}
                onRowClick={(row) => nav.users.detail(row.uuid)}
            />
        </div>
    );
}