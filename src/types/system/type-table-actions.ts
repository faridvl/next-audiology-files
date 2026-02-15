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
