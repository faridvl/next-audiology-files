import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';
import { Search, Info, UserPlus, Mail, CheckCircle2, XCircle, Edit, Trash2 } from 'lucide-react';
import { Table } from '@/components/common/table/table';
import { authorizeServerSidePage } from '@/hocs/auth';
import { Action } from '@/components/common/menu-item/menu-item';
import { useNavigation } from '@/hooks/use-navigation';

enum UserRole {
    ALL = 'Todos',
    ADMIN = 'Administrador',
    DOCTOR = 'Médico',
    STAFF = 'Recepcionista'
}

const UsersPage = () => {

    const nav = useNavigation();
    const handleNavigateCreateUser = () => nav.users.create();
    const handleNavigateUserDetail = (id: string) => nav.users.detail(id);

    const [searchTerm, setSearchTerm] = useState('');
    const [activeRole, setActiveRole] = useState<UserRole>(UserRole.ALL);
    const [showSecurityInfo, setShowSecurityInfo] = useState(false);

    // Mock de datos
    const users = [
        { id: '1', name: 'Dr. Roberto Gómez', email: 'roberto.g@clinica.com', role: UserRole.DOCTOR, speciality: 'Audiología', status: 'active' },
        { id: '2', name: 'Ana Martínez', email: 'ana.m@clinica.com', role: UserRole.STAFF, speciality: 'Administración', status: 'active' },
        { id: '3', name: 'Dra. Elena Ramos', email: 'elena.r@clinica.com', role: UserRole.DOCTOR, speciality: 'Otología', status: 'inactive' },
    ];

    const columns = [
        { header: 'Usuario', accessor: 'userDisplay', width: '40%' },
        { header: 'Rol / Especialidad', accessor: 'roleDisplay' },
        { header: 'Estado', accessor: 'statusDisplay' },
    ];

    const formattedData = useMemo(() => {
        return users
            .filter(user => {
                const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesRole = activeRole === UserRole.ALL || user.role === activeRole;
                return matchesSearch && matchesRole;
            })
            .map(user => ({
                ...user,
                userDisplay: (
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                            {user.name.charAt(0)}
                        </div>
                        <div>
                            <div className="font-bold text-slate-700 text-sm">{user.name}</div>
                            <div className="flex items-center gap-1 text-slate-400 text-[10px]">
                                <Mail size={10} /> {user.email}
                            </div>
                        </div>
                    </div>
                ),
                roleDisplay: (
                    <div className="flex flex-col">
                        <span className={`text-[9px] font-black uppercase w-fit px-2 py-0.5 rounded-md mb-1 ${user.role === UserRole.ADMIN ? 'bg-purple-50 text-purple-600' :
                            user.role === UserRole.DOCTOR ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                            }`}>
                            {user.role}
                        </span>
                        <span className="text-[11px] text-slate-500">{user.speciality}</span>
                    </div>
                ),
                statusDisplay: (
                    <div className={`flex items-center gap-1.5 text-[11px] font-bold ${user.status === 'active' ? 'text-emerald-500' : 'text-slate-300'}`}>
                        {user.status === 'active' ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                        {user.status === 'active' ? 'Activo' : 'Inactivo'}
                    </div>
                )
            }));
    }, [searchTerm, activeRole]);

    const tableActions: Action[] = [
        {
            name: 'Editar Usuario',
            icon: <Edit size={14} />,
            onClick: (row) => nav.users.edit(row.id)
        },
        {
            name: 'Eliminar',
            icon: <Trash2 size={14} />,
            onClick: (row: any) => console.log('Eliminar', row.id)
        },
    ];

    return (
        <DashboardLayout contentStyle={BoxedLayoutStyle.FULL} title="Gestión de Personal">
            <div className="max-w-[1400px] mx-auto px-6 pb-20">

                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <Typography variant={TypographyVariant.SUBTITLE}>Usuarios del Sistema</Typography>
                        <div className="relative">
                            <button
                                onMouseEnter={() => setShowSecurityInfo(true)}
                                onMouseLeave={() => setShowSecurityInfo(false)}
                                className="p-1.5 text-blue-500 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
                            >
                                <Info size={16} />
                            </button>
                            {showSecurityInfo && (
                                <div className="absolute left-8 top-0 w-64 p-3 bg-slate-900 text-white text-[10px] rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in duration-200 border border-slate-700">
                                    <p className="font-bold mb-1 border-b border-slate-700 pb-1 text-blue-400 uppercase tracking-tight">Seguridad de Acceso</p>
                                    Médicos acceden a expedientes; Recepción gestiona agenda e inventario.
                                </div>
                            )}
                        </div>
                    </div>
                    <Button variant={ButtonVariant.PRIMARY} onClick={handleNavigateCreateUser}>
                        <UserPlus size={18} className="mr-2" /> Nuevo Usuario
                    </Button>
                </div>

                <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex gap-4 items-center mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar personal..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-1">
                        {Object.values(UserRole).map(role => (
                            <button
                                key={role}
                                onClick={() => setActiveRole(role)}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${activeRole === role ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 border-slate-100 hover:bg-slate-50'
                                    }`}
                            >
                                {role}
                            </button>
                        ))}
                    </div>
                </div>

                <Table
                    columns={columns}
                    data={formattedData}
                    currentPage={1}
                    totalRows={formattedData.length}
                    itemsPerPage={5}
                    actions={tableActions}
                    onRowClick={(row) => handleNavigateUserDetail(row.id)}
                />
            </div>
        </DashboardLayout>
    );
};

export const getServerSideProps = authorizeServerSidePage();

export default UsersPage;