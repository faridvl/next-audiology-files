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

    const baseStyle = 'flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100';

    const variantStyles: { [key in ButtonVariant]: VariantStyle } = {
        [ButtonVariant.PRIMARY]: {
            className: `${baseStyle} bg-blue-600 text-white px-5 py-2.5 rounded-2xl text-sm font-black shadow-xl shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300`,
        },
        [ButtonVariant.DANGER]: {
            className: `${baseStyle} bg-red-600 text-white px-5 py-2.5 rounded-2xl text-sm font-bold shadow-lg shadow-red-100 hover:bg-red-700`,
        },
        [ButtonVariant.ALERT]: {
            className: `${baseStyle} bg-yellow-500 text-black px-5 py-2.5 rounded-2xl text-sm font-bold shadow-lg shadow-yellow-100 hover:bg-yellow-600`,
        },
        [ButtonVariant.CANCEL]: {
            className: `${baseStyle} bg-slate-100 text-slate-500 px-6 py-2.5 rounded-2xl text-sm font-bold hover:bg-slate-200 hover:text-slate-600`,
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