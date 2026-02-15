import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';
import { ChevronLeft, Save, User, Mail, ShieldCheck, Briefcase, Loader2 } from 'lucide-react';
import { useNavigation } from '@/hooks/use-navigation';
import { authorizeServerSidePage } from '@/hocs/auth';

const EditUserPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const nav = useNavigation();

    // Estado del formulario
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'Médico',
        speciality: ''
    });
    const [loading, setLoading] = useState(true);

    // Simulamos la carga de datos del usuario al montar el componente
    useEffect(() => {
        if (id) {
            // Aquí harías tu fetch(id)
            setTimeout(() => {
                setFormData({
                    name: 'Dr. Roberto Gómez',
                    email: 'roberto.g@clinica.com',
                    role: 'Médico',
                    speciality: 'Audiología'
                });
                setLoading(false);
            }, 800);
        }
    }, [id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Actualizando usuario:", id, formData);
        // Aquí iría tu mutación/axios.put
        nav.users.list();
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        );
    }

    return (
        <DashboardLayout contentStyle={BoxedLayoutStyle.FULL} title="Editar Usuario">
            <div className="max-w-3xl mx-auto px-6">

                <button
                    onClick={() => nav.common.back()}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors mb-6 font-bold text-sm group"
                >
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Volver
                </button>

                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">
                    <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
                        <div>
                            <Typography variant={TypographyVariant.SUBTITLE}>Modificar Acceso</Typography>
                            <p className="text-sm text-slate-400">Editando el perfil del ID: <span className="font-mono text-blue-600">#{id}</span></p>
                        </div>
                        <div className="h-12 w-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black">
                            {formData.name.charAt(0)}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Nombre */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Nombre Completo</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Correo */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Correo Electrónico</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Rol */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Rol</label>
                                <div className="relative">
                                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-100 outline-none appearance-none"
                                    >
                                        <option value="Médico">Médico</option>
                                        <option value="Recepcionista">Recepcionista</option>
                                        <option value="Administrador">Administrador</option>
                                    </select>
                                </div>
                            </div>

                            {/* Especialidad */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Especialidad</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                    <input
                                        type="text"
                                        value={formData.speciality}
                                        onChange={(e) => setFormData({ ...formData, speciality: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 flex justify-end gap-3 border-t border-slate-50">
                            <Button
                                variant={ButtonVariant.CANCEL}
                                onClick={() => nav.common.back()}
                                type="button"
                            >
                                Descartar Cambios
                            </Button>
                            <Button
                                variant={ButtonVariant.PRIMARY}
                                type="submit"
                                className="shadow-lg shadow-blue-100"
                            >
                                <Save size={18} className="mr-2" /> Guardar Cambios
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
};
export const getServerSideProps = authorizeServerSidePage();

export default EditUserPage;