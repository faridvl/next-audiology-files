import { tailwind } from '@/utils/tailwind-utils';
import React, { HTMLAttributeAnchorTarget, ElementType } from 'react';

export enum TypographyVariant {
    HEADER = 'HEADER',
    SUBTITLE = 'SUBTITLE',
    HELPER = 'HELPER',
    ACCENT = 'ACCENT',
    BODY = 'BODY',
    BODY_BOLD = 'BODY_BOLD',
    BODY_SEMIBOLD = 'BODY_SEMIBOLD',
    LINK_TEXT = 'LINK_TEXT',
    CAPTION = 'CAPTION',
    OVERLINE = 'OVERLINE',
    QUOTE = 'QUOTE',
    BUTTON_TEXT = 'BUTTON_TEXT',
}

type TextProps = {
    variant?: TypographyVariant;
    ignoreImplicitSpacing?: boolean;
    inline?: boolean;
    disabled?: boolean;
    href?: string;
    target?: HTMLAttributeAnchorTarget;
    textColor?: string;
    className?: string;
    as?: ElementType;
};

type HtmlSvgElement = React.HTMLAttributes<HTMLElement | SVGElement>;
type Props = TextProps & HtmlSvgElement;

type VariantStyle = {
    colorClassName?: string;
    styleClassName?: string;
    className?: string;
    spacingClassName?: string;
    component: ElementType;
};

const commonStylesClassName = 'font-sans';
const variantStyles: { [key in TypographyVariant]: VariantStyle } = {
    [TypographyVariant.HEADER]: {
        component: 'h1',
        className: `${commonStylesClassName} font-extrabold text-2xl md:text-4xl`,
        colorClassName: 'text-gray-900',
    },
    [TypographyVariant.SUBTITLE]: {
        component: 'h2',
        className: `${commonStylesClassName} font-semibold text-xl md:text-3xl`,
        colorClassName: 'text-gray-700',
    },
    [TypographyVariant.ACCENT]: {
        component: 'h3',
        className: `${commonStylesClassName} font-bold text-lg md:text-2xl`,
        colorClassName: 'text-gray-800',
    },
    [TypographyVariant.BODY]: {
        component: 'p',
        className: `${commonStylesClassName} font-normal text-base md:text-lg`,
        colorClassName: 'text-gray-700',
    },
    [TypographyVariant.BODY_BOLD]: {
        component: 'p',
        className: `${commonStylesClassName} font-bold text-base md:text-lg`,
        colorClassName: 'text-gray-700',
    },
    [TypographyVariant.BODY_SEMIBOLD]: {
        component: 'p',
        className: `${commonStylesClassName} font-semibold text-base md:text-lg`,
        colorClassName: 'text-gray-700',
    },
    [TypographyVariant.HELPER]: {
        component: 'p',
        className: `${commonStylesClassName} font-normal text-sm md:text-base`,
        colorClassName: 'text-gray-500',
    },
    [TypographyVariant.LINK_TEXT]: {
        component: 'p',
        className: `${commonStylesClassName} text-blue-600 cursor-pointer font-normal hover:underline text-base md:text-lg`,
        colorClassName: 'text-blue-600',
    },
    [TypographyVariant.CAPTION]: {
        component: 'span',
        className: `${commonStylesClassName} font-normal text-xs md:text-sm`,
        colorClassName: 'text-gray-500',
    },
    [TypographyVariant.OVERLINE]: {
        component: 'span',
        className: `${commonStylesClassName} font-semibold text-xs uppercase tracking-widest`,
        colorClassName: 'text-gray-600',
    },
    [TypographyVariant.QUOTE]: {
        component: 'blockquote',
        className: `${commonStylesClassName} font-light italic text-lg md:text-xl`,
        colorClassName: 'text-gray-800',
    },
    [TypographyVariant.BUTTON_TEXT]: {
        component: 'span',
        className: `${commonStylesClassName} font-semibold text-base md:text-lg`,
        colorClassName: 'text-white',
    },
};

function TextComponent({
    variant = TypographyVariant.BODY,
    ignoreImplicitSpacing = false,
    inline = false,
    disabled = false,
    className,
    href,
    target,
    textColor,
    as,
    ...other
}: Props) {
    const {
        className: variantClassName,
        colorClassName,
        spacingClassName,
        component: DefaultComponent,
    } = variantStyles[variant];

    const Component: ElementType = as || (inline ? 'span' : DefaultComponent);

    return (
        <Component
            {...other}
            href={href}
            target={target}
            className={tailwind(
                'font-sans',
                variantClassName,
                colorClassName,
                !ignoreImplicitSpacing && spacingClassName,
                { 'text-gray-400': disabled },
                className,
            )}
        />
    );
}

export const Typography = React.memo(TextComponent);
