import React, { useState } from 'react';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';
import { ChevronLeft, Save, User, Mail, ShieldCheck, Briefcase } from 'lucide-react';
import { authorizeServerSidePage } from '@/hocs/auth';
import { useNavigation } from '@/hooks/use-navigation';

const CreateUserPage = () => {
    const nav = useNavigation();
    const [role, setRole] = useState('Médico');

    return (
        <DashboardLayout contentStyle={BoxedLayoutStyle.FULL} title="Nuevo Miembro">
            <div className="max-w-3xl mx-auto px-6">
                {/* Header con navegación */}
                <button
                    onClick={() => nav.common.back()}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors mb-6 group"
                >
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-bold">Volver a la lista</span>
                </button>

                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">
                    <div className="p-8 border-b border-slate-50 bg-slate-50/30">
                        <Typography variant={TypographyVariant.SUBTITLE}>Información del Usuario</Typography>
                        <p className="text-sm text-slate-400">Completa los datos para dar de alta un nuevo acceso.</p>
                    </div>

                    <form className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Nombre */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Nombre Completo</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                    <input type="text" className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all" placeholder="Ej. Roberto Gómez" />
                                </div>
                            </div>

                            {/* Correo */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Correo Electrónico</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                    <input type="email" className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all" placeholder="nombre@clinica.com" />
                                </div>
                            </div>

                            {/* Rol */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Rol de Sistema</label>
                                <div className="relative">
                                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                    <select
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-100 outline-none appearance-none"
                                    >
                                        <option value="Médico">Médico</option>
                                        <option value="Recepcionista">Recepcionista</option>
                                        <option value="Administrador">Administrador</option>
                                    </select>
                                </div>
                            </div>

                            {/* Especialidad (Condicional) */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Especialidad / Área</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                    <input type="text" className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all" placeholder="Ej. Audiología" />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 flex justify-end gap-3">
                            <Button variant={ButtonVariant.CANCEL} onClick={() => nav.common.back()} type="button">
                                Cancelar
                            </Button>
                            <Button variant={ButtonVariant.PRIMARY} type="submit" className="shadow-lg shadow-blue-200">
                                <Save size={18} className="mr-2" /> Guardar Usuario
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
};

export const getServerSideProps = authorizeServerSidePage();

export default CreateUserPage;