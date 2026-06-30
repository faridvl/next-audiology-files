import React from 'react';
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';

export enum AlertVariant {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  WARNING = 'WARNING',
  INFO = 'INFO',
}

const VARIANT_CONFIG = {
  [AlertVariant.SUCCESS]: {
    icon: CheckCircleIcon,
    iconBg: 'bg-emerald-500 shadow-emerald-200',
    border: 'border-emerald-100',
  },
  [AlertVariant.ERROR]: {
    icon: XCircleIcon,
    iconBg: 'bg-danger shadow-danger/20',
    border: 'border-red-100',
  },
  [AlertVariant.WARNING]: {
    icon: ExclamationTriangleIcon,
    iconBg: 'bg-warning shadow-warning/20',
    border: 'border-amber-100',
  },
  [AlertVariant.INFO]: {
    icon: InformationCircleIcon,
    iconBg: 'bg-primary shadow-primary/20',
    border: 'border-primary/20',
  },
};

export interface AlertProps {
  variant?: AlertVariant;
  title: string;
  message?: string;
  onClose: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  variant = AlertVariant.SUCCESS,
  title,
  message,
  onClose,
}) => {
  const config = VARIANT_CONFIG[variant];
  const Icon = config.icon;

  return (
    <div className="fixed top-6 right-6 z-[100] animate-slide-in">
      <div className={`bg-white/80 backdrop-blur-xl border ${config.border} shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-app-lg p-5 flex items-start gap-5 max-w-[420px]`}>
        <div className={`${config.iconBg} p-2.5 rounded-app-md shadow-lg shrink-0`}>
          <Icon className="h-7 w-7 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <Typography variant={TypographyVariant.OVERLINE} className="text-neutral-900">{title}</Typography>
          {message && (
            <Typography variant={TypographyVariant.BODY} className="text-neutral-500 mt-0.5">{message}</Typography>
          )}
        </div>

        <button
          onClick={onClose}
          className="p-1.5 hover:bg-neutral-100 rounded-app-sm transition-colors text-neutral-400 shrink-0"
        >
          <XMarkIcon className="h-5 w-5 stroke-[2.5px]" />
        </button>
      </div>
    </div>
  );
};
