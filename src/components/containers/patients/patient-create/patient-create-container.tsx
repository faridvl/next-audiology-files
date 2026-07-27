import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { UserIcon, PhoneIcon, EnvelopeIcon, CalendarIcon, IdentificationIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TEXT } from '@/static/texts/i18n';
import { usePatientCreate } from './use-patient-create';
import {
  DocumentType,
  PatientGender,
  DOCUMENT_MASKS,
  formatNationalId,
  formatPhone,
} from '@/components/containers/patients/patient-validation';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';

const inputBase =
  'w-full pl-11 pr-4 py-3 bg-neutral-50 border-2 border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 rounded-app-md outline-none transition-all font-semibold text-neutral-700 text-sm placeholder:font-normal placeholder:text-neutral-400';
const inputError =
  'border-danger/30 bg-danger/5 focus:border-danger focus:ring-danger/5';

interface FieldGroupProps {
  label: string;
  name: string;
  icon: React.ReactNode;
  error?: boolean;
  touched?: boolean;
  children: React.ReactNode;
}

const FieldGroup: React.FC<FieldGroupProps> = ({ label, name, icon, error, touched, children }) => (
  <div>
    <Typography variant={TypographyVariant.OVERLINE} as="label" className="ml-1 mb-1 block text-[11px] font-bold tracking-widest uppercase text-neutral-500">
      {label}
    </Typography>
    <div className="relative group">
      <div className={`absolute left-4 top-3.5 h-4 w-4 transition-colors ${error && touched ? 'text-danger' : 'text-neutral-300 group-focus-within:text-primary'}`}>
        {icon}
      </div>
      {children}
    </div>
    <ErrorMessage
      name={name}
      render={(message) => (
        <Typography variant={TypographyVariant.CAPTION} className="ml-2 mt-1 text-danger text-[11px] font-semibold">
          {message}
        </Typography>
      )}
    />
  </div>
);

interface Props {
  onShowSuccess: () => void;
}

export const PatientCreateContainer: React.FC<Props> = ({ onShowSuccess }) => {
  const { t } = useTranslation();
  const { initialValues, validationSchema, handleSubmit, isLoading } = usePatientCreate(onShowSuccess);

  const documentTypeLabels: Record<DocumentType, string> = {
    [DocumentType.NATIONAL]: t(TEXT.PATIENTS.CREATE.FORM.DOCUMENT_TYPE_NATIONAL),
    [DocumentType.DIMEX]: t(TEXT.PATIENTS.CREATE.FORM.DOCUMENT_TYPE_DIMEX),
    [DocumentType.PASSPORT]: t(TEXT.PATIENTS.CREATE.FORM.DOCUMENT_TYPE_PASSPORT),
  };

  const genderOptions = [
    { value: PatientGender.MALE, label: t(TEXT.PATIENTS.CREATE.FORM.GENDER_MALE) },
    { value: PatientGender.FEMALE, label: t(TEXT.PATIENTS.CREATE.FORM.GENDER_FEMALE) },
  ];

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8">
        <Typography variant={TypographyVariant.HEADER} as="h1" className="text-2xl font-black text-neutral-900 tracking-tight">
          {t(TEXT.PATIENTS.CREATE.TITLE)}
        </Typography>
        <Typography variant={TypographyVariant.CAPTION} className="text-neutral-400 mt-1 italic">
          {t(TEXT.PATIENTS.CREATE.SUBTITLE)}
        </Typography>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnBlur
        validateOnChange={false}
      >
        {({ values, errors, touched, setFieldValue, setFieldTouched }) => {
          const docMask = DOCUMENT_MASKS[values.documentType];

          const handleDocumentIdChange = (raw: string) => {
            if (values.documentType === DocumentType.NATIONAL) {
              setFieldValue('documentId', formatNationalId(raw));
            } else if (values.documentType === DocumentType.PASSPORT) {
              setFieldValue('documentId', raw.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, docMask.maxLength));
            } else {
              setFieldValue('documentId', raw.replace(/\D/g, '').slice(0, docMask.maxLength));
            }
          };

          const handlePhoneChange = (raw: string) => {
            setFieldValue('phone', formatPhone(raw));
          };

          return (
            <Form className="space-y-8">

              {/* Sección: Identidad */}
              <div className="space-y-5">
                <Typography variant={TypographyVariant.OVERLINE} className="text-[10px] font-black tracking-widest uppercase text-neutral-400 border-b border-neutral-100 pb-2 block">
                  {t(TEXT.PATIENTS.CREATE.SECTIONS.IDENTITY)}
                </Typography>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FieldGroup label={t(TEXT.PATIENTS.CREATE.FORM.FIRST_NAME)} name="firstName" icon={<UserIcon />} error={!!errors.firstName} touched={touched.firstName}>
                    <Field
                      name="firstName"
                      maxLength={60}
                      placeholder={t(TEXT.PATIENTS.CREATE.FORM.FIRST_NAME_PLACEHOLDER)}
                      className={`${inputBase} ${errors.firstName && touched.firstName ? inputError : ''}`}
                    />
                  </FieldGroup>

                  <FieldGroup label={t(TEXT.PATIENTS.CREATE.FORM.LAST_NAME)} name="lastName" icon={<UserIcon />} error={!!errors.lastName} touched={touched.lastName}>
                    <Field
                      name="lastName"
                      maxLength={60}
                      placeholder={t(TEXT.PATIENTS.CREATE.FORM.LAST_NAME_PLACEHOLDER)}
                      className={`${inputBase} ${errors.lastName && touched.lastName ? inputError : ''}`}
                    />
                  </FieldGroup>
                </div>

                {/* Tipo de documento + Número */}
                <div>
                  <Typography variant={TypographyVariant.OVERLINE} as="label" className="ml-1 mb-1.5 block text-[11px] font-bold tracking-widest uppercase text-neutral-500">
                    {t(TEXT.PATIENTS.CREATE.FORM.IDENTIFICATION)}
                  </Typography>
                  <div className="flex gap-2">
                    {/* Selector de tipo */}
                    <div className="relative shrink-0">
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-300 pointer-events-none" />
                      <select
                        value={values.documentType}
                        onChange={(event) => {
                          setFieldValue('documentType', event.target.value as DocumentType);
                          setFieldValue('documentId', '');
                        }}
                        className="appearance-none pl-3 pr-8 py-3 bg-neutral-50 border-2 border-transparent focus:border-primary rounded-app-md outline-none text-sm font-bold text-neutral-700 cursor-pointer transition-all"
                      >
                        {Object.values(DocumentType).map((type) => (
                          <option key={type} value={type}>{documentTypeLabels[type]}</option>
                        ))}
                      </select>
                    </div>
                    {/* Input de documento */}
                    <div className="relative group flex-1">
                      <div className="absolute left-4 top-3.5 h-4 w-4 text-neutral-300 group-focus-within:text-primary transition-colors">
                        <IdentificationIcon />
                      </div>
                      <input
                        value={values.documentId}
                        onChange={(event) => handleDocumentIdChange(event.target.value)}
                        onBlur={() => setFieldTouched('documentId', true)}
                        placeholder={docMask.placeholder}
                        maxLength={docMask.maxLength}
                        className={`${inputBase} ${errors.documentId && touched.documentId ? inputError : ''}`}
                      />
                    </div>
                  </div>
                  <Typography variant={TypographyVariant.CAPTION} className="ml-2 mt-1 text-neutral-400 text-[10px]">
                    {docMask.hint}
                  </Typography>
                  {errors.documentId && touched.documentId && (
                    <Typography variant={TypographyVariant.CAPTION} className="ml-2 mt-1 text-danger text-[11px] font-semibold">
                      {errors.documentId}
                    </Typography>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Género */}
                  <div>
                    <Typography variant={TypographyVariant.OVERLINE} as="label" className="ml-1 mb-1 block text-[11px] font-bold tracking-widest uppercase text-neutral-500">
                      {t(TEXT.PATIENTS.CREATE.FORM.GENDER)}
                    </Typography>
                    <div className="flex gap-2">
                      {genderOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setFieldValue('gender', option.value)}
                          className={`flex-1 py-3 rounded-app-md border-2 text-sm font-bold transition-all ${
                            values.gender === option.value
                              ? 'border-primary bg-primary-soft text-primary'
                              : 'border-neutral-100 bg-neutral-50 text-neutral-500 hover:border-neutral-200'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                    <ErrorMessage
                      name="gender"
                      render={(message) => (
                        <Typography variant={TypographyVariant.CAPTION} className="ml-2 mt-1 text-danger text-[11px] font-semibold">
                          {message}
                        </Typography>
                      )}
                    />
                  </div>

                  {/* Fecha de nacimiento */}
                  <div>
                    <Typography variant={TypographyVariant.OVERLINE} as="label" className="ml-1 mb-1 block text-[11px] font-bold tracking-widest uppercase text-neutral-500">
                      {t(TEXT.PATIENTS.CREATE.FORM.BIRTH_DATE)}
                    </Typography>
                    <div className="relative group">
                      <div className="absolute left-4 top-3.5 h-4 w-4 text-neutral-300 group-focus-within:text-primary transition-colors pointer-events-none">
                        <CalendarIcon />
                      </div>
                      <Field
                        name="birthDate"
                        type="date"
                        max={new Date().toISOString().split('T')[0]}
                        className={`${inputBase} ${errors.birthDate && touched.birthDate ? inputError : ''}`}
                      />
                    </div>
                    <ErrorMessage
                      name="birthDate"
                      render={(message) => (
                        <Typography variant={TypographyVariant.CAPTION} className="ml-2 mt-1 text-danger text-[11px] font-semibold">
                          {message}
                        </Typography>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Sección: Contacto */}
              <div className="space-y-5">
                <Typography variant={TypographyVariant.OVERLINE} className="text-[10px] font-black tracking-widest uppercase text-neutral-400 border-b border-neutral-100 pb-2 block">
                  {t(TEXT.PATIENTS.CREATE.SECTIONS.CONTACT)}
                </Typography>

                {/* Teléfono con prefijo CR */}
                <div>
                  <Typography variant={TypographyVariant.OVERLINE} as="label" className="ml-1 mb-1 block text-[11px] font-bold tracking-widest uppercase text-neutral-500">
                    {t(TEXT.PATIENTS.CREATE.FORM.PHONE)}
                  </Typography>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-2 px-4 py-3 bg-neutral-50 border-2 border-transparent rounded-app-md shrink-0">
                      <span className="text-base">🇨🇷</span>
                      <Typography variant={TypographyVariant.BODY_SEMIBOLD} className="text-sm font-bold text-neutral-600">
                        +506
                      </Typography>
                    </div>
                    <div className="relative group flex-1">
                      <div className="absolute left-4 top-3.5 h-4 w-4 text-neutral-300 group-focus-within:text-primary transition-colors">
                        <PhoneIcon />
                      </div>
                      <input
                        value={values.phone}
                        onChange={(event) => handlePhoneChange(event.target.value)}
                        onBlur={() => setFieldTouched('phone', true)}
                        placeholder={t(TEXT.PATIENTS.CREATE.FORM.PHONE_PLACEHOLDER)}
                        maxLength={9}
                        className={`${inputBase} ${errors.phone && touched.phone ? inputError : ''}`}
                      />
                    </div>
                  </div>
                  {errors.phone && touched.phone && (
                    <Typography variant={TypographyVariant.CAPTION} className="ml-2 mt-1 text-danger text-[11px] font-semibold">
                      {errors.phone}
                    </Typography>
                  )}
                </div>

                <FieldGroup label={t(TEXT.PATIENTS.CREATE.FORM.EMAIL)} name="email" icon={<EnvelopeIcon />} error={!!errors.email} touched={touched.email}>
                  <Field
                    name="email"
                    type="email"
                    placeholder={t(TEXT.PATIENTS.CREATE.FORM.EMAIL_PLACEHOLDER)}
                    className={`${inputBase} ${errors.email && touched.email ? inputError : ''}`}
                  />
                </FieldGroup>

                {/* Dirección como textarea */}
                <div>
                  <Typography variant={TypographyVariant.OVERLINE} as="label" className="ml-1 mb-1 block text-[11px] font-bold tracking-widest uppercase text-neutral-500">
                    {t(TEXT.PATIENTS.CREATE.FORM.ADDRESS)}
                  </Typography>
                  <div className="relative group">
                    <div className="absolute left-4 top-3.5 h-4 w-4 text-neutral-300 group-focus-within:text-primary transition-colors">
                      <MapPinIcon />
                    </div>
                    <Field
                      as="textarea"
                      name="address"
                      maxLength={240}
                      rows={3}
                      placeholder={t(TEXT.PATIENTS.CREATE.FORM.ADDRESS_PLACEHOLDER)}
                      className={`${inputBase} pl-11 resize-none leading-relaxed ${errors.address && touched.address ? inputError : ''}`}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-1 px-1">
                    <ErrorMessage
                      name="address"
                      render={(message) => (
                        <Typography variant={TypographyVariant.CAPTION} className="text-danger text-[11px] font-semibold">
                          {message}
                        </Typography>
                      )}
                    />
                    <Typography variant={TypographyVariant.CAPTION} className="text-neutral-300 text-[10px] ml-auto">
                      {values.address.length}/240
                    </Typography>
                  </div>
                </div>
              </div>

              <Button
                variant={ButtonVariant.PRIMARY}
                type="submit"
                className="w-full py-4 rounded-app-md text-base shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? t(TEXT.PATIENTS.CREATE.FORM.SUBMITTING) : t(TEXT.PATIENTS.CREATE.FORM.SUBMIT)}
              </Button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
