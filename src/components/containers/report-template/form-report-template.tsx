import React, { useState } from 'react';
import { FileText, AlignLeft, Tag, ChevronDown, Save, Loader2 } from 'lucide-react';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { useTranslation } from 'react-i18next';
import { TEXT } from '@/static/texts/i18n';

enum ReportTemplateCategory {
  CLINICAL_CONTROL = 'CLINICAL_CONTROL',
  AUDIOGRAM = 'AUDIOGRAM',
  MAINTENANCE = 'MAINTENANCE',
  GENERAL = 'GENERAL',
}

const inputStyles = 'w-full px-4 py-3 bg-white border border-neutral-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-neutral-700 shadow-sm';
const labelStyles = '!text-neutral-500 !text-[10px] uppercase font-bold ml-1 mb-1.5 block';

const SectionCard = ({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) => (
  <div className="bg-white border border-neutral-100 rounded-app-xl p-8 shadow-sm space-y-5">
    <div className="flex items-center gap-2 border-b border-neutral-50 pb-4">
      <Icon size={16} className="text-primary" strokeWidth={2.5} />
      <Typography variant={TypographyVariant.OVERLINE} className="!text-neutral-900">{title}</Typography>
    </div>
    {children}
  </div>
);

export const ReportTemplateCreateContainer: React.FC = () => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ReportTemplateCategory>(ReportTemplateCategory.GENERAL);
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [isSaving] = useState(false);

  const categoryLabels: Record<ReportTemplateCategory, string> = {
    [ReportTemplateCategory.CLINICAL_CONTROL]: t(TEXT.REPORT_TEMPLATE.CATEGORIES.CLINICAL_CONTROL),
    [ReportTemplateCategory.AUDIOGRAM]: t(TEXT.REPORT_TEMPLATE.CATEGORIES.AUDIOGRAM),
    [ReportTemplateCategory.MAINTENANCE]: t(TEXT.REPORT_TEMPLATE.CATEGORIES.MAINTENANCE),
    [ReportTemplateCategory.GENERAL]: t(TEXT.REPORT_TEMPLATE.CATEGORIES.GENERAL),
  };

  return (
    <div className="max-w-3xl mx-auto pb-20 space-y-4">

      {/* CABECERA INFORMATIVA */}
      <div className="bg-primary/5 border border-primary/10 rounded-app-xl px-6 py-4 flex items-center gap-4">
        <div className="h-10 w-10 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
          <FileText size={18} className="text-primary" />
        </div>
        <div>
          <Typography variant={TypographyVariant.BODY_BOLD} className="!text-primary !text-sm">
            {t(TEXT.REPORT_TEMPLATE.INFO_TITLE)}
          </Typography>
          <Typography variant={TypographyVariant.CAPTION} className="!text-primary/70">
            {t(TEXT.REPORT_TEMPLATE.INFO_SUBTITLE)}
          </Typography>
        </div>
      </div>

      {/* SECCIÓN 1: DATOS GENERALES */}
      <SectionCard icon={Tag} title={t(TEXT.REPORT_TEMPLATE.SECTIONS.GENERAL)}>
        <div className="space-y-4">
          <div>
            <Typography variant={TypographyVariant.OVERLINE} className={labelStyles}>
              {t(TEXT.REPORT_TEMPLATE.FIELDS.TITLE_LABEL)}
            </Typography>
            <input
              className={inputStyles}
              placeholder={t(TEXT.REPORT_TEMPLATE.FIELDS.TITLE_PLACEHOLDER)}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={120}
            />
          </div>

          <div className="relative">
            <Typography variant={TypographyVariant.OVERLINE} className={labelStyles}>
              {t(TEXT.REPORT_TEMPLATE.FIELDS.CATEGORY_LABEL)}
            </Typography>
            <div className="relative">
              <select
                className={`${inputStyles} appearance-none pr-10`}
                value={category}
                onChange={(event) => setCategory(event.target.value as ReportTemplateCategory)}
              >
                {Object.values(ReportTemplateCategory).map((value) => (
                  <option key={value} value={value}>{categoryLabels[value]}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <Typography variant={TypographyVariant.OVERLINE} className={labelStyles}>
              {t(TEXT.REPORT_TEMPLATE.FIELDS.DESCRIPTION_LABEL)}
            </Typography>
            <textarea
              className={`${inputStyles} resize-none`}
              rows={3}
              placeholder={t(TEXT.REPORT_TEMPLATE.FIELDS.DESCRIPTION_PLACEHOLDER)}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={300}
            />
          </div>
        </div>
      </SectionCard>

      {/* SECCIÓN 2: CONTENIDO */}
      <SectionCard icon={AlignLeft} title={t(TEXT.REPORT_TEMPLATE.SECTIONS.CONTENT)}>
        <div>
          <Typography variant={TypographyVariant.CAPTION} className="!text-neutral-400 mb-3 block">
            {t(TEXT.REPORT_TEMPLATE.CONTENT_HINT)}
          </Typography>
          <textarea
            className={`${inputStyles} resize-none font-mono !text-xs leading-relaxed`}
            rows={16}
            placeholder={t(TEXT.REPORT_TEMPLATE.FIELDS.CONTENT_PLACEHOLDER)}
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />
        </div>
      </SectionCard>

      {/* BOTONES */}
      <div className="flex items-center justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={() => { setTitle(''); setDescription(''); setContent(''); setCategory(ReportTemplateCategory.GENERAL); }}
          className="px-6 py-2 hover:bg-neutral-50 rounded-xl transition-colors"
        >
          <Typography variant={TypographyVariant.OVERLINE} className="!text-neutral-400">
            {t(TEXT.REPORT_TEMPLATE.BUTTONS.DISCARD)}
          </Typography>
        </button>
        <button
          type="button"
          disabled={!title.trim() || isSaving}
          className="bg-primary text-white px-10 py-3.5 rounded-2xl shadow-xl shadow-primary-soft hover:bg-primary-dark hover:-translate-y-0.5 transition-all flex items-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <Loader2 size={16} strokeWidth={3} className="animate-spin" />
          ) : (
            <Save size={16} strokeWidth={2.5} />
          )}
          <Typography variant={TypographyVariant.OVERLINE} className="!text-white">
            {t(TEXT.REPORT_TEMPLATE.BUTTONS.SAVE)}
          </Typography>
        </button>
      </div>
    </div>
  );
};
