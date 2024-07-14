import React from 'react';
type Props = {
  title?: string
}
export function Header({ title }: Props) {
  return (
    <header className="border h-16 pt-4 pl-2">
      <div className="container">
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
    </header>
  );
};