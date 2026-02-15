export type MenuAction = {
  action?: (parameter?: any) => void;
  title?: string;
  disabled?: boolean;
  buttonClassName?: string;
  hideIconOnMobile?: boolean;
  disabledKeyReference?: string;
};
