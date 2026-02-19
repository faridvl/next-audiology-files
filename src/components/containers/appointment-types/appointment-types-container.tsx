import React, { useState } from 'react';
import {
    Plus,
    Stethoscope,
    Ear,
    Activity,
    Search,
    MoreVertical,
    Clock,
    DollarSign,
    LayoutGrid,
    CheckCircle2,
    BriefcaseMedical // Nuevo icono para General
} from 'lucide-react';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';
import { useNavigation } from '@/hooks/use-navigation';

enum Speciality {
    AUDIOLOGY = 'AUDIOLOGY',
    DENTAL = 'DENTAL',
    GENERAL = 'GENERAL'
}

const ALL_SPECIALITIES = 'ALL';

// Mapeo de iconos por especialidad para las cards
const SpecialityIconMap = {
    [Speciality.GENERAL]: BriefcaseMedical, // Cambiado para ser más distintivo
    [Speciality.AUDIOLOGY]: Ear,
    [Speciality.DENTAL]: Activity, // Podríamos usar Tooth si quisieras algo más explícito para dental
};

export const AppointmentTypesContainer: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Speciality | typeof ALL_SPECIALITIES>(ALL_SPECIALITIES);
    const [searchTerm, setSearchTerm] = useState('');
    const navigation = useNavigation();

    const serviceTypes = [
        { id: '1', name: 'Consulta General', duration: '30 min', price: '50.00', speciality: Speciality.GENERAL, color: 'blue' },
        { id: '2', name: 'Seguimiento Crónico', duration: '45 min', price: '40.00', speciality: Speciality.GENERAL, color: 'indigo' },
        { id: '3', name: 'Calibración de Audífonos', duration: '60 min', price: '80.00', speciality: Speciality.AUDIOLOGY, color: 'emerald' },
        { id: '4', name: 'Audiometría Clínica', duration: '45 min', price: '100.00', speciality: Speciality.AUDIOLOGY, color: 'teal' },
        { id: '5', name: 'Limpieza Dental', duration: '40 min', price: '60.00', speciality: Speciality.DENTAL, color: 'amber' },
    ];

    const filteredServices = serviceTypes.filter(s => {
        const matchesTab = activeTab === ALL_SPECIALITIES || s.speciality === activeTab;
        const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const tabs = [
        { id: ALL_SPECIALITIES, label: 'Todos', icon: LayoutGrid },
        { id: Speciality.GENERAL, label: 'General', icon: BriefcaseMedical }, // Icono actualizado
        { id: Speciality.AUDIOLOGY, label: 'Audiología', icon: Ear },
        { id: Speciality.DENTAL, label: 'Dental', icon: Activity },
    ];

    return (
        <div className="flex flex-col h-full gap-5 p-6 bg-[#F8FAFC]">

            {/* Header más compacto */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-0.5">
                    <Typography variant={TypographyVariant.HEADER} className="text-2xl font-black text-slate-900">Servicios</Typography>
                    <Typography variant={TypographyVariant.HELPER} className="text-sm text-slate-500 font-medium">
                        Administra el catálogo de servicios y especialidades médicas.
                    </Typography>
                </div>
                <div className="flex gap-2"> {/* Espaciado reducido */}
                    <div className="relative group min-w-[250px]"> {/* Ancho de búsqueda ligeramente menor */}
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} /> {/* Icono de búsqueda más pequeño */}
                        <input
                            type="text"
                            placeholder="Buscar servicio..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all shadow-sm text-sm" // Padding y redondeado reducido
                        />
                    </div>
                    <Button
                        variant={ButtonVariant.PRIMARY}
                        className="rounded-xl h-10 px-4 bg-slate-900 shadow-lg shadow-slate-200 border-none hover:bg-slate-800 text-sm" // Altura y padding reducido, font size menor
                        onClick={navigation.appointmentType.create}
                    >
                        <Plus size={18} className="mr-1.5" /> Nuevo
                    </Button>
                </div>
            </div>

            {/* Tabs tipo "Pill" compactas */}
            <div className="flex gap-1.5 p-1 bg-slate-200/50 rounded-[1.5rem] w-fit border border-slate-100"> {/* Reducido padding y redondeado */}
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-[1.2rem] transition-all duration-300 ${ // Padding y redondeado reducido
                                isActive ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-800'
                                }`}
                        >
                            <Icon size={14} strokeWidth={isActive ? 2.5 : 2} /> {/* Icono más pequeño */}
                            <span className="text-xs font-bold tracking-tight">{tab.label}</span> {/* Fuente más pequeña */}
                        </button>
                    );
                })}
            </div>

            {/* Grid de Cards Compactas */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"> {/* Espaciado de grid reducido */}
                {filteredServices.map((service) => {
                    const SpecIcon = SpecialityIconMap[service.speciality];
                    return (
                        <div
                            key={service.id}
                            className="group bg-white rounded-[2rem] p-5 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 relative flex flex-col" // Padding y redondeado reducido
                        >
                            {/* Top row: Icono y Menú */}
                            <div className="flex justify-between items-start mb-4"> {/* Margen inferior reducido */}
                                <div className={`p-3 rounded-2xl bg-${service.color}-50 text-${service.color}-600 group-hover:scale-110 transition-transform duration-500`}> {/* Padding y redondeado reducido */}
                                    <SpecIcon size={20} /> {/* Icono más pequeño */}
                                </div>
                                <div className="flex items-center gap-1.5"> {/* Espaciado reducido */}
                                    <span className="flex items-center gap-0.5 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border border-emerald-100"> {/* Padding y fuente más pequeños */}
                                        <CheckCircle2 size={9} /> Activo
                                    </span>
                                    <button className="p-1.5 text-slate-300 hover:bg-slate-50 hover:text-slate-600 rounded-lg transition-all"> {/* Padding y redondeado reducido */}
                                        <MoreVertical size={18} /> {/* Icono más pequeño */}
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 space-y-1"> {/* Espaciado reducido */}
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5"> {/* Fuente más pequeña */}
                                        {service.speciality}
                                    </span>
                                    <Typography variant={TypographyVariant.BODY_BOLD} className="text-lg text-slate-900 group-hover:text-blue-600 transition-colors"> {/* Fuente más pequeña */}
                                        {service.name}
                                    </Typography>
                                </div>
                            </div>

                            {/* Info Bar */}
                            <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between"> {/* Margen y padding reducido */}
                                <div className="flex items-center gap-3"> {/* Espaciado reducido */}
                                    <div className="flex items-center gap-1 text-slate-500"> {/* Espaciado reducido */}
                                        <Clock size={14} className="text-slate-400" /> {/* Icono más pequeño */}
                                        <span className="text-xs font-bold uppercase tracking-tighter">{service.duration}</span> {/* Fuente más pequeña */}
                                    </div>
                                </div>
                                <div className="flex items-center text-slate-900">
                                    <DollarSign size={14} className="text-blue-500" /> {/* Icono más pequeño */}
                                    <span className="text-xl font-black tracking-tighter">{service.price}</span> {/* Fuente más pequeña */}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Empty State Card (Add Button) Compacta */}
                <button
                    onClick={navigation.appointmentType.create}
                    className="border-2 border-dashed border-slate-200 rounded-[2rem] p-6 flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-600 transition-all group min-h-[220px]" // Padding y redondeado reducido, min-height ajustado
                >
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-100 group-hover:scale-110 transition-all duration-500"> {/* Tamaño y redondeado reducido */}
                        <Plus size={28} /> {/* Icono más pequeño */}
                    </div>
                    <div className="text-center">
                        <p className="font-black text-sm uppercase tracking-widest">Nuevo Servicio</p>
                        <p className="text-xs opacity-60">Crear configuración médica</p>
                    </div>
                </button>
            </div>
        </div>
    );
};