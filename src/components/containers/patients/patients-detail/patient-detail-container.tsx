import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigation } from "@/hooks/use-navigation";
import { usePatientDetail, EncounterGroup } from "./use-patient-detail";
import { Typography, TypographyVariant } from "@/components/common/typography/typography";
import {
    EnvelopeIcon,
    IdentificationIcon,
    MagnifyingGlassIcon,
    WrenchScrewdriverIcon,
    CakeIcon,
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
import { ControlType } from "@/types/otros/clinical";
import { useSession } from "@/hooks/use-session";
import { UserRole, UserSpecialty, BusinessType } from "@/types/auth/auth";

const userSpecialtyToMedicalSpeciality: Record<UserSpecialty, MedicalSpeciality> = {
  [UserSpecialty.AUDIOLOGY]: MedicalSpeciality.AUDIOLOGY,
  [UserSpecialty.DENTAL]: MedicalSpeciality.DENTAL,
  [UserSpecialty.GENERAL]: MedicalSpeciality.GENERAL,
};
import { LinkDeviceModal } from "./link-device-modal";
import { AudiogramChart } from "@/components/common/audiogram/audiogram-chart";
import { classifyHearingLoss, HEARING_LOSS_GRADE_COLOR, HEARING_LOSS_GRADE_LABEL_KEYS } from "@/shared/utils/audiometry";
import { Ear } from "@/types/studies/audiometry.types";
import { useState, useMemo } from "react";
import { useDeletePatientMutation } from "@/shared/api/mutations/patients/use-delete-patient-mutation";
import { DocumentsContainer } from "@/components/containers/documents/documents-view";
import { usePatientBackgroundQuery } from "@/shared/api/querys/patient-background-query";
import { useUpsertPatientBackgroundMutation } from "@/shared/api/mutations/patients/upsert-background-mutation";
import { UpsertPatientBackgroundPayload, PatientBackgroundEntity } from "@/types/patients/patient-background.types";
import { usePatientDevicesQuery } from "@/shared/api/querys/patient-devices-query";
import { useDeactivatePatientDeviceMutation } from "@/shared/api/mutations/patients/deactivate-patient-device-mutation";
import { useUpdateProductUnitMutation } from "@/shared/api/mutations/inventory/product-unit-mutation";
import { ProductUnitStatus } from "@/types/inventory/product.types";
import { PatientDevice } from "@/types/patients/patient-device.types";
import { toast } from "sonner";
import { useAppointmentTypesQuery, AppointmentType } from "@/shared/api/querys/appointment-types-query";
import { useCreateAppointmentMutation } from "@/shared/api/mutations/appointments/create-appointment-mutation";
import { useUpdateAppointmentMutation } from "@/shared/api/mutations/appointments/update-appointment-mutation";
import { AppointmentStatus } from "@/types/appointments/appointment";
import { FETCH_APPOINTMENT_BY_PATIENT_KEY } from "@/shared/api/querys/get-appoinment-by-patient-query";
import { FETCH_CONTROLS_KEY } from "@/shared/api/querys/medical-controls-query";
import { FETCH_ENCOUNTERS_BY_PATIENT_KEY } from "@/shared/api/querys/encounters-query";
import { FETCH_STUDIES_BY_PATIENT_KEY } from "@/shared/api/querys/studies-query";
import { FETCH_MAINTENANCE_BY_PATIENT_KEY } from "@/shared/api/querys/maintenance-query";
import { VisitPanel } from "@/components/containers/patients/consulta/visit-panel";
import { ChevronDown, ChevronUp, Trash2, Headphones, Plus, RotateCcw, ShieldCheck, Barcode, X, Save } from "lucide-react";
import { AssignDeviceUnitModal } from "./assign-device-unit-modal";
import { useTranslation } from "react-i18next";
import { TEXT } from "@/static/texts/i18n";

function calculateAge(birthDate: string): number {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
    return age;
}

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

/** Aviso accionable en el encabezado del expediente — reemplaza las stat cards */
interface PatientAlert {
    key: string;
    label: string;
    icon: React.ReactNode;
    styleClassName: string;
    onClick?: () => void;
}

interface EncounterGroupRowProps {
    group: EncounterGroup;
    patientId: string;
}

// MAINTENANCE y AUDIOGRAM no tienen página de detalle propia (el mantenimiento
// se ve inline, el estudio no es un MedicalControl) — solo los controles navegan.
const isNavigableRecord = (type: string): boolean => type !== 'MAINTENANCE' && type !== 'AUDIOGRAM';

const EncounterGroupRow = ({ group, patientId }: EncounterGroupRowProps) => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const [isExpanded, setIsExpanded] = useState(false);
    const isSingleItem = group.items.length === 1;
    const singleItem = group.items[0];

    if (isSingleItem) {
        return (
            <div
                onClick={() => {
                    if (isNavigableRecord(singleItem.type)) {
                        navigation.patients.viewControl(patientId, singleItem.id);
                    }
                }}
                className={`bg-white p-4 md:p-5 rounded-app-lg md:rounded-app-md border border-neutral-100 transition-all flex items-center gap-3 md:gap-6 group ${isNavigableRecord(singleItem.type) ? 'hover:border-primary/40 cursor-pointer' : ''}`}
            >
                <div className="shrink-0">
                    <Typography variant={TypographyVariant.OVERLINE} inline className={`px-2 py-1 rounded-lg border ${getTypeStyle(singleItem.type as ControlType)}`}>
                        {singleItem.type}
                    </Typography>
                    <Typography variant={TypographyVariant.CAPTION} className="text-[10px] text-neutral-400 font-bold mt-2 uppercase tracking-tight whitespace-nowrap">
                        {singleItem.date}
                    </Typography>
                </div>
                <div className="flex-1 min-w-0">
                    <Typography variant={TypographyVariant.BODY} className="text-sm font-bold text-neutral-700 group-hover:text-primary transition-colors line-clamp-2">
                        {singleItem.note}
                    </Typography>
                </div>
                <ChevronRightIcon className="h-4 w-4 text-neutral-300 group-hover:translate-x-1 transition-transform shrink-0" />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-app-lg md:rounded-app-md border border-neutral-100 overflow-hidden">
            <button
                onClick={() => setIsExpanded((expanded) => !expanded)}
                className="w-full p-4 md:p-5 flex items-center gap-3 md:gap-6 hover:bg-neutral-50 transition-colors text-left"
            >
                <div className="shrink-0">
                    <Typography variant={TypographyVariant.OVERLINE} inline className="px-2 py-1 rounded-lg border bg-neutral-50 text-neutral-600 border-neutral-100">
                        {group.especialidad}
                    </Typography>
                    <Typography variant={TypographyVariant.CAPTION} className="text-[10px] text-neutral-400 font-bold mt-2 uppercase tracking-tight whitespace-nowrap">
                        {group.date}
                    </Typography>
                </div>
                <div className="flex-1 min-w-0">
                    <Typography variant={TypographyVariant.BODY} className="text-sm font-bold text-neutral-700 line-clamp-2">
                        {t(TEXT.PATIENTS.DETAIL.HISTORY.ENCOUNTER_ITEM_COUNT, { count: group.items.length })}
                    </Typography>
                </div>
                {isExpanded ? <ChevronUp className="h-4 w-4 text-neutral-300 shrink-0" /> : <ChevronDown className="h-4 w-4 text-neutral-300 shrink-0" />}
            </button>

            {isExpanded && (
                <div className="border-t border-neutral-100 divide-y divide-neutral-50">
                    {group.items.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => {
                                if (isNavigableRecord(item.type)) {
                                    navigation.patients.viewControl(patientId, item.id);
                                }
                            }}
                            className={`p-4 md:p-5 flex items-center gap-3 md:gap-6 group ${isNavigableRecord(item.type) ? 'hover:bg-neutral-50 cursor-pointer' : ''}`}
                        >
                            <div className="shrink-0">
                                <Typography variant={TypographyVariant.OVERLINE} inline className={`px-2 py-1 rounded-lg border ${getTypeStyle(item.type as ControlType)}`}>
                                    {item.type}
                                </Typography>
                            </div>
                            <div className="flex-1 min-w-0">
                                <Typography variant={TypographyVariant.BODY} className="text-sm font-bold text-neutral-700 group-hover:text-primary transition-colors line-clamp-2">
                                    {item.note}
                                </Typography>
                            </div>
                            {isNavigableRecord(item.type) && (
                                <ChevronRightIcon className="h-4 w-4 text-neutral-300 group-hover:translate-x-1 transition-transform shrink-0" />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const getTypeStyle = (type: ControlType | string) => {
    switch (type) {
        case ControlType.AUDIOLOGY:
        case 'AUDIOGRAM': return "bg-accent/10 text-accent border-accent/20";
        case ControlType.DENTAL: return "bg-primary-soft text-primary border-primary-soft";
        case ControlType.GENERAL: return "bg-success/10 text-success border-success/20";
        default: return "bg-neutral-50 text-neutral-600 border-neutral-100";
    }
};

type BackgroundKey = keyof Omit<PatientBackgroundEntity, 'uuid' | 'patientUuid' | 'updatedAt' | 'notes'>;
const BACKGROUND_KEYS: BackgroundKey[] = [
  'earInfections', 'nasalSurgery', 'throatSurgery', 'earSurgery',
  'diabetes', 'cholesterol', 'highPressure', 'allergies',
  'rhinitis', 'vertigo', 'tinnitus', 'headacheNoise', 'cloggedEar',
];

const BACKGROUND_LABEL_KEYS: Record<BackgroundKey, string> = {
  earInfections: TEXT.PATIENTS.DETAIL.BACKGROUND.LABELS.EAR_INFECTIONS,
  nasalSurgery: TEXT.PATIENTS.DETAIL.BACKGROUND.LABELS.NASAL_SURGERY,
  throatSurgery: TEXT.PATIENTS.DETAIL.BACKGROUND.LABELS.THROAT_SURGERY,
  earSurgery: TEXT.PATIENTS.DETAIL.BACKGROUND.LABELS.EAR_SURGERY,
  diabetes: TEXT.PATIENTS.DETAIL.BACKGROUND.LABELS.DIABETES,
  cholesterol: TEXT.PATIENTS.DETAIL.BACKGROUND.LABELS.CHOLESTEROL,
  highPressure: TEXT.PATIENTS.DETAIL.BACKGROUND.LABELS.HIGH_PRESSURE,
  allergies: TEXT.PATIENTS.DETAIL.BACKGROUND.LABELS.ALLERGIES,
  rhinitis: TEXT.PATIENTS.DETAIL.BACKGROUND.LABELS.RHINITIS,
  vertigo: TEXT.PATIENTS.DETAIL.BACKGROUND.LABELS.VERTIGO,
  tinnitus: TEXT.PATIENTS.DETAIL.BACKGROUND.LABELS.TINNITUS,
  headacheNoise: TEXT.PATIENTS.DETAIL.BACKGROUND.LABELS.HEADACHE_NOISE,
  cloggedEar: TEXT.PATIENTS.DETAIL.BACKGROUND.LABELS.CLOGGED_EAR,
};

const BackgroundPanel = ({ patientUuid }: { patientUuid: string }) => {
  const { t } = useTranslation();
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
      onSuccess: () => { toast.success(t(TEXT.PATIENTS.DETAIL.BACKGROUND.SAVE_SUCCESS)); setIsOpen(false); },
      onError: () => toast.error(t(TEXT.PATIENTS.DETAIL.BACKGROUND.SAVE_ERROR)),
    });
  };

  const positiveCount = background ? BACKGROUND_KEYS.filter((k) => background[k]).length : 0;

  return (
    <div className="bg-white rounded-app-md border border-neutral-100 shadow-sm overflow-hidden">
      <button onClick={() => (isOpen ? setIsOpen(false) : handleOpen())} className="w-full flex items-center justify-between p-5 hover:bg-neutral-50 transition-colors">
        <div className="flex items-center gap-3">
          <Typography variant={TypographyVariant.BODY_BOLD} className="text-sm text-neutral-800">{t(TEXT.PATIENTS.DETAIL.BACKGROUND.TITLE)}</Typography>
          {positiveCount > 0 && (
            <Typography variant={TypographyVariant.CAPTION} inline className="px-2 py-0.5 bg-danger/10 text-danger border border-danger/20 rounded-lg font-black">
              {t(TEXT.PATIENTS.DETAIL.BACKGROUND.POSITIVE_COUNT, { count: positiveCount })}
            </Typography>
          )}
          {isLoading && <Typography variant={TypographyVariant.CAPTION} inline className="text-neutral-400 font-bold">{t(TEXT.PATIENTS.DETAIL.BACKGROUND.LOADING)}</Typography>}
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
                {t(BACKGROUND_LABEL_KEYS[key])}
              </label>
            ))}
          </div>
          <div className="mt-3">
            <Typography variant={TypographyVariant.OVERLINE} as="label" className="mb-1 block">{t(TEXT.PATIENTS.DETAIL.BACKGROUND.NOTES)}</Typography>
            <textarea
              value={values.notes ?? ''}
              onChange={(e) => setValues((prev) => prev ? { ...prev, notes: e.target.value || null } : prev)}
              rows={2}
              placeholder={t(TEXT.PATIENTS.DETAIL.BACKGROUND.NOTES_PLACEHOLDER)}
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-app-sm text-xs outline-none focus:border-primary/50 resize-none transition-all"
            />
          </div>
          <div className="flex justify-end gap-2 mt-3">
            <button onClick={() => setIsOpen(false)} className="flex items-center gap-1.5 px-4 py-2 text-neutral-400 hover:text-neutral-600 font-black text-[10px] uppercase tracking-widest transition-colors">
              <X size={12} /> {t(TEXT.GENERAL.BUTTONS.CANCEL)}
            </button>
            <button onClick={handleSave} disabled={isPending} className="flex items-center gap-1.5 px-5 py-2 bg-neutral-900 hover:bg-primary text-white rounded-app-sm font-black text-[10px] uppercase tracking-widest transition-all disabled:opacity-50">
              <Save size={12} /> {isPending ? t(TEXT.PATIENTS.DETAIL.DEVICES.SAVING) : t(TEXT.GENERAL.BUTTONS.SAVE)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const DevicesPanel = ({ patientUuid }: { patientUuid: string }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { data: devices, isLoading } = usePatientDevicesQuery(patientUuid);
  const { executeDeactivateDevice } = useDeactivatePatientDeviceMutation(patientUuid);
  const { executeUpdateUnit } = useUpdateProductUnitMutation();
  const [isOpen, setIsOpen] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const SIDE_LABELS: Record<string, string> = {
    OD: t(TEXT.PATIENTS.DETAIL.DEVICES.SIDE_OD),
    OI: t(TEXT.PATIENTS.DETAIL.DEVICES.SIDE_OI),
    AMBOS: t(TEXT.PATIENTS.DETAIL.DEVICES.SIDE_AMBOS),
  };

  const handleReturn = (device: PatientDevice) => {
    if (!window.confirm('¿Devolver este audífono? La unidad quedará disponible en inventario.')) return;

    executeDeactivateDevice(device.uuid, {
      onSuccess: () => {
        if (device.productUnitUuid) {
          executeUpdateUnit(
            { unitUuid: device.productUnitUuid, payload: { status: ProductUnitStatus.AVAILABLE } },
            {
              onSettled: () => {
                queryClient.invalidateQueries({ queryKey: ['fetchPatientDevices', patientUuid] });
              },
            },
          );
        } else {
          queryClient.invalidateQueries({ queryKey: ['fetchPatientDevices', patientUuid] });
        }
        toast.success('Audífono devuelto correctamente.');
      },
      onError: () => toast.error(t(TEXT.PATIENTS.DETAIL.DEVICES.DELETE_ERROR)),
    });
  };

  const activeDevices = (devices ?? []) as PatientDevice[];

  const formatWarrantyDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('es-CR', { day: '2-digit', month: 'short', year: 'numeric' });

  const isWarrantyExpired = (dateStr: string) => new Date(dateStr) < new Date();

  return (
    <>
      {showAssignModal && (
        <AssignDeviceUnitModal
          patientUuid={patientUuid}
          onClose={() => setShowAssignModal(false)}
          onSuccess={() => setShowAssignModal(false)}
        />
      )}

      <div className="bg-white rounded-app-md border border-neutral-100 shadow-sm overflow-hidden">
        <button onClick={() => setIsOpen((o) => !o)} className="w-full flex items-center justify-between p-5 hover:bg-neutral-50 transition-colors">
          <div className="flex items-center gap-3">
            <Headphones className="h-4 w-4 text-neutral-500" />
            <Typography variant={TypographyVariant.BODY_BOLD} className="text-sm text-neutral-800">{t(TEXT.PATIENTS.DETAIL.DEVICES.TITLE)}</Typography>
            {!isLoading && <Typography variant={TypographyVariant.CAPTION} inline className="px-2 py-0.5 bg-neutral-100 text-neutral-500 rounded-lg font-black">{activeDevices.length}</Typography>}
          </div>
          {isOpen ? <ChevronUp className="h-4 w-4 text-neutral-400" /> : <ChevronDown className="h-4 w-4 text-neutral-400" />}
        </button>

        {isOpen && (
          <div className="px-5 pb-5 border-t border-neutral-100 space-y-3 mt-4">
            {isLoading ? (
              <Typography variant={TypographyVariant.HELPER} className="text-center py-4">{t(TEXT.PATIENTS.DETAIL.DEVICES.LOADING)}</Typography>
            ) : activeDevices.length === 0 ? (
              <Typography variant={TypographyVariant.HELPER} className="italic text-center py-4">{t(TEXT.PATIENTS.DETAIL.DEVICES.EMPTY)}</Typography>
            ) : (
              activeDevices.map((device) => (
                <div key={device.uuid} className="bg-neutral-50 rounded-app-md border border-neutral-100 overflow-hidden">
                  {/* Foto del dispositivo si existe */}
                  {device.photoUrl && (
                    <div className="w-full h-28 bg-neutral-100 overflow-hidden">
                      <img
                        src={device.photoUrl}
                        alt={`${device.brand ?? ''} ${device.model ?? ''}`}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                  )}
                  <div className="p-3.5 space-y-2">
                    {/* Oído + nombre */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Typography variant={TypographyVariant.OVERLINE} inline className="bg-primary-soft text-primary-dark px-2 py-0.5 rounded-lg">
                            {SIDE_LABELS[device.side]}
                          </Typography>
                          {device.brand && (
                            <Typography variant={TypographyVariant.CAPTION} inline className="font-bold text-neutral-700">
                              {device.brand}{device.model ? ` ${device.model}` : ''}
                            </Typography>
                          )}
                        </div>

                        {/* Serial */}
                        {device.serialNumber && (
                          <div className="flex items-center gap-1.5">
                            <Barcode size={11} className="text-neutral-400 shrink-0" />
                            <Typography variant={TypographyVariant.CAPTION} className="text-neutral-500 font-mono">
                              {device.serialNumber}
                            </Typography>
                          </div>
                        )}

                        {/* Garantía */}
                        {device.warrantyUntil && (
                          <div className="flex items-center gap-1.5">
                            <ShieldCheck size={11} className={isWarrantyExpired(device.warrantyUntil) ? 'text-danger shrink-0' : 'text-success shrink-0'} />
                            <Typography variant={TypographyVariant.CAPTION} className={isWarrantyExpired(device.warrantyUntil) ? 'text-danger' : 'text-neutral-500'}>
                              Garantía hasta {formatWarrantyDate(device.warrantyUntil)}
                              {isWarrantyExpired(device.warrantyUntil) && ' (vencida)'}
                            </Typography>
                          </div>
                        )}
                      </div>

                      {/* Acciones */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleReturn(device)}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-neutral-400 hover:text-primary hover:bg-primary-soft rounded-app-sm transition-all text-[10px] font-black uppercase tracking-widest"
                          title="Devolver audífono"
                        >
                          <RotateCcw size={11} />
                          <span>Devolver</span>
                        </button>
                        <button
                          onClick={() => {
                            if (!window.confirm(t(TEXT.PATIENTS.DETAIL.DEVICES.DELETE_CONFIRM))) return;
                            executeDeactivateDevice(device.uuid, {
                              onSuccess: () => {
                                toast.success(t(TEXT.PATIENTS.DETAIL.DEVICES.DELETE_SUCCESS));
                                queryClient.invalidateQueries({ queryKey: ['fetchPatientDevices', patientUuid] });
                              },
                              onError: () => toast.error(t(TEXT.PATIENTS.DETAIL.DEVICES.DELETE_ERROR)),
                            });
                          }}
                          className="p-1.5 text-neutral-300 hover:text-danger hover:bg-danger/10 rounded-app-sm transition-all"
                          title="Eliminar registro"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            <button
              onClick={() => setShowAssignModal(true)}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 border border-dashed border-neutral-200 rounded-app-md text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:border-primary/40 hover:text-primary transition-all"
            >
              <Plus size={12} /> {t(TEXT.PATIENTS.DETAIL.DEVICES.ADD)}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

interface AppointmentModalData {
  uuid: string;
  status: AppointmentStatus;
  schedule: { date: string; startTime: string; endTime: string };
  notes?: string;
  type?: { name: string };
}

interface AppointmentModalProps {
  patientUuid: string;
  existingAppointment: AppointmentModalData | null;
  onClose: () => void;
  onSaved: () => void;
}

function AppointmentModal({ patientUuid, existingAppointment, onClose, onSaved }: AppointmentModalProps) {
  const { user } = useSession();
  const { data: appointmentTypes, isLoading: isLoadingTypes } = useAppointmentTypesQuery();
  const { executeCreateAppointment, isPending: isCreating } = useCreateAppointmentMutation();
  const { executeUpdateAppointment, isPending: isUpdating } = useUpdateAppointmentMutation();
  const { t } = useTranslation();

  const isReschedule = !!existingAppointment;
  const isPending = isCreating || isUpdating;

  const types = (appointmentTypes as AppointmentType[] ?? []);

  const [form, setForm] = useState({
    typeId: '',
    date: existingAppointment ? new Date(existingAppointment.schedule.date).toISOString().split('T')[0] : '',
    startTime: existingAppointment ? new Date(existingAppointment.schedule.startTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false }) : '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.date || !form.startTime) {
      toast.error('Completa fecha y hora.');
      return;
    }
    const startDateTime = new Date(`${form.date}T${form.startTime}:00`);
    const endDateTime = new Date(startDateTime.getTime() + 30 * 60000);

    if (isReschedule) {
      executeUpdateAppointment(
        {
          uuid: existingAppointment.uuid,
          date: new Date(`${form.date}T00:00:00.000Z`).toISOString(),
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
          status: existingAppointment.status,
        },
        {
          onSuccess: () => { toast.success('Cita reagendada correctamente.'); onSaved(); },
          onError: () => toast.error('Error al reagendar la cita.'),
        }
      );
    } else {
      if (!form.typeId) { toast.error('Selecciona un tipo de cita.'); return; }
      executeCreateAppointment(
        {
          patientUUID: patientUuid,
          typeUUID: form.typeId,
          speciality: user?.specialty ? userSpecialtyToMedicalSpeciality[user.specialty] : MedicalSpeciality.GENERAL,
          status: AppointmentStatus.PENDING,
          date: new Date(`${form.date}T00:00:00.000Z`).toISOString(),
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
          notes: '',
        },
        {
          onSuccess: () => { toast.success('Cita agendada correctamente.'); onSaved(); },
          onError: () => toast.error('Error al agendar la cita.'),
        }
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-app-xl shadow-2xl w-full max-w-md p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <Typography variant={TypographyVariant.ACCENT} className="text-neutral-900">
            {isReschedule ? 'Reagendar Cita' : 'Agendar Nueva Cita'}
          </Typography>
          <button onClick={onClose} className="p-1.5 rounded-app-sm hover:bg-neutral-100 text-neutral-400 transition-colors">
            <X size={16} />
          </button>
        </div>

        {isReschedule && existingAppointment.type?.name && (
          <div className="px-4 py-3 bg-primary-soft rounded-app-md">
            <Typography variant={TypographyVariant.CAPTION} className="text-primary font-bold">
              {existingAppointment.type.name}
            </Typography>
            <Typography variant={TypographyVariant.CAPTION} className="text-primary/70 text-[10px]">
              Cita actual: {new Date(existingAppointment.schedule.startTime).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
            </Typography>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isReschedule && (
            <div>
              <Typography variant={TypographyVariant.OVERLINE} as="label" className="mb-1.5 block text-[11px] font-bold tracking-widest uppercase text-neutral-500">
                Tipo de Cita
              </Typography>
              {isLoadingTypes ? (
                <div className="h-12 bg-neutral-50 rounded-app-md animate-pulse" />
              ) : (
                <select
                  required
                  value={form.typeId}
                  onChange={(e) => setForm((f) => ({ ...f, typeId: e.target.value }))}
                  className="w-full p-3.5 bg-neutral-50 border-2 border-transparent focus:border-primary rounded-app-md text-sm outline-none transition-all"
                >
                  <option value="">¿Qué realizaremos hoy?</option>
                  {types.map((type) => (
                    <option key={type.uuid} value={type.uuid}>{type.name}</option>
                  ))}
                </select>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Typography variant={TypographyVariant.OVERLINE} as="label" className="mb-1.5 block text-[11px] font-bold tracking-widest uppercase text-neutral-500">
                Fecha
              </Typography>
              <input
                required
                type="date"
                value={form.date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className="w-full p-3.5 bg-neutral-50 border-2 border-transparent focus:border-primary rounded-app-md text-sm outline-none transition-all"
              />
            </div>
            <div>
              <Typography variant={TypographyVariant.OVERLINE} as="label" className="mb-1.5 block text-[11px] font-bold tracking-widest uppercase text-neutral-500">
                Hora
              </Typography>
              <input
                required
                type="time"
                value={form.startTime}
                onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
                className="w-full p-3.5 bg-neutral-50 border-2 border-transparent focus:border-primary rounded-app-md text-sm outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} disabled={isPending} className="flex-1 py-3 border border-neutral-200 rounded-app-md text-sm font-bold text-neutral-500 hover:bg-neutral-50 transition-all disabled:opacity-50">
              {t(TEXT.GENERAL.BUTTONS.CANCEL)}
            </button>
            <button type="submit" disabled={isPending} className="flex-1 py-3 bg-primary hover:bg-primary-dark text-white rounded-app-md text-sm font-bold transition-all disabled:opacity-50">
              {isPending ? 'Guardando...' : isReschedule ? 'Reagendar' : 'Agendar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export const PatientDetailContainer = ({ id }: { id: string }) => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const [isLinkDeviceOpen, setIsLinkDeviceOpen] = useState(false);
    const [isConfirmDelete, setIsConfirmDelete] = useState(false);
    const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
    const [isVisitPanelOpen, setIsVisitPanelOpen] = useState(false);
    const [isContextOpen, setIsContextOpen] = useState(false);
    const queryClient = useQueryClient();
    const { user, tenant } = useSession();
    const canStartConsulta = user?.role && user.role !== UserRole.STAFF;
    // STAFF (recepción) ve agenda, contacto y documentos administrativos, pero no
    // notas clínicas, estudios ni antecedentes (Ley 8968 — datos de salud sensibles).
    const canReadClinicalData = user?.role !== UserRole.STAFF;
    const isAdmin = user?.role === UserRole.OWNER || user?.role === UserRole.ADMIN;
    // Dispositivos, mantenimientos y audiograma son módulos de audiología —
    // una clínica de psicología no los usa (DOMAIN_ANALYSIS.md §4.8).
    const isAudiologyTenant = tenant?.businessType === BusinessType.AUDIOLOGY;
    const { deletePatient, isPending: isDeletingPatient } = useDeletePatientMutation();

    const {
        patient, history, groupedHistory, summary, isLoading, isFetching,
        hasMore, searchTerm, setSearchTerm, selectedSpec, setSelectedSpec, loadMore,
        latestAudiogramThresholds, recordTypeFilter, setRecordTypeFilter, nextAppointmentData,
    } = usePatientDetail(id, canReadClinicalData);

    const { data: background } = usePatientBackgroundQuery(id, canReadClinicalData);

    // La especialidad de quien atiende determina qué se CREA en la visita
    // (NOM-004 5.14: nunca qué se puede ver).
    const visitSpeciality: MedicalSpeciality = user?.specialty
        ? userSpecialtyToMedicalSpeciality[user.specialty]
        : MedicalSpeciality.GENERAL;

    // Solo lo accionable llega aquí — una fecha que no requiere acción no es una alerta.
    const alerts = useMemo(() => {
        const items: PatientAlert[] = [];

        if (!nextAppointmentData) {
            items.push({
                key: 'no-appointment',
                label: t(TEXT.PATIENTS.DETAIL.ALERTS.NO_APPOINTMENT),
                icon: <CalendarIcon className="h-3.5 w-3.5 shrink-0" />,
                styleClassName: 'bg-primary-soft/50 border-primary/20 text-primary',
                onClick: () => setIsAppointmentModalOpen(true),
            });
        }

        if (isAudiologyTenant) {
            const overdueMaintenance = summary.pendingMaintenance.find(
                (maintenance) => maintenance.nextMaintenanceAt && new Date(maintenance.nextMaintenanceAt) < new Date(),
            );
            if (overdueMaintenance?.nextMaintenanceAt) {
                items.push({
                    key: 'maintenance-due',
                    label: t(TEXT.PATIENTS.DETAIL.ALERTS.MAINTENANCE_DUE, {
                        date: new Date(overdueMaintenance.nextMaintenanceAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
                    }),
                    icon: <WrenchScrewdriverIcon className="h-3.5 w-3.5 shrink-0" />,
                    styleClassName: 'bg-warning/10 border-warning/30 text-warning',
                    onClick: () => navigation.maintenance.listFromPatient(id),
                });
            }
        }

        const positiveBackgroundCount = background
            ? BACKGROUND_KEYS.filter((key) => background[key]).length
            : 0;
        if (positiveBackgroundCount > 0) {
            items.push({
                key: 'background',
                label: t(TEXT.PATIENTS.DETAIL.ALERTS.BACKGROUND_POSITIVE, { count: positiveBackgroundCount }),
                icon: <ShieldCheckIcon className="h-3.5 w-3.5 shrink-0" />,
                styleClassName: 'bg-danger/10 border-danger/30 text-danger',
                onClick: () => setIsContextOpen(true),
            });
        }

        return items;
    }, [nextAppointmentData, isAudiologyTenant, summary.pendingMaintenance, background, t, navigation, id]);

    if (isLoading || !patient) return (
        <div className="p-20 text-center animate-pulse text-neutral-400 font-bold uppercase tracking-widest">
            {t(TEXT.PATIENTS.DETAIL.LOADING)}
        </div>
    );

    // El filtro por especialidad es una preferencia de vista del usuario, no una
    // restricción de lectura (NOM-004 5.14): siempre se ofrecen todas las especialidades.
    const specialityOptions = Object.values(MedicalSpeciality);

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
                            <HeaderInfo icon={<IdentificationIcon className="h-3.5 w-3.5" />} text={patient.documentId ?? patient.uuid.split('-')[0].toUpperCase()} />
                            {patient.birthDate && (
                                <HeaderInfo icon={<CakeIcon className="h-3.5 w-3.5" />} text={t(TEXT.PATIENTS.DETAIL.AGE_YEARS, { age: calculateAge(patient.birthDate) })} />
                            )}
                            <HeaderInfo icon={<PhoneIcon className="h-3.5 w-3.5" />} text={patient.phone} />
                            <HeaderInfo icon={<EnvelopeIcon className="h-3.5 w-3.5" />} text={patient.email ?? t(TEXT.PATIENTS.DETAIL.NO_EMAIL)} isWarning={!patient.email} />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    {isAdmin && !isConfirmDelete && (
                        <button
                            onClick={() => setIsConfirmDelete(true)}
                            className="flex items-center justify-center gap-1.5 border border-danger/30 text-danger px-4 h-10 rounded-app-sm font-black text-[10px] uppercase tracking-widest hover:bg-danger/10 transition-all flex-1 sm:flex-none"
                        >
                            {t(TEXT.PATIENTS.DETAIL.DEACTIVATE)}
                        </button>
                    )}
                    {isAdmin && isConfirmDelete && (
                        <div className="flex items-center gap-2 border border-danger/30 bg-danger/10 px-4 h-10 rounded-app-sm flex-1 sm:flex-none">
                            <Typography variant={TypographyVariant.OVERLINE} inline className="text-danger">{t(TEXT.PATIENTS.DETAIL.DEACTIVATE_CONFIRM)}</Typography>
                            <button
                                disabled={isDeletingPatient}
                                onClick={async () => {
                                    try {
                                        await deletePatient(id);
                                        toast.success(t(TEXT.PATIENTS.DETAIL.DEACTIVATE_SUCCESS));
                                        navigation.patients.list();
                                    } catch {
                                        toast.error(t(TEXT.PATIENTS.DETAIL.DEACTIVATE_ERROR));
                                        setIsConfirmDelete(false);
                                    }
                                }}
                                className="text-[10px] font-black text-white bg-danger hover:bg-danger/80 px-3 py-1 rounded-lg uppercase tracking-widest transition-all disabled:opacity-50"
                            >
                                {isDeletingPatient ? '...' : t(TEXT.PATIENTS.DETAIL.CONFIRM_YES)}
                            </button>
                            <button onClick={() => setIsConfirmDelete(false)} className="text-[10px] font-black text-neutral-500 hover:text-neutral-700 uppercase tracking-widest">{t(TEXT.PATIENTS.DETAIL.CONFIRM_NO)}</button>
                        </div>
                    )}
                    <button
                        onClick={() => setIsLinkDeviceOpen(true)}
                        className="flex items-center justify-center gap-1.5 border border-neutral-200 text-neutral-600 px-4 h-10 rounded-app-sm font-black text-[10px] uppercase tracking-widest hover:bg-neutral-50 hover:border-neutral-300 transition-all flex-1 sm:flex-none"
                    >
                        <Link className="h-4 w-4 shrink-0" />
                        <Typography variant={TypographyVariant.CAPTION} inline className="truncate font-black">
                            {patient.linkedProductUuid ? t(TEXT.PATIENTS.DETAIL.CHANGE_DEVICE) : t(TEXT.PATIENTS.DETAIL.LINK_DEVICE)}
                        </Typography>
                    </button>
                    <button
                        onClick={() => navigation.patients.ficha(id)}
                        className="flex items-center justify-center gap-1.5 border border-neutral-200 text-neutral-600 px-4 h-10 rounded-app-sm font-black text-[10px] uppercase tracking-widest hover:bg-neutral-50 hover:border-neutral-300 transition-all flex-1 sm:flex-none"
                    >
                        <ClipboardList className="h-4 w-4 shrink-0" />
                        <Typography variant={TypographyVariant.CAPTION} inline className="truncate font-black">{t(TEXT.PATIENTS.DETAIL.VIEW_FULL_FILE)}</Typography>
                    </button>
                    {canStartConsulta && (
                        <Button variant={ButtonVariant.PRIMARY} className="rounded-app-sm px-5 h-10 shadow-lg shadow-primary-soft flex-1 sm:flex-none" onClick={() => setIsVisitPanelOpen(true)}>
                            <PlusIcon className="h-4 w-4 mr-2 shrink-0" />
                            <Typography variant={TypographyVariant.CAPTION} inline className="font-bold uppercase tracking-tight">{t(TEXT.PATIENTS.DETAIL.START_CONSULTA)}</Typography>
                        </Button>
                    )}
                </div>
            </div>

            {/* ALERTAS — solo lo accionable. Reemplaza las 3 stat cards, que ocupaban
                un tercio de pantalla para mostrar 3 fechas que casi nunca requieren acción. */}
            {alerts.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {alerts.map((alert) => (
                        <button
                            key={alert.key}
                            onClick={alert.onClick}
                            disabled={!alert.onClick}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-app-sm border text-left transition-all ${alert.styleClassName} ${alert.onClick ? 'hover:brightness-95 cursor-pointer' : 'cursor-default'}`}
                        >
                            {alert.icon}
                            <Typography variant={TypographyVariant.CAPTION} inline className="text-[11px] font-bold">
                                {alert.label}
                            </Typography>
                        </button>
                    ))}
                </div>
            )}

            {/* CRONOLOGÍA — lo primero que se consulta al abrir un expediente.
                Sube por encima del contexto clínico: es el 80% de las lecturas. */}
            <div className="space-y-6">
                <Typography variant={TypographyVariant.CAPTION} className="text-[9px] font-black uppercase tracking-widest text-neutral-400 ml-1">
                    {t(TEXT.PATIENTS.DETAIL.LEVELS.TIMELINE)}
                </Typography>

                {/* HISTORIAL CLÍNICO — STAFF no tiene acceso a notas clínicas ni estudios */}
                {canReadClinicalData && (
                <div className="space-y-4">
                    <div className="flex flex-col gap-3 bg-white p-4 rounded-app-md border border-neutral-100 shadow-sm">
                        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                            <SpecFilterButton label={t(TEXT.PATIENTS.DETAIL.HISTORY.FILTER_ALL)} isActive={recordTypeFilter === 'ALL'} onClick={() => setRecordTypeFilter('ALL')} />
                            <SpecFilterButton label={t(TEXT.PATIENTS.DETAIL.HISTORY.FILTER_CONTROLS)} isActive={recordTypeFilter === 'CONTROL'} onClick={() => setRecordTypeFilter('CONTROL')} />
                            {isAudiologyTenant && (
                                <SpecFilterButton label={t(TEXT.PATIENTS.DETAIL.HISTORY.FILTER_AUDIOGRAMS)} isActive={recordTypeFilter === 'AUDIOGRAM'} onClick={() => setRecordTypeFilter('AUDIOGRAM')} />
                            )}
                            {isAudiologyTenant && (
                                <SpecFilterButton label={t(TEXT.PATIENTS.DETAIL.HISTORY.FILTER_MAINTENANCE)} isActive={recordTypeFilter === 'MAINTENANCE'} onClick={() => setRecordTypeFilter('MAINTENANCE')} />
                            )}
                        </div>
                        {specialityOptions.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                                <SpecFilterButton label={t(TEXT.PATIENTS.DETAIL.HISTORY.FILTER_ALL_SPECIALTY)} isActive={selectedSpec === 'ALL'} onClick={() => setSelectedSpec('ALL')} />
                                {specialityOptions.map((spec) => (
                                    <SpecFilterButton key={spec} label={spec} isActive={selectedSpec === spec} onClick={() => setSelectedSpec(spec)} />
                                ))}
                            </div>
                        )}
                        <div className="relative w-full">
                            <MagnifyingGlassIcon className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                            <input
                                type="text"
                                placeholder={t(TEXT.PATIENTS.DETAIL.HISTORY.SEARCH_PLACEHOLDER)}
                                className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-app-sm text-xs outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                            />
                        </div>
                    </div>

                    {/* AUDIOGRAMA MÁS RECIENTE */}
                    {isAudiologyTenant && latestAudiogramThresholds.length > 0 && (
                        <div className="bg-white p-5 rounded-app-md border border-neutral-100 shadow-sm space-y-4">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <Typography variant={TypographyVariant.BODY_BOLD} className="text-sm text-neutral-800">
                                        {t(TEXT.PATIENTS.DETAIL.HISTORY.LATEST_AUDIOGRAM)}
                                    </Typography>
                                    <Typography variant={TypographyVariant.CAPTION} className="text-[10px] text-neutral-400 font-medium">
                                        {history.find(record => record.type === 'AUDIOGRAM')?.date ?? ''}
                                    </Typography>
                                </div>
                                <div className="flex gap-2">
                                    {[Ear.RIGHT, Ear.LEFT].map((ear) => {
                                        const classification = classifyHearingLoss(latestAudiogramThresholds, ear);
                                        if (!classification) return null;
                                        const gradeColor = HEARING_LOSS_GRADE_COLOR[classification.grade];
                                        return (
                                            <div
                                                key={ear}
                                                className="px-2.5 py-1.5 rounded-app-sm text-center"
                                                style={{ backgroundColor: `${gradeColor}12`, border: `1px solid ${gradeColor}30` }}
                                            >
                                                <div className="text-[8px] font-black uppercase tracking-widest text-neutral-400">{ear}</div>
                                                <div className="text-[10px] font-black" style={{ color: gradeColor }}>
                                                    {t(HEARING_LOSS_GRADE_LABEL_KEYS[classification.grade])}
                                                </div>
                                                <div className="text-[8px] text-neutral-400">{classification.pureToneAverage} dB</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="overflow-x-auto -mx-1">
                                <div className="min-w-[420px] px-1">
                                    <AudiogramChart thresholds={latestAudiogramThresholds} isReadOnly isCompact />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* REGISTROS — agrupados por encuentro (una visita = una entrada) */}
                    <div className="space-y-3">
                        {groupedHistory.length === 0 ? (
                            <div className="py-16 text-center bg-white rounded-app-xl border border-dashed border-neutral-200 text-neutral-400 text-xs font-bold uppercase tracking-widest">
                                {t(TEXT.PATIENTS.DETAIL.HISTORY.EMPTY)}
                            </div>
                        ) : (
                            <>
                                {groupedHistory.map((group) => (
                                    <EncounterGroupRow key={group.encounterUuid} group={group} patientId={id} />
                                ))}
                                {hasMore && (
                                    <button
                                        onClick={loadMore}
                                        disabled={isFetching}
                                        className="w-full py-3 text-center text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-primary border border-dashed border-neutral-200 rounded-app-lg hover:border-primary/40 transition-all disabled:opacity-50"
                                    >
                                        {isFetching ? t(TEXT.PATIENTS.DETAIL.HISTORY.LOADING) : t(TEXT.PATIENTS.DETAIL.HISTORY.LOAD_MORE)}
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
                )}

                {/* DOCUMENTOS — visible para todos los roles, incluido STAFF (administrativo).
                    Vínculo a un encuentro es opcional; la mayoría no nace de una visita
                    (facturas, garantías) — DocumentsContainer nunca lo exige al subir. */}
                <div className="bg-white rounded-app-md border border-neutral-100 shadow-sm p-5">
                    <Typography variant={TypographyVariant.BODY_BOLD} className="text-sm text-neutral-800 mb-4">
                        {t(TEXT.PATIENTS.DETAIL.DOCUMENTS.TITLE)}
                    </Typography>
                    <DocumentsContainer patientId={id} />
                </div>
            </div>

            {/* CONTEXTO CLÍNICO — antecedentes y audífonos son estado permanente,
                no eventos. Se consultan al atender, no en cada lectura → colapsado.
                Lo crítico (antecedentes positivos) ya subió a la línea de alertas. */}
            {(canReadClinicalData || isAudiologyTenant) && (
            <div className="space-y-3">
                <button
                    onClick={() => setIsContextOpen((open) => !open)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-app-md border border-neutral-100 shadow-sm hover:border-neutral-300 transition-all"
                >
                    <div className="flex items-center gap-2.5 min-w-0">
                        <ClipboardList className="h-4 w-4 text-neutral-400 shrink-0" />
                        <Typography variant={TypographyVariant.BODY_BOLD} className="text-sm text-neutral-800">
                            {t(TEXT.PATIENTS.DETAIL.CONTEXT.TITLE)}
                        </Typography>
                        {!isContextOpen && (
                            <Typography variant={TypographyVariant.CAPTION} inline className="text-[10px] text-neutral-400 truncate hidden sm:inline">
                                {t(TEXT.PATIENTS.DETAIL.CONTEXT.SHOW)}
                            </Typography>
                        )}
                    </div>
                    {isContextOpen ? <ChevronUp className="h-4 w-4 text-neutral-400 shrink-0" /> : <ChevronDown className="h-4 w-4 text-neutral-400 shrink-0" />}
                </button>

                {isContextOpen && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {canReadClinicalData && <BackgroundPanel patientUuid={id} />}
                        {isAudiologyTenant && <DevicesPanel patientUuid={id} />}
                    </div>
                )}
            </div>
            )}
        </div>

        {isVisitPanelOpen && canStartConsulta && (
            <VisitPanel
                patientUuid={id}
                speciality={visitSpeciality}
                isAudiologyTenant={isAudiologyTenant}
                onClose={() => {
                    setIsVisitPanelOpen(false);
                    queryClient.invalidateQueries({ queryKey: [FETCH_CONTROLS_KEY, id] });
                    queryClient.invalidateQueries({ queryKey: [FETCH_ENCOUNTERS_BY_PATIENT_KEY, id] });
                    queryClient.invalidateQueries({ queryKey: [FETCH_STUDIES_BY_PATIENT_KEY, id] });
                    queryClient.invalidateQueries({ queryKey: [FETCH_MAINTENANCE_BY_PATIENT_KEY, id] });
                }}
            />
        )}

        {isLinkDeviceOpen && (
            <LinkDeviceModal
                patientUuid={id}
                currentLinkedProductUuid={patient.linkedProductUuid}
                onClose={() => setIsLinkDeviceOpen(false)}
                onSuccess={() => setIsLinkDeviceOpen(false)}
            />
        )}

        {isAppointmentModalOpen && (
            <AppointmentModal
                patientUuid={id}
                existingAppointment={nextAppointmentData as AppointmentModalData | null}
                onClose={() => setIsAppointmentModalOpen(false)}
                onSaved={() => {
                    setIsAppointmentModalOpen(false);
                    queryClient.invalidateQueries({ queryKey: [FETCH_APPOINTMENT_BY_PATIENT_KEY, id] });
                }}
            />
        )}
        </>
    );
};
