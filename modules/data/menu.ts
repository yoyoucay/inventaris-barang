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
        label: 'Inventory',
        icon: 'bx bx-package', // Boxicon class for Warehouse
        href: '/inventory',
        submenu: [
            {
                id: 21,
                label: 'Data Entry',
                icon: 'bx bx-user-circle', // Boxicon class for User Circle
                href: '/inventory/data-entry',
            },
            {
                id: 22,
                label: 'Master Data',
                icon: 'bx bx-shield', // Boxicon class for Shield
                href: '/inventory/master-data',
            },
        ],
    },
    {
        id: 3,
        label: 'Reports',
        icon: 'bx bx-cog', // Boxicon class for Settings
        href: '/reports',
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