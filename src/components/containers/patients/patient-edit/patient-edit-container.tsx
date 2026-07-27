import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { ArrowLeft, UserIcon } from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import { UserIcon as HeroUserIcon, PhoneIcon, EnvelopeIcon, MapPinIcon, IdentificationIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';
import { usePatientEdit } from './use-patient-edit';
import { useTranslation } from 'react-i18next';
import { TEXT } from '@/static/texts/i18n';
import {
  DocumentType,
  DOCUMENT_MASKS,
  formatNationalId,
} from '@/components/containers/patients/patient-validation';

interface Props {
  patientUuid: string;
}

export const PatientEditContainer: React.FC<Props> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const {
    initialValues,
    isLoadingPatient,
    isSaving,
    handleSubmit,
    handleCancel,
    validationSchema,
  } = usePatientEdit(patientUuid);

  const documentTypeLabels: Record<DocumentType, string> = {
    [DocumentType.NATIONAL]: t(TEXT.PATIENTS.CREATE.FORM.DOCUMENT_TYPE_NATIONAL),
    [DocumentType.DIMEX]: t(TEXT.PATIENTS.CREATE.FORM.DOCUMENT_TYPE_DIMEX),
    [DocumentType.PASSPORT]: t(TEXT.PATIENTS.CREATE.FORM.DOCUMENT_TYPE_PASSPORT),
  };

  const inputClasses =
    'w-full pl-11 pr-4 py-3 bg-neutral-50 border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 rounded-app-md outline-none transition-all font-semibold text-neutral-700 text-sm';
  const labelClasses = 'ml-1 mb-1 block';

  const handlePhoneKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End', '+', ' ', '-'];
    if (!allowedKeys.includes(event.key) && !/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  };

  if (isLoadingPatient) {
    return (
      <div className="max-w-3xl mx-auto my-8 p-4 animate-pulse space-y-4">
        <div className="h-8 bg-neutral-100 rounded w-1/3" />
        <div className="h-64 bg-neutral-100 rounded-app-lg" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto my-8 p-4">
      <button
        onClick={handleCancel}
        className="flex items-center gap-2 text-neutral-400 hover:text-neutral-900 font-medium text-xs uppercase tracking-widest transition-all mb-6"
      >
        <ArrowLeft size={14} /> {t(TEXT.PATIENTS.EDIT.BACK_TO_FILE)}
      </button>

      <div className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-app-2xl overflow-hidden border border-neutral-100">
        <div className="bg-neutral-50/50 px-10 py-8 border-b border-neutral-100 flex items-center gap-4">
          <div className="bg-primary p-3 rounded-app-md shadow-lg shadow-primary-dark/20">
            <UserIcon size={24} className="text-white" />
          </div>
          <div>
            <Typography variant={TypographyVariant.SUBTITLE} textColor="text-neutral-800">
              {t(TEXT.PATIENTS.EDIT.TITLE)}
            </Typography>
            <Typography variant={TypographyVariant.HELPER}>
              {t(TEXT.PATIENTS.EDIT.SUBTITLE)}
            </Typography>
          </div>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
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

            return (
            <Form className="p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                <div className="md:col-span-2">
                  <Typography variant={TypographyVariant.OVERLINE} className={labelClasses}>{t(TEXT.PATIENTS.EDIT.FORM.DOCUMENT_ID)}</Typography>
                  <div className="flex gap-2">
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
                    <div className="relative group flex-1">
                      <IdentificationIcon className="absolute left-4 top-3.5 h-5 w-5 text-neutral-400 group-focus-within:text-primary transition-colors" />
                      <input
                        value={values.documentId}
                        onChange={(event) => handleDocumentIdChange(event.target.value)}
                        onBlur={() => setFieldTouched('documentId', true)}
                        placeholder={docMask.placeholder}
                        maxLength={docMask.maxLength}
                        className={inputClasses}
                      />
                    </div>
                  </div>
                  {errors.documentId && touched.documentId && (
                    <Typography variant={TypographyVariant.CAPTION} textColor="text-danger" className="ml-2 mt-1">{errors.documentId}</Typography>
                  )}
                </div>

                <div>
                  <Typography variant={TypographyVariant.OVERLINE} className={labelClasses}>{t(TEXT.PATIENTS.EDIT.FORM.FIRST_NAME)}</Typography>
                  <div className="relative group">
                    <Field name="firstName" maxLength={60} className={inputClasses} placeholder={t(TEXT.PATIENTS.EDIT.FORM.FIRST_NAME)} />
                    <HeroUserIcon className="absolute left-4 top-3.5 h-5 w-5 text-neutral-400 group-focus-within:text-primary transition-colors" />
                  </div>
                  <ErrorMessage name="firstName" render={(msg) => (
                    <Typography variant={TypographyVariant.CAPTION} textColor="text-danger" className="ml-2 mt-1">{msg}</Typography>
                  )} />
                </div>

                <div>
                  <Typography variant={TypographyVariant.OVERLINE} className={labelClasses}>{t(TEXT.PATIENTS.EDIT.FORM.LAST_NAME)}</Typography>
                  <div className="relative group">
                    <Field name="lastName" maxLength={60} className={inputClasses} placeholder={t(TEXT.PATIENTS.EDIT.FORM.LAST_NAME)} />
                    <HeroUserIcon className="absolute left-4 top-3.5 h-5 w-5 text-neutral-400 group-focus-within:text-primary transition-colors" />
                  </div>
                  <ErrorMessage name="lastName" render={(msg) => (
                    <Typography variant={TypographyVariant.CAPTION} textColor="text-danger" className="ml-2 mt-1">{msg}</Typography>
                  )} />
                </div>

                <div>
                  <Typography variant={TypographyVariant.OVERLINE} className={labelClasses}>{t(TEXT.PATIENTS.EDIT.FORM.PHONE)}</Typography>
                  <div className="relative group">
                    <Field
                      name="phone"
                      maxLength={15}
                      className={inputClasses}
                      placeholder="+506 8888-8888"
                      onKeyDown={handlePhoneKeyDown}
                    />
                    <PhoneIcon className="absolute left-4 top-3.5 h-5 w-5 text-neutral-400 group-focus-within:text-primary" />
                  </div>
                  <ErrorMessage name="phone" render={(msg) => (
                    <Typography variant={TypographyVariant.CAPTION} textColor="text-danger" className="ml-2 mt-1">{msg}</Typography>
                  )} />
                </div>

                <div>
                  <Typography variant={TypographyVariant.OVERLINE} className={labelClasses}>{t(TEXT.PATIENTS.EDIT.FORM.BIRTH_DATE)}</Typography>
                  <div className="relative group">
                    <Field
                      name="birthDate"
                      type="date"
                      max={new Date().toISOString().split('T')[0]}
                      className={inputClasses}
                    />
                    <CalendarIcon className="absolute left-4 top-3.5 h-5 w-5 text-neutral-400 group-focus-within:text-primary pointer-events-none" />
                  </div>
                  <ErrorMessage name="birthDate" render={(msg) => (
                    <Typography variant={TypographyVariant.CAPTION} textColor="text-danger" className="ml-2 mt-1">{msg}</Typography>
                  )} />
                </div>

                <div>
                  <Typography variant={TypographyVariant.OVERLINE} className={labelClasses}>{t(TEXT.PATIENTS.EDIT.FORM.GENDER)}</Typography>
                  <Field
                    as="select"
                    name="gender"
                    className={`${inputClasses} pl-4`}
                  >
                    <option value="">{t(TEXT.PATIENTS.EDIT.FORM.GENDER_UNSPECIFIED)}</option>
                    <option value="male">{t(TEXT.PATIENTS.EDIT.FORM.GENDER_MALE)}</option>
                    <option value="female">{t(TEXT.PATIENTS.EDIT.FORM.GENDER_FEMALE)}</option>
                  </Field>
                </div>

                <div className="md:col-span-2">
                  <Typography variant={TypographyVariant.OVERLINE} className={labelClasses}>{t(TEXT.PATIENTS.EDIT.FORM.EMAIL)}</Typography>
                  <div className="relative group">
                    <Field name="email" type="email" className={inputClasses} placeholder={t(TEXT.PATIENTS.EDIT.FORM.EMAIL_PLACEHOLDER)} />
                    <EnvelopeIcon className="absolute left-4 top-3.5 h-5 w-5 text-neutral-400 group-focus-within:text-primary" />
                  </div>
                  <ErrorMessage name="email" render={(msg) => (
                    <Typography variant={TypographyVariant.CAPTION} textColor="text-danger" className="ml-2 mt-1">{msg}</Typography>
                  )} />
                </div>

                <div className="md:col-span-2">
                  <Typography variant={TypographyVariant.OVERLINE} className={labelClasses}>{t(TEXT.PATIENTS.EDIT.FORM.ADDRESS)}</Typography>
                  <div className="relative group">
                    <Field name="address" maxLength={240} className={inputClasses} placeholder={t(TEXT.PATIENTS.EDIT.FORM.ADDRESS_PLACEHOLDER)} />
                    <MapPinIcon className="absolute left-4 top-3.5 h-5 w-5 text-neutral-400 group-focus-within:text-primary" />
                  </div>
                  <ErrorMessage name="address" render={(msg) => (
                    <Typography variant={TypographyVariant.CAPTION} textColor="text-danger" className="ml-2 mt-1">{msg}</Typography>
                  )} />
                </div>
              </div>

              <div className="mt-12 flex gap-4">
                <Button
                  variant={ButtonVariant.CANCEL}
                  type="button"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  {t(TEXT.GENERAL.BUTTONS.CANCEL)}
                </Button>
                <Button
                  variant={ButtonVariant.PRIMARY}
                  type="submit"
                  className="flex-1 py-4 rounded-app-md text-base shadow-xl shadow-primary-dark/10"
                  disabled={isSaving}
                >
                  {isSaving ? t(TEXT.PATIENTS.EDIT.FORM.SAVING) : t(TEXT.PATIENTS.EDIT.FORM.SAVE_CHANGES)}
                </Button>
              </div>
            </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};
