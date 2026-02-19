import { Typography, TypographyVariant } from "@/components/common/typography/typography";
import { MedicalSpeciality } from "@/types/medical-controls/medical-control.types";
import { ChevronRight, Search, Settings } from "lucide-react";
import { useMedicalHistory } from "./use-medical-history";
import { useNavigation } from "@/hooks/use-navigation";
import { useMemo } from "react";

export const MedicalHistorySidebar: React.FC<{ patientId: string }> = ({ patientId }) => {
    const navigation = useNavigation();
    const {
        records, isLoading, isFetching, hasMore,
        searchTerm, setSearchTerm, selectedSpec, setSelectedSpec,
        sortOrder, toggleSortOrder, loadMore
    } = useMedicalHistory(patientId);

    return (
        <div className="w-[35%] flex flex-col h-[calc(100vh-140px)] sticky animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Header + Search */}
            <div className="flex flex-col gap-4 mb-2">
                <div className="flex justify-between items-center px-1">
                    <Typography variant={TypographyVariant.SUBTITLE}>Historial Clínico</Typography>
                    <button
                        onClick={toggleSortOrder}
                        className="p-2 hover:bg-slate-100 rounded-xl transition-all relative flex items-center gap-2 text-slate-400 hover:text-blue-600"
                    >
                        <Settings size={18} />
                        <span className="text-[10px] font-bold uppercase">{sortOrder}</span>
                    </button>
                </div>

                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Buscar en lo cargado..."
                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* TABS (Filtro de cliente) */}
            <div className="flex border-b border-slate-100 mb-4 overflow-x-auto no-scrollbar min-h-[45px]">
                <button
                    onClick={() => setSelectedSpec('ALL')}
                    className={`px-4 py-3 text-[10px] font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap ${selectedSpec === 'ALL' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'}`}
                >
                    Todos
                </button>
                {Object.values(MedicalSpeciality).map(spec => (
                    <button
                        key={spec}
                        onClick={() => setSelectedSpec(spec)}
                        className={`px-4 py-3 text-[10px] font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap ${selectedSpec === spec ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'}`}
                    >
                        {spec}
                    </button>
                ))}
            </div>

            {/* LISTADO */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 no-scrollbar pb-6">
                {isLoading ? (
                    <div className="p-10 text-center animate-pulse text-slate-300 font-bold uppercase text-[10px]">Iniciando...</div>
                ) : (
                    <>
                        {records.map((control) => (
                            <div
                                key={control.uuid}
                                onClick={() => navigation.patients.viewControl(patientId, control.uuid)}
                                className="group p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[9px] font-black px-2 py-0.5 rounded bg-slate-100 text-slate-500 uppercase">
                                        {control.header.speciality}
                                    </span>
                                    <span className="text-[10px] text-slate-400">{new Date(control.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-xs text-slate-600 line-clamp-2 italic leading-relaxed leading-relaxed">
                                    {control.clinicalData.diagnosis}
                                </p>
                            </div>
                        ))}

                        {/* Trigger de Cargar Más */}
                        {hasMore && (
                            <button
                                onClick={loadMore}
                                disabled={isFetching}
                                className="w-full py-4 border-2 border-dashed border-slate-100 rounded-2xl text-[10px] font-bold text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all uppercase tracking-widest flex items-center justify-center gap-2"
                            >
                                {isFetching ? (
                                    <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    "Cargar más registros de la base de datos"
                                )}
                            </button>
                        )}

                        {records.length === 0 && !isFetching && (
                            <div className="py-20 text-center text-slate-300 text-[10px] font-bold uppercase tracking-widest">
                                No hay resultados con los filtros actuales
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
// Sub-componente interno para limpiar el JSX
const TabButton = ({ label, isActive, onClick }: { label: string, isActive: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`px-4 py-3 text-[10px] font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap ${isActive
            ? 'border-blue-600 text-blue-600'
            : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
    >
        {label}
    </button>
);