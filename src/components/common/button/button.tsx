import React from 'react';
import { tailwind } from '@/utils/tailwind-utils';

export enum ButtonVariant {
    PRIMARY = 'PRIMARY',
    DANGER = 'DANGER',
    ALERT = 'ALERT',
    CANCEL = 'CANCEL'
}

type VariantStyle = {
    className: string;
};

type ButtonProps = {
    variant: ButtonVariant;
    text?: string;
    onClick?: () => void;
    children?: React.ReactNode;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
};

export function Button({
    variant,
    text,
    onClick,
    children,
    className: customClassName,
    type = 'button',
    disabled,
    ...props
}: ButtonProps) {

    const baseStyle =
        'flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100';

    const variantStyles: { [key in ButtonVariant]: VariantStyle } = {
        [ButtonVariant.PRIMARY]: {
            className: `${baseStyle}
                bg-[#1E3A8A] text-white
                hover:bg-[#1A337A]
                focus:ring-[#1E3A8A]/40`,
        },

        [ButtonVariant.DANGER]: {
            className: `${baseStyle}
                bg-red-600 text-white
                hover:bg-red-700
                focus:ring-red-500/40`,
        },

        [ButtonVariant.ALERT]: {
            className: `${baseStyle}
                bg-amber-500 text-white
                hover:bg-amber-600
                focus:ring-amber-500/40`,
        },

        [ButtonVariant.CANCEL]: {
            className: `${baseStyle}
                bg-slate-100 text-slate-700
                hover:bg-slate-200
                focus:ring-slate-300`,
        },
    };

    const { className: variantClassName } = variantStyles[variant];

    return (
        <button
            type={type}
            disabled={disabled}
            className={tailwind(variantClassName, customClassName)}
            onClick={onClick}
            {...props}
        >
            {children || text}
        </button>
    );
}
