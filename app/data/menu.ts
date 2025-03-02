// data/menu.ts
interface MenuItem {
    id: number;
    label: string;
    icon: string; // Store the icon as a string (e.g., Boxicons class name)
    href: string;
    submenu?: MenuItem[]; // Optional submenu
}

export const menuItems: MenuItem[] = [
    {
        id: 1,
        label: 'Dashboard',
        icon: 'bx bx-pie-chart-alt-2', // Boxicon class for Home
        href: '/dashboard',
    },
    {
        id: 2,
        label: 'Profile',
        icon: 'bx bx-user', // Boxicon class for User
        href: '/profile',
    },
    {
        id: 3,
        label: 'Settings',
        icon: 'bx bx-cog', // Boxicon class for Settings
        href: '/settings',
        submenu: [
            {
                id: 31,
                label: 'Account',
                icon: 'bx bx-user-circle', // Boxicon class for User Circle
                href: '/settings/account',
            },
            {
                id: 32,
                label: 'Security',
                icon: 'bx bx-shield', // Boxicon class for Shield
                href: '/settings/security',
            },
        ],
    },
    {
        id: 4,
        label: 'Logout',
        icon: 'bx bx-log-out', // Boxicon class for Logout
        href: '/logout',
    },
];