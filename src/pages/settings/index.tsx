import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import { TEXT } from '@/static/texts/i18n';
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
    <Typography variant={TypographyVariant.OVERLINE} className="ml-1 !text-neutral-400 !text-[9px]">
      {label}
    </Typography>
    <input
      value={value ?? ''}
      placeholder={placeholder}
      onChange={onChange}
      disabled={disabled}
      className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:border-primary focus:bg-white transition-all text-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
    />
  </div>
);

const SectionHeader = ({ icon: Icon, title }: { icon: React.ElementType; title: string }) => (
  <div className="flex items-center gap-2 mb-6 border-b border-neutral-50 pb-3">
    <Icon size={16} className="text-primary" strokeWidth={2.5} />
    <Typography variant={TypographyVariant.OVERLINE} className="!text-neutral-900">
      {title}
    </Typography>
  </div>
);

const BusinessSettingsPage: React.FC = () => {
  const { t } = useTranslation();
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
      toast.success(t(TEXT.SETTINGS.TOASTS.UPDATE_SUCCESS));
    }
  }, [isSuccess]);

  useEffect(() => {
    if (error) {
      toast.error(t(TEXT.SETTINGS.TOASTS.UPDATE_ERROR));
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
      <Head><title>{t(TEXT.SETTINGS.PAGE_TITLE)}</title></Head>
      <DashboardLayout isMainPage contentStyle={BoxedLayoutStyle.FULL} title={t(TEXT.SETTINGS.LAYOUT_TITLE)}>

        <div className="max-w-3xl mx-auto space-y-4 pb-16">

          {/* SECCIÓN 1: IDENTIDAD */}
          <div className="bg-white border border-neutral-100 rounded-app-xl p-8 shadow-sm">
            <SectionHeader icon={Building2} title={t(TEXT.SETTINGS.SECTIONS.IDENTITY)} />

            <div className="flex items-center gap-6 mb-6">
              <div
                onClick={() => !isUploadingLogo && logoInputRef.current?.click()}
                className="relative h-16 w-16 bg-neutral-50 border-2 border-dashed border-neutral-200 rounded-2xl flex flex-col items-center justify-center text-neutral-400 hover:border-primary/40 hover:text-primary transition-all cursor-pointer group shrink-0 overflow-hidden"
              >
                {logoUrl ? (
                  <>
                    <img src={logoUrl} className="h-full w-full object-contain p-1" alt="Logo" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setLogoUrl(''); }}
                      className="absolute top-0.5 right-0.5 p-0.5 bg-danger/20 text-danger rounded-lg hover:bg-danger hover:text-white transition-all"
                    >
                      <X size={10} />
                    </button>
                  </>
                ) : (
                  <>
                    <Upload size={18} />
                    <Typography variant={TypographyVariant.CAPTION} className="!text-[8px] font-black uppercase mt-1">{t(TEXT.SETTINGS.IDENTITY.LOGO_LABEL)}</Typography>
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
                      toast.success(t(TEXT.SETTINGS.TOASTS.LOGO_SUCCESS));
                    } catch {
                      toast.error(t(TEXT.SETTINGS.TOASTS.LOGO_ERROR));
                    }
                  }}
                />
              </div>
              <div className="w-full space-y-2">
                <CompactInput
                  label={t(TEXT.SETTINGS.IDENTITY.BUSINESS_NAME_LABEL)}
                  value={isLoading ? '' : businessName}
                  placeholder={isLoading ? t(TEXT.SETTINGS.SUBSCRIPTION.LOADING) : t(TEXT.SETTINGS.IDENTITY.BUSINESS_NAME_PLACEHOLDER)}
                  onChange={(event) => setBusinessName(event.target.value)}
                  disabled={isLoading}
                />
                <CompactInput
                  label={t(TEXT.SETTINGS.IDENTITY.LOGO_URL_LABEL)}
                  value={logoUrl}
                  placeholder={t(TEXT.SETTINGS.IDENTITY.LOGO_URL_PLACEHOLDER)}
                  onChange={(event) => setLogoUrl(event.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <CompactInput label={t(TEXT.SETTINGS.IDENTITY.LEGAL_NAME_LABEL)} placeholder={t(TEXT.SETTINGS.IDENTITY.LEGAL_NAME_PLACEHOLDER)} />
              <CompactInput label={t(TEXT.SETTINGS.IDENTITY.FISCAL_ID_LABEL)} placeholder={t(TEXT.SETTINGS.IDENTITY.FISCAL_ID_PLACEHOLDER)} />
            </div>

            {specialityLabel && (
              <div className="mt-4">
                <CompactInput
                  label={t(TEXT.SETTINGS.IDENTITY.SPECIALITY_LABEL)}
                  value={specialityLabel}
                  placeholder={t(TEXT.SETTINGS.IDENTITY.SPECIALITY_PLACEHOLDER)}
                  disabled
                />
              </div>
            )}
          </div>

          {/* SECCIÓN 2: UBICACIÓN */}
          <div className="bg-white border border-neutral-100 rounded-app-xl p-8 shadow-sm">
            <SectionHeader icon={MapPin} title={t(TEXT.SETTINGS.SECTIONS.LOCATION)} />
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <CompactInput label={t(TEXT.SETTINGS.LOCATION.CITY_LABEL)} placeholder={t(TEXT.SETTINGS.LOCATION.CITY_PLACEHOLDER)} />
                <CompactInput label={t(TEXT.SETTINGS.LOCATION.PHONE_LABEL)} placeholder={t(TEXT.SETTINGS.LOCATION.PHONE_PLACEHOLDER)} />
              </div>
              <CompactInput label={t(TEXT.SETTINGS.LOCATION.ADDRESS_LABEL)} placeholder={t(TEXT.SETTINGS.LOCATION.ADDRESS_PLACEHOLDER)} />
              <CompactInput label={t(TEXT.SETTINGS.LOCATION.WEBSITE_LABEL)} placeholder={t(TEXT.SETTINGS.LOCATION.WEBSITE_PLACEHOLDER)} />
            </div>
          </div>

          {/* SECCIÓN 3: LEGAL */}
          <div className="bg-white border border-neutral-100 rounded-app-xl p-8 shadow-sm">
            <SectionHeader icon={FileText} title={t(TEXT.SETTINGS.SECTIONS.LEGAL)} />

            <div className="grid grid-cols-2 gap-4 mb-6">
              <CompactInput label={t(TEXT.SETTINGS.LEGAL.LICENSE_LABEL)} placeholder={t(TEXT.SETTINGS.LEGAL.LICENSE_PLACEHOLDER)} />
              <CompactInput label={t(TEXT.SETTINGS.LEGAL.NOTIFICATION_EMAIL_LABEL)} placeholder={t(TEXT.SETTINGS.LEGAL.NOTIFICATION_EMAIL_PLACEHOLDER)} />
            </div>

            <div className="p-4 border-2 border-dashed border-neutral-100 rounded-2xl flex items-center justify-between bg-neutral-50/50 group hover:border-primary/20 transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white rounded-xl shadow-sm">
                  <PenTool size={18} className="text-neutral-400 group-hover:text-primary" />
                </div>
                <div>
                  <Typography variant={TypographyVariant.BODY_BOLD} className="!text-neutral-700 !text-xs">
                    {t(TEXT.SETTINGS.LEGAL.SIGNATURE_TITLE)}
                  </Typography>
                  <Typography variant={TypographyVariant.CAPTION} className="!text-[10px] italic">
                    {t(TEXT.SETTINGS.LEGAL.SIGNATURE_SUBTITLE)}
                  </Typography>
                </div>
              </div>
              <button className="bg-white border border-neutral-200 px-4 py-2 rounded-xl transition-all hover:bg-neutral-50 shadow-sm">
                <Typography variant={TypographyVariant.OVERLINE} className="!text-primary !text-[9px]">
                  {t(TEXT.SETTINGS.LEGAL.SIGNATURE_UPLOAD_BUTTON)}
                </Typography>
              </button>
            </div>
          </div>

          {/* SECCIÓN 4: SUSCRIPCIÓN */}
          <div className="bg-white border border-neutral-100 rounded-app-xl p-6 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-neutral-900 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-neutral-200">
                <CreditCard size={20} />
              </div>
              <div>
                <Typography variant={TypographyVariant.OVERLINE} className="!text-neutral-400 !text-[9px] block">
                  {t(TEXT.SETTINGS.SECTIONS.SUBSCRIPTION)}
                </Typography>
                <div className="flex items-center gap-2">
                  <Typography variant={TypographyVariant.BODY_BOLD} className="!text-neutral-800">
                    {isLoading ? t(TEXT.SETTINGS.SUBSCRIPTION.LOADING) : `${t(TEXT.SETTINGS.SUBSCRIPTION.PLAN_PREFIX)}${planLabel}`}
                  </Typography>
                  <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                  <Typography variant={TypographyVariant.CAPTION} className="!text-success font-black uppercase">
                    {t(TEXT.SETTINGS.SUBSCRIPTION.ACTIVE)}
                  </Typography>
                </div>
              </div>
            </div>
            <button className="flex items-center gap-2 bg-neutral-100 px-5 py-2.5 rounded-xl hover:bg-neutral-200 transition-all">
              <Typography variant={TypographyVariant.OVERLINE} className="!text-neutral-600 !text-[10px]">
                {t(TEXT.SETTINGS.SUBSCRIPTION.MANAGE_BUTTON)}
              </Typography>
              <Globe size={12} className="text-neutral-400" />
            </button>
          </div>

          {/* BOTONES DE ACCIÓN */}
          <div className="flex items-center justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={handleDiscard}
              className="px-6 py-2 hover:bg-neutral-50 rounded-xl transition-colors"
            >
              <Typography variant={TypographyVariant.OVERLINE} className="!text-neutral-400">
                {t(TEXT.SETTINGS.BUTTONS.DISCARD)}
              </Typography>
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isPending || isLoading}
              className="bg-primary text-white px-10 py-3.5 rounded-2xl shadow-xl shadow-primary-soft hover:bg-primary-dark hover:-translate-y-0.5 transition-all flex items-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <Loader2 size={16} strokeWidth={3} className="animate-spin" />
              ) : (
                <Check size={16} strokeWidth={3} />
              )}
              <Typography variant={TypographyVariant.OVERLINE} className="!text-white">
                {t(TEXT.SETTINGS.BUTTONS.SAVE)}
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
