import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';

interface BackButtonProps {
  onClick: () => void;
  label?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ onClick, label }) => {
  const { t } = useTranslation();

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 text-neutral-400 hover:text-neutral-600 transition-colors mb-6 group"
    >
      <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
      <Typography variant={TypographyVariant.BODY_SEMIBOLD} className="text-[13px]">
        {label || t('common.navigation.backToList')}
      </Typography>
    </button>
  );
};
