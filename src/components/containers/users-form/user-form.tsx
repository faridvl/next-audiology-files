// {
//   "common": {
//     "buttons": {
//       "save": "Guardar",
//         "cancel": "Cancelar",
//           "back": "Volver",
//             "loading": "Cargando..."
//     },
//     "placeholders": {
//       "search": "Buscar...",
//         "select": "Seleccionar una opción"
//     }
//   },
//   "users": {
//     "create": {
//       "title": "Nuevo Miembro",
//         "description": "Completa los datos para dar de alta un nuevo acceso.",
//           "form": {
//         "fullName": "Nombre Completo",
//           "fullNamePlaceholder": "Ej. Roberto Gómez",
//             "email": "Correo Electrónico",
//               "emailPlaceholder": "nombre@clinica.com",
//                 "password": "Contraseña Temporal",
//                   "passwordPlaceholder": "••••••••",
//                     "role": "Rol de Sistema",
//                       "specialty": "Especialidad / Área",
//                         "specialtyPlaceholder": "Ej. Audiología Clínica",
//                           "submit": "Guardar Usuario"
//       },
//       "roles": {
//         "OWNER": "Dueño",
//           "ADMIN": "Administrador",
//             "DOCTOR": "Médico",
//               "STAFF": "Recepcionista / Staff"
//       }
//     }
//   }
// }



import { LucideIcon } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Save, User, Mail, ShieldCheck, Briefcase, Lock } from 'lucide-react';
import { useNavigation } from '@/hooks/use-navigation';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';
import { useUserForm } from './use-user-form';
import { UserRole } from '@/types/auth/auth';

//todo(!): separar esto en un nuevo componente
interface FormFieldProps {
  label: string;
  icon: LucideIcon;
  error?: string;
  children: React.ReactNode;
}

export const FormField = ({ label, icon: Icon, error, children }: FormFieldProps) => (
  <div className="space-y-2">
    <Typography variant={TypographyVariant.OVERLINE} className="ml-1">
      {label}
    </Typography>
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
      {children}
    </div>
    {error && <span className="text-xs text-red-500 ml-1">{error}</span>}
  </div>
);



export function UserFormContainer() {
  const { t } = useTranslation();
  const nav = useNavigation();
  const { form, onSubmit, isLoading } = useUserForm();

  const { register, formState: { errors } } = form;

  const inputStyles = "w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all";

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">

      <form onSubmit={onSubmit} className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <FormField
            label={t('users.create.form.fullName')}
            icon={User}
            error={errors.fullName?.message}
          >
            <input
              {...register('fullName')}
              className={inputStyles}
              placeholder={t('users.create.form.fullNamePlaceholder')}
            />
          </FormField>

          <FormField
            label={t('users.create.form.email')}
            icon={Mail}
            error={errors.email?.message}
          >
            <input
              {...register('email')}
              type="email"
              className={inputStyles}
              placeholder={t('users.create.form.emailPlaceholder')}
            />
          </FormField>

          <FormField
            label={t('users.create.form.password')}
            icon={Lock}
            error={errors.password?.message}
          >
            <input
              {...register('password')}
              type="password"
              className={inputStyles}
              placeholder={t('users.create.form.passwordPlaceholder')}
            />
          </FormField>

          <FormField
            label={t('users.create.form.role')}
            icon={ShieldCheck}
            error={errors.role?.message}
          >
            <select {...register('role')} className={inputStyles}>
              <option value={UserRole.DOCTOR}>{t('users.create.roles.DOCTOR')}</option>
              <option value={UserRole.STAFF}>{t('users.create.roles.STAFF')}</option>
              <option value={UserRole.ADMIN}>{t('users.create.roles.ADMIN')}</option>
            </select>
          </FormField>

          <div className="md:col-span-2">
            <FormField
              label={t('users.create.form.specialty')}
              icon={Briefcase}
              error={errors.specialty?.message}
            >
              <input
                {...register('specialty')}
                className={inputStyles}
                placeholder={t('users.create.form.specialtyPlaceholder')}
              />
            </FormField>
          </div>
        </div>

        <div className="pt-6 flex justify-end gap-3">
          {/* Botón Cancelar: Te regresa a la lista sin guardar */}
          <Button
            variant={ButtonVariant.CANCEL}
            onClick={() => nav.common.back()}
            type="button"
            disabled={isLoading} // Evitamos que cancelen mientras se está guardando
          >
            <Typography variant={TypographyVariant.BUTTON_TEXT} className="text-slate-600">
              {t('common.buttons.cancel')}
            </Typography>
          </Button>

          <Button
            variant={ButtonVariant.PRIMARY}
            type="submit"
            disabled={isLoading}
            className={`shadow-lg transition-all duration-300 ${isLoading ? 'opacity-70 shadow-none' : 'shadow-blue-200 hover:shadow-blue-300'
              }`}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                <Typography variant={TypographyVariant.BUTTON_TEXT}>
                  {t('common.buttons.loading')}
                </Typography>
              </div>
            ) : (
              <div className="flex items-center">
                <Save size={18} className="mr-2" />
                <Typography variant={TypographyVariant.BUTTON_TEXT}>
                  {t('users.create.form.submit')}
                </Typography>
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}