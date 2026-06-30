import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigation } from "@/hooks/use-navigation";
import { usePatientDetail } from "./use-patient-detail";
import { Typography, TypographyVariant } from "@/components/common/typography/typography";
import {
    EnvelopeIcon,
    IdentificationIcon,
    MagnifyingGlassIcon,
    WrenchScrewdriverIcon
} from "@heroicons/react/24/outline";
import {
    CalendarIcon,
    ChevronRightIcon,
    PhoneIcon,
    PlusIcon,
    ShieldCheckIcon,
    ClipboardList,
    Link,
} from "lucide-react";
import { Button, ButtonVariant } from "@/components/common/button/button";
import { MedicalSpeciality } from "@/types/medical-controls/medical-control.types";
import { ClinicalControl, ControlType } from "@/types/otros/clinical";
import { useSession } from "@/hooks/use-session";
import { UserRole } from "@/types/auth/auth";
import { LinkDeviceModal } from "./link-device-modal";
import { AudiogramChart, classifyHearingLoss } from "@/components/common/audiogram-chart/audiogram-chart";
import { useState } from "react";
import { useDeletePatientMutation } from "@/shared/api/mutations/patients/use-delete-patient-mutation";
import { DocumentsContainer } from "@/components/containers/documents/documents-view";
import { usePatientBackgroundQuery } from "@/shared/api/querys/patient-background-query";
import { useUpsertPatientBackgroundMutation } from "@/shared/api/mutations/patients/upsert-background-mutation";
import { UpsertPatientBackgroundPayload, PatientBackgroundEntity } from "@/types/patients/patient-background.types";
import { usePatientDevicesQuery } from "@/shared/api/querys/patient-devices-query";
import { useCreatePatientDeviceMutation } from "@/shared/api/mutations/patients/create-patient-device-mutation";
import { useDeactivatePatientDeviceMutation } from "@/shared/api/mutations/patients/deactivate-patient-device-mutation";
import { PatientDevice } from "@/types/patients/patient-device.types";
import { toast } from "sonner";
import { ChevronDown, ChevronUp, Trash2, Headphones, Plus, Save, X } from "lucide-react";

interface HeaderInfoProps { icon: React.ReactNode; text: string; isWarning?: boolean; }
const HeaderInfo = ({ icon, text, isWarning }: HeaderInfoProps) => (
    <div className="flex items-center gap-2">
        <span className="text-neutral-400">{icon}</span>
        <Typography
            variant={TypographyVariant.CAPTION}
            className={isWarning ? 'text-warning italic font-medium' : 'font-medium text-neutral-600'}
        >
            {text}
        </Typography>
    </div>
);

interface StatCardProps { title: string; value: string; icon: React.ReactNode; onClick: () => void; }
const StatCard = ({ title, value, icon, onClick }: StatCardProps) => (
    <button
        onClick={onClick}
        className="bg-white p-5 rounded-app-xl border border-neutral-100 shadow-sm flex items-start gap-4 hover:border-primary/30 hover:shadow-md transition-all text-left w-full group"
    >
        <div className="p-3 bg-neutral-50 rounded-app-md group-hover:bg-primary-soft transition-colors">
            {icon}
        </div>
        <div className="flex-1">
            <Typography variant={TypographyVariant.CAPTION} className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-0.5">{title}</Typography>
            <Typography variant={TypographyVariant.BODY_BOLD} className="text-sm font-bold text-neutral-900">{value}</Typography>
        </div>
        <ChevronRightIcon className="h-4 w-4 text-neutral-300 self-center group-hover:text-primary transition-colors" />
    </button>
);

interface SpecFilterButtonProps { label: string; isActive: boolean; onClick: () => void; }
const SpecFilterButton = ({ label, isActive, onClick }: SpecFilterButtonProps) => (
    <button
        onClick={onClick}
        className={`px-5 py-2 rounded-app-sm transition-all whitespace-nowrap text-[10px] font-black uppercase tracking-widest
        ${isActive ? 'bg-neutral-900 text-white shadow-lg shadow-neutral-200' : 'bg-white text-neutral-500 hover:bg-neutral-50 border border-neutral-100'}`}
    >
        {label}
    </button>
);

const getTypeStyle = (type: ControlType) => {
    switch (type) {
        case ControlType.AUDIOLOGY: return "bg-accent/10 text-accent border-accent/20";
        case ControlType.DENTAL: return "bg-primary-soft text-primary border-primary-soft";
        case ControlType.GENERAL: return "bg-success/10 text-success border-success/20";
        default: return "bg-neutral-50 text-neutral-600 border-neutral-100";
    }
};

const BACKGROUND_LABELS: Record<string, string> = {
  earInfections: 'Infecciones de oído',
  nasalSurgery: 'Cirugía nasal',
  throatSurgery: 'Cirugía de garganta',
  earSurgery: 'Cirugía de oído',
  diabetes: 'Diabetes',
  cholesterol: 'Colesterol alto',
  highPressure: 'Presión alta',
  allergies: 'Alergias',
  rhinitis: 'Rinitis',
  vertigo: 'Vértigo',
  tinnitus: 'Tinnitus',
  headacheNoise: 'Dolor de cabeza / ruido',
  cloggedEar: 'Oído tapado',
};
const BACKGROUND_KEYS = Object.keys(BACKGROUND_LABELS) as Array<keyof Omit<PatientBackgroundEntity, 'uuid' | 'patientUuid' | 'updatedAt' | 'notes'>>;

const BackgroundPanel = ({ patientUuid }: { patientUuid: string }) => {
  const { data: background, isLoading } = usePatientBackgroundQuery(patientUuid);
  const { executeUpsertBackground, isPending } = useUpsertPatientBackgroundMutation(patientUuid);
  const [isOpen, setIsOpen] = useState(false);
  const [values, setValues] = useState<UpsertPatientBackgroundPayload | null>(null);

  const handleOpen = () => {
    const defaults = BACKGROUND_KEYS.reduce((acc, key) => ({ ...acc, [key]: background?.[key] ?? false }), {} as Record<string, boolean>);
    setValues({ ...defaults, notes: background?.notes ?? null } as UpsertPatientBackgroundPayload);
    setIsOpen(true);
  };

  const handleSave = () => {
    if (!values) return;
    executeUpsertBackground(values, {
      onSuccess: () => { toast.success('Antecedentes actualizados'); setIsOpen(false); },
      onError: () => toast.error('Error al guardar antecedentes'),
    });
  };

  const positiveCount = background ? BACKGROUND_KEYS.filter((k) => background[k]).length : 0;

  return (
    <div className="bg-white rounded-app-md border border-neutral-100 shadow-sm overflow-hidden">
      <button onClick={() => (isOpen ? setIsOpen(false) : handleOpen())} className="w-full flex items-center justify-between p-5 hover:bg-neutral-50 transition-colors">
        <div className="flex items-center gap-3">
          <Typography variant={TypographyVariant.BODY_BOLD} className="text-sm text-neutral-800">Antecedentes médicos</Typography>
          {positiveCount > 0 && (
            <span className="px-2 py-0.5 bg-danger/10 text-danger border border-danger/20 rounded-lg text-[10px] font-black">{positiveCount} positivos</span>
          )}
          {isLoading && <span className="text-[10px] text-neutral-400 font-bold">Cargando...</span>}
        </div>
        {isOpen ? <ChevronUp className="h-4 w-4 text-neutral-400" /> : <ChevronDown className="h-4 w-4 text-neutral-400" />}
      </button>

      {isOpen && values && (
        <div className="px-5 pb-5 border-t border-neutral-100">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
            {BACKGROUND_KEYS.map((key) => (
              <label key={key} className={`flex items-center gap-2.5 p-3 rounded-app-sm border cursor-pointer transition-all text-xs font-bold select-none ${(values as Record<string, unknown>)[key] ? 'bg-danger/10 border-danger/30 text-danger' : 'bg-neutral-50 border-transparent text-neutral-500 hover:border-neutral-200'}`}>
                <input
                  type="checkbox"
                  checked={!!(values as Record<string, unknown>)[key]}
                  onChange={(e) => setValues((prev) => prev ? { ...prev, [key]: e.target.checked } : prev)}
                  className="accent-danger w-3.5 h-3.5 shrink-0"
                />
                {BACKGROUND_LABELS[key]}
              </label>
            ))}
          </div>
          <div className="mt-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1 block">Notas adicionales</label>
            <textarea
              value={values.notes ?? ''}
              onChange={(e) => setValues((prev) => prev ? { ...prev, notes: e.target.value || null } : prev)}
              rows={2}
              placeholder="Observaciones adicionales..."
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-app-sm text-xs outline-none focus:border-primary/50 resize-none transition-all"
            />
          </div>
          <div className="flex justify-end gap-2 mt-3">
            <button onClick={() => setIsOpen(false)} className="flex items-center gap-1.5 px-4 py-2 text-neutral-400 hover:text-neutral-600 font-black text-[10px] uppercase tracking-widest transition-colors">
              <X size={12} /> Cancelar
            </button>
            <button onClick={handleSave} disabled={isPending} className="flex items-center gap-1.5 px-5 py-2 bg-neutral-900 hover:bg-primary text-white rounded-app-sm font-black text-[10px] uppercase tracking-widest transition-all disabled:opacity-50">
              <Save size={12} /> {isPending ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const SIDE_LABELS: Record<string, string> = { OD: 'Oído Derecho', OI: 'Oído Izquierdo', AMBOS: 'Ambos' };

const DevicesPanel = ({ patientUuid }: { patientUuid: string }) => {
  const queryClient = useQueryClient();
  const { data: devices, isLoading } = usePatientDevicesQuery(patientUuid);
  const { executeCreateDevice, isPending: isCreating } = useCreatePatientDeviceMutation(patientUuid);
  const { executeDeactivateDevice } = useDeactivatePatientDeviceMutation(patientUuid);
  const [isOpen, setIsOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ side: 'OD' as PatientDevice['side'], brand: '', model: '', serialNumber: '', warrantyUntil: '' });

  const handleCreate = () => {
    executeCreateDevice(
      { side: form.side, brand: form.brand || undefined, model: form.model || undefined, serialNumber: form.serialNumber || undefined, warrantyUntil: form.warrantyUntil || undefined },
      {
        onSuccess: () => {
          toast.success('Audífono registrado');
          setShowForm(false);
          setForm({ side: 'OD', brand: '', model: '', serialNumber: '', warrantyUntil: '' });
          queryClient.invalidateQueries({ queryKey: ['fetchPatientDevices', patientUuid] });
        },
        onError: () => toast.error('Error al registrar el audífono'),
      },
    );
  };

  const handleDeactivate = (deviceUuid: string) => {
    if (!window.confirm('¿Eliminar este audífono del registro del paciente?')) return;
    executeDeactivateDevice(deviceUuid, {
      onSuccess: () => {
        toast.success('Audífono eliminado');
        queryClient.invalidateQueries({ queryKey: ['fetchPatientDevices', patientUuid] });
      },
      onError: () => toast.error('Error al eliminar el audífono'),
    });
  };

  const activeDevices = (devices ?? []) as PatientDevice[];

  return (
    <div className="bg-white rounded-app-md border border-neutral-100 shadow-sm overflow-hidden">
      <button onClick={() => setIsOpen((o) => !o)} className="w-full flex items-center justify-between p-5 hover:bg-neutral-50 transition-colors">
        <div className="flex items-center gap-3">
          <Headphones className="h-4 w-4 text-neutral-500" />
          <Typography variant={TypographyVariant.BODY_BOLD} className="text-sm text-neutral-800">Audífonos registrados</Typography>
          {!isLoading && <span className="px-2 py-0.5 bg-neutral-100 text-neutral-500 rounded-lg text-[10px] font-black">{activeDevices.length}</span>}
        </div>
        {isOpen ? <ChevronUp className="h-4 w-4 text-neutral-400" /> : <ChevronDown className="h-4 w-4 text-neutral-400" />}
      </button>

      {isOpen && (
        <div className="px-5 pb-5 border-t border-neutral-100 space-y-3 mt-4">
          {isLoading ? (
            <p className="text-xs text-neutral-400 text-center py-4">Cargando...</p>
          ) : activeDevices.length === 0 ? (
            <p className="text-xs text-neutral-400 italic text-center py-4">Sin audífonos registrados.</p>
          ) : (
            activeDevices.map((device) => (
              <div key={device.uuid} className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-app-md border border-neutral-100">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-primary-soft text-primary-dark px-2 py-0.5 rounded-lg">{SIDE_LABELS[device.side]}</span>
                    {device.brand && <span className="text-xs font-bold text-neutral-700">{device.brand} {device.model}</span>}
                  </div>
                  {device.serialNumber && <p className="text-[10px] text-neutral-400 font-medium">S/N: {device.serialNumber}</p>}
                  {device.warrantyUntil && <p className="text-[10px] text-neutral-400">Garantía hasta: {new Date(device.warrantyUntil).toLocaleDateString('es-ES')}</p>}
                </div>
                <button onClick={() => handleDeactivate(device.uuid)} className="p-2 text-neutral-300 hover:text-danger hover:bg-danger/10 rounded-app-sm transition-all">
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}

          {showForm ? (
            <div className="p-4 bg-primary-soft/30 rounded-app-md border border-primary-soft space-y-3">
              <div className="grid grid-cols-3 gap-2">
                {(['OD', 'OI', 'AMBOS'] as const).map((s) => (
                  <button key={s} onClick={() => setForm((f) => ({ ...f, side: s }))} className={`py-2 rounded-app-sm font-black text-[10px] uppercase tracking-widest transition-all ${form.side === s ? 'bg-primary text-white' : 'bg-white text-neutral-500 border border-neutral-200'}`}>
                    {SIDE_LABELS[s]}
                  </button>
                ))}
              </div>
              {['brand', 'model', 'serialNumber'].map((field) => (
                <input key={field} placeholder={{ brand: 'Marca', model: 'Modelo', serialNumber: 'Número de serie' }[field]} value={(form as Record<string, string>)[field]} onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))} className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-app-sm text-xs outline-none focus:border-primary/50 transition-all" />
              ))}
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1 block">Garantía hasta</label>
                <input type="date" value={form.warrantyUntil} onChange={(e) => setForm((f) => ({ ...f, warrantyUntil: e.target.value }))} className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-app-sm text-xs outline-none focus:border-primary/50 transition-all" />
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowForm(false)} className="px-4 py-2 text-neutral-400 font-black text-[10px] uppercase tracking-widest hover:text-neutral-600 transition-colors">Cancelar</button>
                <button onClick={handleCreate} disabled={isCreating} className="flex items-center gap-1.5 px-5 py-2 bg-primary hover:bg-primary-dark text-white rounded-app-sm font-black text-[10px] uppercase tracking-widest transition-all disabled:opacity-50">
                  <Save size={12} /> {isCreating ? 'Guardando...' : 'Registrar'}
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowForm(true)} className="w-full flex items-center justify-center gap-1.5 py-2.5 border border-dashed border-neutral-200 rounded-app-md text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:border-primary/40 hover:text-primary transition-all">
              <Plus size={12} /> Agregar audífono
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export const PatientDetailContainer = ({ id }: { id: string }) => {
    const navigation = useNavigation();
    const [isLinkDeviceOpen, setIsLinkDeviceOpen] = useState(false);
    const [isConfirmDelete, setIsConfirmDelete] = useState(false);
    const { user } = useSession();
    const canStartConsulta = user?.role && user.role !== UserRole.STAFF;
    const isAdmin = user?.role === UserRole.OWNER || user?.role === UserRole.ADMIN;
    const { deletePatient, isPending: isDeletingPatient } = useDeletePatientMutation();

    const {
        patient, history, summary, isLoading, isFetching,
        hasMore, searchTerm, setSearchTerm, selectedSpec, setSelectedSpec, loadMore,
        latestAudiogram, recordTypeFilter, setRecordTypeFilter,
    } = usePatientDetail(id, user?.specialty);

    if (isLoading || !patient) return (
        <div className="p-20 text-center animate-pulse text-neutral-400 font-bold uppercase tracking-widest">
            Cargando expediente...
        </div>
    );

    const specialityOptions = user?.specialty
        ? [user.specialty as unknown as MedicalSpeciality]
        : Object.values(MedicalSpeciality);

    return (
        <>
        <div className="max-w-[1400px] mx-auto p-4 md:p-6 space-y-6 md:space-y-8 animate-in fade-in duration-500">

            {/* PERFIL PACIENTE */}
            <div className="bg-white rounded-app-xl md:rounded-app-xl p-4 md:p-6 border border-neutral-100 shadow-sm flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 md:h-20 md:w-20 bg-neutral-900 rounded-app-sm md:rounded-app-md flex items-center justify-center text-white text-xl md:text-2xl font-black shadow-xl shadow-neutral-200 shrink-0">
                        {patient.firstName.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                        <Typography variant={TypographyVariant.HEADER} className="text-lg md:text-2xl font-black text-neutral-900 leading-tight truncate">
                            {patient.firstName} {patient.lastName}
                        </Typography>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                            <HeaderInfo icon={<IdentificationIcon className="h-3.5 w-3.5" />} text={patient.uuid.split('-')[0].toUpperCase()} />
                            <HeaderInfo icon={<PhoneIcon className="h-3.5 w-3.5" />} text={patient.phone} />
                            <HeaderInfo icon={<EnvelopeIcon className="h-3.5 w-3.5" />} text={patient.email ?? 'Sin correo'} isWarning={!patient.email} />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    {isAdmin && !isConfirmDelete && (
                        <button
                            onClick={() => setIsConfirmDelete(true)}
                            className="flex items-center justify-center gap-1.5 border border-danger/30 text-danger px-4 h-10 rounded-app-sm font-black text-[10px] uppercase tracking-widest hover:bg-danger/10 transition-all flex-1 sm:flex-none"
                        >
                            Desactivar paciente
                        </button>
                    )}
                    {isAdmin && isConfirmDelete && (
                        <div className="flex items-center gap-2 border border-danger/30 bg-danger/10 px-4 h-10 rounded-app-sm flex-1 sm:flex-none">
                            <span className="text-[10px] font-black text-danger uppercase tracking-widest">¿Confirmar?</span>
                            <button
                                disabled={isDeletingPatient}
                                onClick={async () => {
                                    try {
                                        await deletePatient(id);
                                        toast.success('Paciente desactivado');
                                        navigation.patients.list();
                                    } catch {
                                        toast.error('Error al desactivar');
                                        setIsConfirmDelete(false);
                                    }
                                }}
                                className="text-[10px] font-black text-white bg-danger hover:bg-danger/80 px-3 py-1 rounded-lg uppercase tracking-widest transition-all disabled:opacity-50"
                            >
                                {isDeletingPatient ? '...' : 'Sí'}
                            </button>
                            <button onClick={() => setIsConfirmDelete(false)} className="text-[10px] font-black text-neutral-500 hover:text-neutral-700 uppercase tracking-widest">No</button>
                        </div>
                    )}
                    <button
                        onClick={() => setIsLinkDeviceOpen(true)}
                        className="flex items-center justify-center gap-1.5 border border-neutral-200 text-neutral-600 px-4 h-10 rounded-app-sm font-black text-[10px] uppercase tracking-widest hover:bg-neutral-50 hover:border-neutral-300 transition-all flex-1 sm:flex-none"
                    >
                        <Link className="h-4 w-4 shrink-0" />
                        <span className="truncate">{patient.linkedProductUuid ? 'Cambiar audífono' : 'Vincular audífono'}</span>
                    </button>
                    <button
                        onClick={() => navigation.patients.ficha(id)}
                        className="flex items-center justify-center gap-1.5 border border-neutral-200 text-neutral-600 px-4 h-10 rounded-app-sm font-black text-[10px] uppercase tracking-widest hover:bg-neutral-50 hover:border-neutral-300 transition-all flex-1 sm:flex-none"
                    >
                        <ClipboardList className="h-4 w-4 shrink-0" />
                        <span className="truncate">Ver ficha completa</span>
                    </button>
                    {canStartConsulta && (
                        <Button variant={ButtonVariant.PRIMARY} className="rounded-app-sm px-5 h-10 shadow-lg shadow-primary-soft flex-1 sm:flex-none" onClick={() => navigation.patients.consulta(id)}>
                            <PlusIcon className="h-4 w-4 mr-2 shrink-0" />
                            <span className="text-xs font-bold uppercase tracking-tight">Iniciar consulta</span>
                        </Button>
                    )}
                </div>
            </div>

            {/* INDICADORES RÁPIDOS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard title="Próxima cita" value={summary.nextAppointment} icon={<CalendarIcon className="h-5 w-5 text-primary" />} onClick={() => navigation.appointments.list()} />
                <StatCard title="Próx. mantenimiento" value={summary.warrantyExpiration} icon={<ShieldCheckIcon className="h-5 w-5 text-success" />} onClick={() => navigation.maintenance.list()} />
                <StatCard title="Mantenimientos" value={`${summary.pendingMaintenance.length} registrados`} icon={<WrenchScrewdriverIcon className="h-5 w-5 text-warning" />} onClick={() => navigation.maintenance.list()} />
            </div>

            {/* ANTECEDENTES Y AUDÍFONOS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <BackgroundPanel patientUuid={id} />
                <DevicesPanel patientUuid={id} />
            </div>

            {/* HISTORIAL CLÍNICO */}
            <div className="space-y-4">
                {/* Filtros */}
                <div className="flex flex-col gap-3 bg-white p-4 rounded-app-md border border-neutral-100 shadow-sm">
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                        <SpecFilterButton label="Todos" isActive={recordTypeFilter === 'ALL'} onClick={() => setRecordTypeFilter('ALL')} />
                        <SpecFilterButton label="Controles" isActive={recordTypeFilter === 'CONTROL'} onClick={() => setRecordTypeFilter('CONTROL')} />
                        <SpecFilterButton label="Audiogramas" isActive={recordTypeFilter === 'AUDIOGRAM'} onClick={() => setRecordTypeFilter('AUDIOGRAM')} />
                        <SpecFilterButton label="Mantenimientos" isActive={recordTypeFilter === 'MAINTENANCE'} onClick={() => setRecordTypeFilter('MAINTENANCE')} />
                    </div>
                    {specialityOptions.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                            <SpecFilterButton label="Toda especialidad" isActive={selectedSpec === 'ALL'} onClick={() => setSelectedSpec('ALL')} />
                            {specialityOptions.map((spec) => (
                                <SpecFilterButton key={spec} label={spec} isActive={selectedSpec === spec} onClick={() => setSelectedSpec(spec)} />
                            ))}
                        </div>
                    )}
                    <div className="relative w-full">
                        <MagnifyingGlassIcon className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Buscar en registros..."
                            className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-app-sm text-xs outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                        />
                    </div>
                </div>

                {/* AUDIOGRAMA MÁS RECIENTE */}
                {latestAudiogram && (
                    <div className="bg-white p-5 rounded-app-md border border-neutral-100 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <Typography variant={TypographyVariant.BODY_BOLD} className="text-sm text-neutral-800">
                                    Audiograma más reciente
                                </Typography>
                                <Typography variant={TypographyVariant.CAPTION} className="text-[10px] text-neutral-400 font-medium">
                                    {history.find(record => record.type === 'AUDIOLOGY')?.date ?? ''}
                                </Typography>
                            </div>
                            <div className="flex gap-2">
                                {(['OD', 'OI'] as const).map((side) => {
                                    const hasData = Object.values(latestAudiogram[side] ?? {}).some(v => v !== '');
                                    if (!hasData) return null;
                                    const classification = classifyHearingLoss(latestAudiogram, side);
                                    return (
                                        <div
                                            key={side}
                                            className="px-2.5 py-1.5 rounded-app-sm text-center"
                                            style={{ backgroundColor: `${classification.color}12`, border: `1px solid ${classification.color}30` }}
                                        >
                                            <div className="text-[8px] font-black uppercase tracking-widest text-neutral-400">{side}</div>
                                            <div className="text-[10px] font-black" style={{ color: classification.color }}>
                                                {classification.label}
                                            </div>
                                            <div className="text-[8px] text-neutral-400">{classification.pta} dB</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <AudiogramChart audiogram={latestAudiogram} compact showClassification={false} />
                    </div>
                )}

                {/* REGISTROS */}
                <div className="space-y-3">
                    {history.length === 0 ? (
                        <div className="py-16 text-center bg-white rounded-app-xl border border-dashed border-neutral-200 text-neutral-400 text-xs font-bold uppercase tracking-widest">
                            No hay registros
                        </div>
                    ) : (
                        <>
                            {history.map((record: ClinicalControl) => (
                                <div
                                    key={record.id}
                                    onClick={() => {
                                        if (record.type !== 'MAINTENANCE') {
                                            navigation.patients.viewControl(id, record.id);
                                        }
                                    }}
                                    className={`bg-white p-4 md:p-5 rounded-app-lg md:rounded-app-md border border-neutral-100 transition-all flex items-center gap-3 md:gap-6 group ${record.type === 'MAINTENANCE' ? '' : 'hover:border-primary/40 cursor-pointer'}`}
                                >
                                    <div className="shrink-0">
                                        <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-lg border ${getTypeStyle(record.type as ControlType)}`}>
                                            {record.type}
                                        </span>
                                        <Typography variant={TypographyVariant.CAPTION} className="text-[10px] text-neutral-400 font-bold mt-2 uppercase tracking-tight whitespace-nowrap">
                                            {record.date}
                                        </Typography>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <Typography variant={TypographyVariant.BODY} className="text-sm font-bold text-neutral-700 group-hover:text-primary transition-colors line-clamp-2">
                                            {record.note}
                                        </Typography>
                                    </div>
                                    <ChevronRightIcon className="h-4 w-4 text-neutral-300 group-hover:translate-x-1 transition-transform shrink-0" />
                                </div>
                            ))}
                            {hasMore && (
                                <button
                                    onClick={loadMore}
                                    disabled={isFetching}
                                    className="w-full py-3 text-center text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-primary border border-dashed border-neutral-200 rounded-app-lg hover:border-primary/40 transition-all disabled:opacity-50"
                                >
                                    {isFetching ? 'Cargando...' : 'Cargar más registros'}
                                </button>
                            )}
                        </>
                    )}
                </div>

                {/* DOCUMENTOS */}
                <div className="bg-white rounded-app-md border border-neutral-100 shadow-sm p-5">
                    <Typography variant={TypographyVariant.BODY_BOLD} className="text-sm text-neutral-800 mb-4">
                        Documentos del paciente
                    </Typography>
                    <DocumentsContainer patientId={id} />
                </div>
            </div>
        </div>

        {isLinkDeviceOpen && (
            <LinkDeviceModal
                patientUuid={id}
                currentLinkedProductUuid={patient.linkedProductUuid}
                onClose={() => setIsLinkDeviceOpen(false)}
                onSuccess={() => setIsLinkDeviceOpen(false)}
            />
        )}
        </>
    );
};
