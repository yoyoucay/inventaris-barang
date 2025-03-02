// components/Menu.tsx
import { menuItems } from '@/modules/data/menu';
import React, { useEffect, useState } from 'react';

interface MenuItemProps {
    item: {
        id: number;
        label: string;
        icon: string; // Boxicon class name
        href: string;
        submenu?: Array<{ id: number; label: string; icon: string; href: string }>;
    };
    isSidebarOpen: boolean; // Add a prop to check if the sidebar is open
    isHovered?: boolean;
}

const MenuItem = ({ item, isSidebarOpen, isHovered }: MenuItemProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    useEffect(() => {
        if (!isSidebarOpen && !isHovered) {
            setIsExpanded(false);
        }
    }, [isSidebarOpen, isHovered]);

    // Check if the item has a submenu
    const hasSubmenu = !!item.submenu;

    return (
        <li className="flex flex-col">
            {/* Parent Menu Item */}
            {hasSubmenu ? (
                // If the item has a submenu, make it expandable
                <div
                    onClick={() => (isSidebarOpen || isHovered) && setIsExpanded(!isExpanded)}
                    className={`flex items-center p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer`}
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
                    className="flex items-center p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                >
                    <i className={`${item.icon} text-xl ${isSidebarOpen || isHovered ? 'mr-3' : 'mx-auto'}`}></i>
                    {(isSidebarOpen || isHovered) && <span>{item.label}</span>}
                </a>
            )}

            {/* Submenu Items */}
            {hasSubmenu && (
                <ul
                    className={`ml-6 mt-1 space-y-1 overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                        }`}
                >
                    {item.submenu?.map((subItem) => (
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

export const MenuList = ({ isSidebarOpen, isHovered }: { isSidebarOpen: boolean, isHovered?: boolean }) => {
    return (
        <ul className="space-y-2">
            {menuItems.map((item) => (
                <MenuItem key={item.id} item={item} isSidebarOpen={isSidebarOpen} isHovered={isHovered} />
            ))}
        </ul>
    );
};