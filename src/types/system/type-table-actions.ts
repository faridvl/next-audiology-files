// import { BilloIconSymbol } from 'components/common/icon/billo-icon';
// import { NewButtonVariant } from '../../components/common/button/new-button';

export type MenuAction = {
    // billoIcon?: BilloIconSymbol;
    action?: (parameter?: any) => void;
    title?: string;
    disabled?: boolean;
    buttonClassName?: string;
    // variant?: NewButtonVariant;
    hideIconOnMobile?: boolean;
    disabledKeyReference?: string;
};