import React from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { CustomIcon, IconName, IconSize } from '../custom-icon/custom-icon';

export type Action = {
    name: string;
    onClick: (row: any) => void;
};
type MenuItemProps = {
    onClick: (e: any) => void,
    actions?: Action[],
};



export function ToggleMenu({ onClick, actions }: MenuItemProps) {
    return (
        <div className="relative inline-block text-left">
            <Menu as="div">
                <MenuButton className="inline-flex justify-center w-full px-1 py-1 text-sm font-medium text-white rounded-md hover:bg-blue-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                    <CustomIcon icon={IconName.ELLIPSIS_VERTICAL_ICON} size={IconSize.LG} />
                </MenuButton>
                <MenuItems className="absolute right-0 mt-2 w-28 origin-top-right rounded-md shadow-lg bg-white  ring-black ">
                    <div className="py-1">
                        {
                            actions?.map((action: Action) => {
                                return (
                                    <MenuItem>
                                        {({ active }) => (
                                            <button
                                                className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                                    } group flex w-full items-center px-4 py-2 text-sm`}
                                                onClick={onClick}
                                            >
                                                {action.name}
                                            </button>
                                        )}
                                    </MenuItem>
                                )
                            })
                        }
                    </div>
                </MenuItems>
            </Menu>
        </div>
    );
}
