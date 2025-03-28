import { ReactNode, useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';


interface DashboardLayoutProps {
    children: ReactNode;
}

export default function PageLayout({ children }: DashboardLayoutProps) {
    const { isAuthenticated, user } = useUser();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Redirect to login if user is not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
    }, [user]);

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} sRole={user?.sRole} />
            <div className={`flex-1 ${isSidebarOpen ? 'ml-72' : 'ml-20'} transition-all duration-300 ease-in-out`} style={{ backgroundImage: `url('${process.env.NEXT_PUBLIC_BASE_PATH}/images/background/img-school.jpg')`, backgroundPosition: 'center', backgroundSize: '1000px 1000px' }}>
                <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
                <main className="w-full p-2 mt-16">{children}</main>
            </div>
        </div>
    );
}