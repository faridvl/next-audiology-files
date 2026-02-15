// src/components/common/menu-item/menu-item.tsx
import React, { ReactNode } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems, Transition, Portal } from '@headlessui/react';
import { MoreVertical } from 'lucide-react';

export type Action = {
    name: string;
    icon: ReactNode;
    onClick: (row: any) => void | Promise<any>;
    isDanger?: boolean;
    variant?: any; // TODO(!)L agregar el variant real 
};

interface ToggleMenuProps {
    actions: Action[];
    rowData: any;
}

export function ToggleMenu({ actions, rowData }: ToggleMenuProps) {
    return (
        <div className="relative inline-block text-left">
            <Menu>
                {({ open }) => (
                    <>
                        <MenuButton
                            className={`p-2 rounded-xl transition-all outline-none ${open ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'
                                }`}
                        >
                            <MoreVertical size={18} strokeWidth={2.5} />
                        </MenuButton>

                        <Portal>
                            <Transition
                                as={React.Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <MenuItems
                                    anchor="bottom end"
                                    className="w-48 rounded-2xl bg-white shadow-2xl shadow-slate-300/50 border border-slate-100 ring-0 focus:outline-none z-[9999] overflow-hidden p-1.5"
                                >
                                    {actions?.map((action, index) => (
                                        <MenuItem key={`${action.name}-${index}`}>
                                            {({ active }) => (
                                                <button
                                                    className={`
                            flex w-full items-center gap-3 px-3 py-2 text-[13px] font-bold rounded-xl transition-colors
                            ${active
                                                            ? (action.variant === 'danger' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600')
                                                            : (action.variant === 'danger' ? 'text-red-500' : 'text-slate-600')
                                                        }
                          `}
                                                    onClick={() => action.onClick(rowData)}
                                                >
                                                    {action.name}
                                                </button>
                                            )}
                                        </MenuItem>
                                    ))}
                                </MenuItems>
                            </Transition>
                        </Portal>
                    </>
                )}
            </Menu>
        </div>
    );
}