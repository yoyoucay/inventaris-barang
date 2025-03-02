// data/menu.ts
import { FaHome, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa'; // Example icons (install react-icons if needed)

interface MenuItem {
    id: number;
    label: string;
    icon: string;
    href: string;
}

export const menuItems: MenuItem[] = [
    {
        id: 1,
        label: 'Dashboard',
        icon: '<FaHome className="w-5 h-5" />',
        href: '/dashboard',
    },
    {
        id: 2,
        label: 'Profile',
        icon: '<FaUser className="w-5 h-5" />',
        href: '/profile',
    },
    {
        id: 3,
        label: 'Settings',
        icon: '<FaCog className="w-5 h-5" />',
        href: '/settings',
    },
    {
        id: 4,
        label: 'Logout',
        icon: '<FaSignOutAlt className="w-5 h-5" />',
        href: '/logout',
    },
];