// data/menu.ts
interface MenuItem {
    id: number;
    label: string;
    icon: string;
    href: string;
    sRole?: string;
    submenu?: MenuItem[];
}

export const menuItems: MenuItem[] = [
    {
        id: 1,
        label: 'Dashboard',
        icon: 'bx bx-pie-chart-alt-2',
        href: '/dashboard',
    },
    {
        id: 2,
        label: 'Inventory',
        icon: 'bx bx-package',
        href: '/inventory',
        sRole: 'admin, kepsek',
        submenu: [
            {
                id: 21,
                label: 'Data Entry',
                icon: 'bx bx-log-in-circle',
                href: '/inventory/data-entry',
            },
            {
                id: 22,
                label: 'Master Data',
                icon: 'bx bx-coin-stack',
                href: '/inventory/master-data',
            },
        ],
    },
    {
        id: 3,
        label: 'Reports',
        icon: 'bx bxs-report',
        href: '/reports',
    },
    {
        id: 4,
        label: 'Account User',
        icon: 'bx bxs-user-account',
        href: '/account-user',
        sRole: 'admin'
    },
    {
        id: 5,
        label: 'Logout',
        icon: 'bx bx-log-out',
        href: '/logout',
    },
];