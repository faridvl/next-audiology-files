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
    className?: string;
    spacingClassName?: string;
    component: ElementType;
};

const brandPrimary = 'text-[#1E3A8A]';
const neutralDark = 'text-slate-900';
const neutralBase = 'text-slate-700';
const neutralLight = 'text-slate-500';

const commonStylesClassName = 'font-sans tracking-tight';

const variantStyles: { [key in TypographyVariant]: VariantStyle } = {
    [TypographyVariant.HEADER]: {
        component: 'h1',
        className: `${commonStylesClassName} font-extrabold text-2xl md:text-3xl leading-tight`,
        colorClassName: neutralDark,
    },
    [TypographyVariant.SUBTITLE]: {
        component: 'h2',
        className: `${commonStylesClassName} font-semibold text-xl md:text-2xl leading-snug`,
        colorClassName: neutralBase,
    },
    [TypographyVariant.ACCENT]: {
        component: 'h3',
        className: `${commonStylesClassName} font-semibold text-lg md:text-xl`,
        colorClassName: brandPrimary,
    },
    [TypographyVariant.BODY]: {
        component: 'p',
        className: `${commonStylesClassName} font-normal text-[15px] leading-relaxed`,
        colorClassName: neutralBase,
    },
    [TypographyVariant.BODY_BOLD]: {
        component: 'p',
        className: `${commonStylesClassName} font-bold text-[15px]`,
        colorClassName: neutralBase,
    },
    [TypographyVariant.BODY_SEMIBOLD]: {
        component: 'p',
        className: `${commonStylesClassName} font-semibold text-[15px]`,
        colorClassName: neutralBase,
    },
    [TypographyVariant.HELPER]: {
        component: 'p',
        className: `${commonStylesClassName} font-normal text-[13px]`,
        colorClassName: neutralLight,
    },
    [TypographyVariant.LINK_TEXT]: {
        component: 'a',
        className: `${commonStylesClassName} font-medium text-[15px] cursor-pointer transition-colors duration-200 hover:opacity-80`,
        colorClassName: brandPrimary,
    },
    [TypographyVariant.CAPTION]: {
        component: 'span',
        className: `${commonStylesClassName} font-normal text-[12px]`,
        colorClassName: neutralLight,
    },
    [TypographyVariant.OVERLINE]: {
        component: 'span',
        className: `${commonStylesClassName} font-semibold text-[11px] uppercase tracking-[0.18em]`,
        colorClassName: neutralLight,
    },
    [TypographyVariant.QUOTE]: {
        component: 'blockquote',
        className: `${commonStylesClassName} font-light italic text-lg`,
        colorClassName: neutralDark,
    },
    [TypographyVariant.BUTTON_TEXT]: {
        component: 'span',
        className: `${commonStylesClassName} font-semibold text-[14px]`,
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
                variantClassName,
                textColor || colorClassName,
                !ignoreImplicitSpacing && spacingClassName,
                { 'text-slate-400': disabled },
                className,
            )}
        />
    );
}

export const Typography = React.memo(TextComponent);
