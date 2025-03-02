// app/dashboard/page.tsx
'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserContext } from '../context/UserContext';
import Loading from '../../components/shared/Loading';
import Sidebar from '@/components/shared/Sidebar';
import Navbar from '@/components/shared/Navbar';
import DashboardLayout from '@/components/shared/DashboardLayout';

export default function Dashboard() {
    const { user, logout, isAuthenticated } = useContext(UserContext);
    const [pageState, setPageState] = useState<number>(0);
    const router = useRouter();

    // Redirect to login if user is not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        setPageState(1)

    }, [user]);

    return pageState > 0 ? (
        <DashboardLayout>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <main className="p-6 mt-16">
                    <div>
                        <h1>Welcome, {user?.sEmail}!</h1>
                        <button onClick={logout}>Logout</button>
                    </div>
                </main>
            </div>
        </DashboardLayout>
    ) : <Loading />;
}


