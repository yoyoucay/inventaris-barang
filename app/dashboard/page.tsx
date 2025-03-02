// app/dashboard/page.tsx
'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserContext } from '../context/UserContext';
import Loading from '../../components/shared/Loading';
import Sidebar from '@/components/shared/Sidebar';
import Navbar from '@/components/shared/Navbar';
import DashboardLayout from '@/components/shared/DashboardLayout';
import Card from '@/components/shared/Card';

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
            <div className="p-4">
                <main className="p-4 mt-2">
                    <div className='col-span-12 space-y-4'>
                        <div className='grid grid-cols-6 gap-4'>
                            <Card>
                                <h1>Welcome, {user?.sEmail}!</h1>
                                <button onClick={logout}>Logout</button>
                            </Card>
                            <Card>
                                <h1>Welcome, {user?.sEmail}!</h1>
                                <button onClick={logout}>Logout</button>
                            </Card>
                        </div>
                    </div>

                </main>
            </div>
        </DashboardLayout>
    ) : <Loading />;
}


