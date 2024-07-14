import React from 'react';
import { tailwind } from '@/utils/tailwind-utils';

export enum ButtonVariant {
    PRIMARY = 'PRIMARY',
    DANGER = 'DANGER',
    ALERT = 'ALERT',
    CANCEL = 'CANCEL'
}

type ButtonProps = {
    variant: ButtonVariant;
    text?: string;
    onClick: () => void;
    children?: React.ReactNode;
};

type VariantStyle = {
    bgColor: string;
    textColor: string;
    className: string;
};

export function Button({ variant, text, onClick, children, ...props }: ButtonProps) {
    const baseStyle = 'px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-2';
    const variantStyles: { [key in ButtonVariant]: VariantStyle } = {
        [ButtonVariant.PRIMARY]: {
            bgColor: 'bg-navy-blue',
            textColor: 'text-white',
            className: `${baseStyle} hover:bg-navy-blue-dark`,
        },
        [ButtonVariant.DANGER]: {
            bgColor: 'bg-red-600',
            textColor: 'text-white',
            className: `${baseStyle} hover:bg-red-700`,
        },
        [ButtonVariant.ALERT]: {
            bgColor: 'bg-yellow-500',
            textColor: 'text-black',
            className: `${baseStyle} hover:bg-yellow-600`,
        },
        [ButtonVariant.CANCEL]: {
            bgColor: 'bg-gray-400',
            textColor: 'text-black',
            className: `${baseStyle} hover:bg-gray-500`,
        },
    };

    const { bgColor, textColor, className } = variantStyles[variant];

    return (
        <button className={tailwind(bgColor, textColor, className)} onClick={onClick} {...props}>
            {children || text}
        </button>
    );
}
