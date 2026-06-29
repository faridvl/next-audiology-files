import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { authorizeServerSidePage } from '@/hocs/auth';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { useSession } from '@/hooks/use-session';
import { useUpdateTenantMutation } from '@/shared/api/mutations/tenants/update-tenant-mutation';
import { useUploadLogoMutation } from '@/shared/api/mutations/identity/use-upload-logo-mutation';
import { toast } from 'sonner';
import {
  Building2, CreditCard, PenTool, Check,
  MapPin, FileText, Globe, Upload, Loader2, X
} from 'lucide-react';

const specialityLabels: Record<string, string> = {
  AUDIOLOGY: 'Audiología',
  DENTAL: 'Odontología',
  GENERAL: 'Medicina General',
  DERMA: 'Dermatología',
};

const CompactInput = ({ label, value, placeholder, onChange, disabled }: {
  label: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="flex flex-col gap-1 w-full">
    <Typography variant={TypographyVariant.OVERLINE} className="ml-1 !text-slate-400 !text-[9px]">
      {label}
    </Typography>
    <input
      value={value ?? ''}
      placeholder={placeholder}
      onChange={onChange}
      disabled={disabled}
      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:border-[#1E3A8A] focus:bg-white transition-all text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
    />
  </div>
);

const SectionHeader = ({ icon: Icon, title }: { icon: React.ElementType; title: string }) => (
  <div className="flex items-center gap-2 mb-6 border-b border-slate-50 pb-3">
    <Icon size={16} className="text-[#1E3A8A]" strokeWidth={2.5} />
    <Typography variant={TypographyVariant.OVERLINE} className="!text-slate-900">
      {title}
    </Typography>
  </div>
);

const BusinessSettingsPage: React.FC = () => {
  const { tenant, isLoading } = useSession();
  const { executeUpdateTenant, isPending, isSuccess, error } = useUpdateTenantMutation();
  const { uploadLogo, isPending: isUploadingLogo } = useUploadLogoMutation(tenant?.uuid ?? '');

  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (tenant) {
      setBusinessName(tenant.businessName ?? '');
      setBusinessType(tenant.businessType ?? '');
      setLogoUrl(tenant.logoUrl ?? '');
    }
  }, [tenant]);

  useEffect(() => {
    if (isSuccess) {
      toast.success('Configuración actualizada correctamente');
    }
  }, [isSuccess]);

  useEffect(() => {
    if (error) {
      toast.error('Error al actualizar la configuración');
    }
  }, [error]);

  const specialityLabel = specialityLabels[businessType] ?? businessType;
  const planLabel = tenant?.plan ?? 'FREE';

  const handleSave = () => {
    if (!tenant?.uuid) return;
    executeUpdateTenant({
      uuid: tenant.uuid,
      businessName: businessName || undefined,
      businessType: businessType || undefined,
      logoUrl: logoUrl || null,
    });
  };

  const handleDiscard = () => {
    if (tenant) {
      setBusinessName(tenant.businessName ?? '');
      setBusinessType(tenant.businessType ?? '');
      setLogoUrl(tenant.logoUrl ?? '');
    }
  };

  return (
    <>
      <Head><title>Configuración de Clínica | Zynka</title></Head>
      <DashboardLayout isMainPage contentStyle={BoxedLayoutStyle.FULL} title="Configuración del Negocio">

        <div className="max-w-3xl mx-auto space-y-4 pb-16">

          {/* SECCIÓN 1: IDENTIDAD */}
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
            <SectionHeader icon={Building2} title="Identidad Institucional" />

            <div className="flex items-center gap-6 mb-6">
              <div
                onClick={() => !isUploadingLogo && logoInputRef.current?.click()}
                className="relative h-16 w-16 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:border-[#1E3A8A]/40 hover:text-[#1E3A8A] transition-all cursor-pointer group shrink-0 overflow-hidden"
              >
                {logoUrl ? (
                  <>
                    <img src={logoUrl} className="h-full w-full object-contain p-1" alt="Logo" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setLogoUrl(''); }}
                      className="absolute top-0.5 right-0.5 p-0.5 bg-red-100 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                    >
                      <X size={10} />
                    </button>
                  </>
                ) : (
                  <>
                    <Upload size={18} />
                    <Typography variant={TypographyVariant.CAPTION} className="!text-[8px] font-black uppercase mt-1">Logo</Typography>
                  </>
                )}
                <input
                  type="file"
                  ref={logoInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file || !tenant?.uuid) return;
                    try {
                      const result = await uploadLogo(file);
                      setLogoUrl(result.url);
                      toast.success('Logo subido correctamente');
                    } catch {
                      toast.error('Error al subir el logo');
                    }
                  }}
                />
              </div>
              <div className="w-full space-y-2">
                <CompactInput
                  label="Nombre Comercial de la Clínica"
                  value={isLoading ? '' : businessName}
                  placeholder={isLoading ? 'Cargando...' : 'Nombre de la clínica'}
                  onChange={(event) => setBusinessName(event.target.value)}
                  disabled={isLoading}
                />
                <CompactInput
                  label="URL del logo (imagen pública)"
                  value={logoUrl}
                  placeholder="https://ejemplo.com/logo.png"
                  onChange={(event) => setLogoUrl(event.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <CompactInput label="Razón Social / Nombre Legal" placeholder="Zynka Health S.A." />
              <CompactInput label="ID Fiscal / RUC" placeholder="1790000000001" />
            </div>

            {specialityLabel && (
              <div className="mt-4">
                <CompactInput
                  label="Especialidad Principal"
                  value={specialityLabel}
                  placeholder="Especialidad de la clínica"
                  disabled
                />
              </div>
            )}
          </div>

          {/* SECCIÓN 2: UBICACIÓN */}
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
            <SectionHeader icon={MapPin} title="Ubicación y Contacto" />
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <CompactInput label="Ciudad" placeholder="Ciudad" />
                <CompactInput label="Teléfono de Contacto" placeholder="+593 ..." />
              </div>
              <CompactInput label="Dirección Física" placeholder="Av. Amazonas y Naciones Unidas, Edificio Signature" />
              <CompactInput label="Sitio Web" placeholder="https://www.tuclinica.com" />
            </div>
          </div>

          {/* SECCIÓN 3: LEGAL */}
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
            <SectionHeader icon={FileText} title="Validación y Firmas" />

            <div className="grid grid-cols-2 gap-4 mb-6">
              <CompactInput label="Registro Sanitario / Licencia" placeholder="SESS-00123" />
              <CompactInput label="Correo de Notificaciones" placeholder="admin@clinica.com" />
            </div>

            <div className="p-4 border-2 border-dashed border-slate-100 rounded-2xl flex items-center justify-between bg-slate-50/50 group hover:border-[#1E3A8A]/20 transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white rounded-xl shadow-sm">
                  <PenTool size={18} className="text-slate-400 group-hover:text-[#1E3A8A]" />
                </div>
                <div>
                  <Typography variant={TypographyVariant.BODY_BOLD} className="!text-slate-700 !text-xs">
                    Firma del Representante
                  </Typography>
                  <Typography variant={TypographyVariant.CAPTION} className="!text-[10px] italic">
                    Para documentos institucionales
                  </Typography>
                </div>
              </div>
              <button className="bg-white border border-slate-200 px-4 py-2 rounded-xl transition-all hover:bg-slate-50 shadow-sm">
                <Typography variant={TypographyVariant.OVERLINE} className="!text-[#1E3A8A] !text-[9px]">
                  Cargar PNG
                </Typography>
              </button>
            </div>
          </div>

          {/* SECCIÓN 4: SUSCRIPCIÓN */}
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-slate-200">
                <CreditCard size={20} />
              </div>
              <div>
                <Typography variant={TypographyVariant.OVERLINE} className="!text-slate-400 !text-[9px] block">
                  Suscripción SaaS
                </Typography>
                <div className="flex items-center gap-2">
                  <Typography variant={TypographyVariant.BODY_BOLD} className="!text-slate-800">
                    {isLoading ? 'Cargando...' : `Plan ${planLabel}`}
                  </Typography>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <Typography variant={TypographyVariant.CAPTION} className="!text-emerald-500 font-black uppercase">
                    Activo
                  </Typography>
                </div>
              </div>
            </div>
            <button className="flex items-center gap-2 bg-slate-100 px-5 py-2.5 rounded-xl hover:bg-slate-200 transition-all">
              <Typography variant={TypographyVariant.OVERLINE} className="!text-slate-600 !text-[10px]">
                Gestionar
              </Typography>
              <Globe size={12} className="text-slate-400" />
            </button>
          </div>

          {/* BOTONES DE ACCIÓN */}
          <div className="flex items-center justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={handleDiscard}
              className="px-6 py-2 hover:bg-slate-50 rounded-xl transition-colors"
            >
              <Typography variant={TypographyVariant.OVERLINE} className="!text-slate-400">
                Descartar
              </Typography>
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isPending || isLoading}
              className="bg-[#1E3A8A] text-white px-10 py-3.5 rounded-2xl shadow-xl shadow-blue-200 hover:bg-[#152a63] hover:-translate-y-0.5 transition-all flex items-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <Loader2 size={16} strokeWidth={3} className="animate-spin" />
              ) : (
                <Check size={16} strokeWidth={3} />
              )}
              <Typography variant={TypographyVariant.OVERLINE} className="!text-white">
                Actualizar Clínica
              </Typography>
            </button>
          </div>

        </div>
      </DashboardLayout>
    </>
  );
};

export const getServerSideProps = authorizeServerSidePage();
export default BusinessSettingsPage;
