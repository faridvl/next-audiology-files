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
import { User } from '@/types/users/user.type';
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
                className="p-1.5 text-primary bg-primary-soft rounded-full hover:bg-primary-soft/70 transition-colors"
            >
                <Info size={16} />
            </button>
            {show && (
                <div className="absolute left-8 top-0 w-64 p-3 bg-neutral-900 text-white text-[10px] rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in duration-200 border border-neutral-700">
                    <Typography variant={TypographyVariant.OVERLINE} className="font-bold mb-1 border-b border-neutral-700 pb-1 text-primary-light block">
                        {title}
                    </Typography>
                    <Typography variant={TypographyVariant.CAPTION} className="text-neutral-300 leading-relaxed">
                        {description}
                    </Typography>
                </div>
            )}
        </div>
    );
}

export function UsersContainer() {
    const { t } = useTranslation();
    const navigation = useNavigation();

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
        handlePageChange,
        handleDeleteUser,
    } = useUsersContainer();

    // Formateamos los datos para que incluyan el JSX antes de pasar a la Tabla
    const formattedData = useMemo(() => {
        return users.map((user: User) => ({
            ...user,
            id: user.uuid,
            userDisplay: (
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-primary-soft flex items-center justify-center text-primary font-bold text-xs uppercase shadow-sm">
                        {user.fullName ? user.fullName.charAt(0) : 'U'}
                    </div>
                    <div className="flex flex-col">
                        <Typography variant={TypographyVariant.BODY_BOLD} className="text-sm leading-tight text-neutral-700">
                            {user.fullName}
                        </Typography>
                        <div className="flex items-center gap-1 mt-0.5">
                            <Mail size={10} className="text-neutral-400" />
                            <Typography variant={TypographyVariant.CAPTION} className="text-neutral-400">{user.email}</Typography>
                        </div>
                    </div>
                </div>
            ),
            roleDisplay: (
                <div className="flex flex-col gap-1">
                    <span className={tailwind(
                        "text-[9px] font-black uppercase w-fit px-2 py-0.5 rounded-md",
                        user.role === 'ADMIN' ? 'bg-accent/10 text-accent' :
                            user.role === 'DOCTOR' ? 'bg-primary-soft text-primary' : 'bg-warning/10 text-warning'
                    )}>
                        {user.role}
                    </span>
                    <Typography variant={TypographyVariant.CAPTION} className="text-neutral-500 italic">
                        {user.specialty || 'General'}
                    </Typography>
                </div>
            ),
            statusDisplay: (
                <div className={tailwind(
                    "flex items-center gap-1.5 text-[11px] font-bold",
                    user.status === 'ACTIVE' ? 'text-success' : 'text-neutral-300'
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
            onClick: (row) => navigation.users.edit(row.uuid)
        },
        {
            name: 'Eliminar',
            icon: <Trash2 size={14} />,
            onClick: (row) => handleDeleteUser(row.uuid),
        },
    ];

    return (
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 pb-20">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 md:mb-8">
                <div className="flex items-center gap-3">
                    <Typography variant={TypographyVariant.SUBTITLE}>
                        {t(TEXT.USERS.CREATE.LAYOUT_TITLE)}
                    </Typography>
                    <InfoTooltip
                        title="Seguridad de Acceso"
                        description={t(TEXT.USERS.CREATE.DESCRIPTION)}
                    />
                </div>

                <Button variant={ButtonVariant.PRIMARY} onClick={() => navigation.users.create()}>
                    <UserPlus size={18} className="mr-0 md:mr-2" />
                    <span className="hidden md:inline">{t(TEXT.USERS.CREATE.FORM.SUBMIT)}</span>
                </Button>
            </div>

            {/* Filtros */}
            <div className="bg-white p-3 rounded-app-md border border-neutral-100 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                    <input
                        type="text"
                        placeholder={t(TEXT.USERS.CREATE.FORM.FULL_NAME_PLACEHOLDER)}
                        className="w-full pl-10 pr-4 py-2 bg-neutral-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-soft transition-all"
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>

                <div className="flex gap-1 bg-neutral-50 p-1 rounded-xl w-full md:w-auto">
                    {ROLES_FILTER.map(role => (
                        <button
                            key={role}
                            onClick={() => handleRoleChange(role)}
                            className={tailwind(
                                "flex-1 md:flex-none px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all",
                                activeRole === role ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"
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
                onRowClick={(row) => navigation.users.detail(row.uuid)}
            />
        </div>
    );
}