import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';


interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 ml-64">
                <Navbar />
                <main className="p-6 mt-16">{children}</main>
            </div>
        </div>
    );
}