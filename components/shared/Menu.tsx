// components/Menu.tsx
import { menuItems } from '@/app/data/menu';
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
}

const MenuItem = ({ item, isSidebarOpen }: MenuItemProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if (!isSidebarOpen) {
            setIsExpanded(false);
        }
    }, [isSidebarOpen])

    return (
        <li className="flex flex-col">
            <div
                onClick={() => item.submenu && isSidebarOpen && setIsExpanded(!isExpanded)}
                className={`flex items-center p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer ${item.submenu ? 'cursor-pointer' : ''
                    }`}
            >
                <i className={`${item.icon} text-xl ${isSidebarOpen ? 'mr-3' : 'mx-auto'}`}></i>
                {isSidebarOpen && <span>{item.label}</span>}
                {item.submenu && isSidebarOpen && (
                    <i
                        className={`bx ${isExpanded ? 'bx-chevron-down' : 'bx-chevron-right'} ml-auto text-lg`}
                    ></i>
                )}
            </div>
            <ul
                className={`ml-6 mt-1 space-y-1 overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}
            >
                {item.submenu?.map((subItem) => (
                    <li key={subItem.id}>
                        <a
                            href={subItem.href}
                            className="flex items-center p-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                        >
                            <i className={`${subItem.icon} text-lg mr-3`}></i>
                            <span>{subItem.label}</span>
                        </a>
                    </li>
                ))}
            </ul>
        </li>
    );
};

export const MenuList = ({ isSidebarOpen }: { isSidebarOpen: boolean }) => {
    return (
        <ul className="space-y-2">
            {menuItems.map((item) => (
                <MenuItem key={item.id} item={item} isSidebarOpen={isSidebarOpen} />
            ))}
        </ul>
    );
};