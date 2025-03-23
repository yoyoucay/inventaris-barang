// components/Menu.tsx
import { menuItems } from '@/modules/data/menu';
import React, { useEffect, useState } from 'react';

interface MenuItemProps {
    item: {
        id: number;
        label: string;
        icon: string; // Boxicon class name
        href: string;
        submenu?: Array<{ id: number; label: string; icon: string; href: string; sRole?: string }>;
        sRole?: string;
    };
    isSidebarOpen: boolean; // Add a prop to check if the sidebar is open
    isHovered?: boolean;
    sRole: string;
}

const MenuItem = ({ item, isSidebarOpen, isHovered, sRole }: MenuItemProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    useEffect(() => {
        if (!isSidebarOpen && !isHovered) {
            setIsExpanded(false);
        }
    }, [isSidebarOpen, isHovered]);

    // Check if the item has a submenu
    const hasSubmenu = !!item.submenu;

    // Filter the submenu items by sRole
    const filteredSubmenu = item.submenu?.filter((subItem) => !subItem.sRole || subItem.sRole === sRole);

    return (
        <li className="flex flex-col">
            {/* Parent Menu Item */}
            {hasSubmenu ? (
                // If the item has a submenu, make it expandable
                <div
                    onClick={() => (isSidebarOpen || isHovered) && setIsExpanded(!isExpanded)}
                    className={`flex items-center p-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer`}
                >
                    <i className={`${item.icon} text-xl ${isSidebarOpen || isHovered ? 'mr-3' : 'mx-auto'}`}></i>
                    {(isSidebarOpen || isHovered) && <span>{item.label}</span>}
                    {(isSidebarOpen || isHovered) && (
                        <i
                            className={`bx ${isExpanded ? 'bx-chevron-down' : 'bx-chevron-right'} ml-auto text-lg`}
                        ></i>
                    )}
                </div>
            ) : (
                // If the item does not have a submenu, make it a link
                <a
                    href={process.env.NEXT_PUBLIC_BASE_PATH + item.href}
                    className="flex items-center p-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                >
                    <i className={`${item.icon} text-xl ${isSidebarOpen || isHovered ? 'mr-3' : 'mx-auto'}`}></i>
                    {(isSidebarOpen || isHovered) && <span>{item.label}</span>}
                </a>
            )}

            {/* Submenu Items */}
            {hasSubmenu && filteredSubmenu && (
                <ul
                    className={`ml-6 mt-1 space-y-1 overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                        }`}
                >
                    {filteredSubmenu.map((subItem) => (
                        <li key={subItem.id}>
                            <a
                                href={process.env.NEXT_PUBLIC_BASE_PATH + subItem.href}
                                className="flex items-center p-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                            >
                                <i className={`${subItem.icon} text-lg mr-3`}></i>
                                <span>{subItem.label}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </li>
    );
};

export const MenuList = ({ isSidebarOpen, isHovered, sRole }: { isSidebarOpen: boolean, isHovered?: boolean, sRole: string }) => {
    // const filteredMenuItems = menuItems.filter((item) => !item.sRole || (item.sRole && item.sRole.split(',').includes(sRole)));
    console.log('sRole : ', sRole)
    const listitem = menuItems.filter((item: any) => item.sRole || item?.sRole?.split(',').includes(sRole))
    const listitem2 = menuItems.filter((item: any) => !item.sRole)
    const filteredMenuItems = [...listitem2, ...listitem].sort((a, b) => a.id - b.id);
    return (
        <ul className="space-y-2">
            {filteredMenuItems.map((item) => (
                <MenuItem key={item.id} item={item} isSidebarOpen={isSidebarOpen} isHovered={isHovered} sRole={sRole} />
            ))}
        </ul>
    );
};