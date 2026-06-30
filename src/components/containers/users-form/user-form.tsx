import React from 'react';
import { useTranslation } from 'react-i18next';
import { Save, User, Mail, ShieldCheck, Stethoscope, Lock, Phone } from 'lucide-react';
import { useNavigation } from '@/hooks/use-navigation';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';
import { useUserForm } from './use-user-form';
import { UserRole, UserSpecialty } from '@/types/auth/auth';

interface SectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

function FormSection({ title, description, children }: SectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-8 border-b border-neutral-100 last:border-0">
      <div className="lg:col-span-1">
        <Typography variant={TypographyVariant.BODY_BOLD} className="text-neutral-800">
          {title}
        </Typography>
        <Typography variant={TypographyVariant.HELPER} className="mt-1 text-neutral-400 leading-relaxed">
          {description}
        </Typography>
      </div>
      <div className="lg:col-span-2 space-y-5">
        {children}
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  helper?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

function Field({ label, helper, error, required, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1">
        <Typography variant={TypographyVariant.OVERLINE} className="text-neutral-600">
          {label}
        </Typography>
        {required && <span className="text-danger text-xs">*</span>}
      </label>
      {children}
      {helper && !error && (
        <Typography variant={TypographyVariant.HELPER} className="text-neutral-400">
          {helper}
        </Typography>
      )}
      {error && (
        <Typography variant={TypographyVariant.HELPER} className="text-danger">
          {error}
        </Typography>
      )}
    </div>
  );
}

const inputBase =
  'w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-app-sm text-sm text-neutral-900 placeholder-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all';

const inputWithIcon =
  'w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-app-sm text-sm text-neutral-900 placeholder-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all';

const selectBase =
  'w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-app-sm text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all appearance-none';

export function UserFormContainer() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { form, onSubmit, isLoading, handlePhoneChange } = useUserForm();
  const { register, formState: { errors }, watch } = form;
  const phoneValue = watch('phoneNumber') ?? '';

  return (
    <form onSubmit={onSubmit} className="space-y-0 divide-y divide-neutral-100">

      {/* SECCIÓN: Acceso */}
      <FormSection
        title={t('users.create.sectionAccess')}
        description={t('users.create.sectionAccessDesc')}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field
            label={t('users.create.form.email')}
            error={errors.email?.message}
            required
          >
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-300" size={16} />
              <input
                {...register('email', { required: 'El correo es requerido.' })}
                type="email"
                className={inputWithIcon}
                placeholder={t('users.create.form.emailPlaceholder')}
                autoComplete="off"
              />
            </div>
          </Field>

          <Field
            label={t('users.create.form.password')}
            error={errors.password?.message}
          >
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-300" size={16} />
              <input
                {...register('password')}
                type="password"
                className={inputWithIcon}
                placeholder={t('users.create.form.passwordPlaceholder')}
                autoComplete="new-password"
              />
            </div>
          </Field>
        </div>
      </FormSection>

      {/* SECCIÓN: Perfil */}
      <FormSection
        title={t('users.create.sectionProfile')}
        description={t('users.create.sectionProfileDesc')}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field
            label={t('users.create.form.fullName')}
            error={errors.fullName?.message}
            required
          >
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-300" size={16} />
              <input
                {...register('fullName', { required: 'El nombre es requerido.' })}
                className={inputWithIcon}
                placeholder={t('users.create.form.fullNamePlaceholder')}
              />
            </div>
          </Field>

          <Field
            label={t('users.create.form.phoneNumber')}
            error={errors.phoneNumber?.message}
          >
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-300" size={16} />
              <input
                value={phoneValue}
                onChange={handlePhoneChange}
                type="tel"
                inputMode="numeric"
                className={inputWithIcon}
                placeholder={t('users.create.form.phoneNumberPlaceholder')}
              />
            </div>
          </Field>
        </div>
      </FormSection>

      {/* SECCIÓN: Permisos y especialidad */}
      <FormSection
        title={t('users.create.sectionRole')}
        description={t('users.create.sectionRoleDesc')}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field
            label={t('users.create.form.role')}
            helper={t('users.create.form.roleHelper')}
            error={errors.role?.message}
            required
          >
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-300 pointer-events-none" size={16} />
              <select {...register('role')} className={selectBase}>
                <option value={UserRole.DOCTOR}>{t('users.create.roles.DOCTOR')}</option>
                <option value={UserRole.STAFF}>{t('users.create.roles.STAFF')}</option>
                <option value={UserRole.ADMIN}>{t('users.create.roles.ADMIN')}</option>
              </select>
            </div>
          </Field>

          <Field
            label={t('users.create.form.specialty')}
            helper={t('users.create.form.specialtyHelper')}
            error={errors.specialty?.message}
          >
            <div className="relative">
              <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-300 pointer-events-none" size={16} />
              <select {...register('specialty')} className={selectBase}>
                <option value="">— Sin especialidad —</option>
                <option value={UserSpecialty.AUDIOLOGY}>{t('users.create.specialties.AUDIOLOGY')}</option>
                <option value={UserSpecialty.DENTAL}>{t('users.create.specialties.DENTAL')}</option>
                <option value={UserSpecialty.GENERAL}>{t('users.create.specialties.GENERAL')}</option>
              </select>
            </div>
          </Field>
        </div>
      </FormSection>

      {/* FOOTER */}
      <div className="pt-6 flex justify-end gap-3">
        <Button
          variant={ButtonVariant.CANCEL}
          onClick={() => navigation.common.back()}
          type="button"
          disabled={isLoading}
        >
          <Typography variant={TypographyVariant.BUTTON_TEXT} className="text-neutral-600">
            {t('common.buttons.cancel')}
          </Typography>
        </Button>

        <Button
          variant={ButtonVariant.PRIMARY}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <Typography variant={TypographyVariant.BUTTON_TEXT}>
                {t('common.buttons.loading')}
              </Typography>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Save size={16} />
              <Typography variant={TypographyVariant.BUTTON_TEXT}>
                {t('users.create.form.submit')}
              </Typography>
            </div>
          )}
        </Button>
      </div>
    </form>
  );
}
