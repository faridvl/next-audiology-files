import { ReactElement } from 'react';
//import useWindowDimensions from '../../../../shared/hooks/use-window-dimensions';

type Props = {
  children: JSX.Element | ReactElement | null;
  className?: string;
}

export function DesktopView({ children, className }: Props): JSX.Element | ReactElement | null {
  const  isDesktop  = true

  if (!isDesktop) {
    return <></>;
  }

  if (!className || className === '') {
    return children;
  }

  return <div className={className}>{children}</div>;
}
