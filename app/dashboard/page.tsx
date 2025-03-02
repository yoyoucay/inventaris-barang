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
import Chart from '@/components/shared/Chart';

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

    const chartOptions = {
        chart: {
            id: 'basic-bar',
        },
        xaxis: {
            categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
        },
    };

    const chartSeries = [
        {
            name: 'Sales',
            data: [30, 40, 45, 50, 49, 60, 70, 91, 125],
        },
    ];

    return pageState > 0 ? (
        <DashboardLayout>
            <div className="p-4">
                <main className="p-4 mt-2">
                    <div className='col-span-12 space-y-4'>
                        <div className='grid grid-cols-6 gap-4'>
                            <Card>
                                <h1>Welcome, {user?.sEmail}!</h1>
                            </Card>
                        </div>

                        <div className='grid grid-cols-1 gap-4'>
                            <Card>
                                <h1 className="text-2xl font-bold mb-4">Sales Chart</h1>
                                <Chart
                                    options={chartOptions}
                                    series={chartSeries}
                                    type="line"
                                    height={350}
                                />
                            </Card>
                        </div>

                    </div>

                </main>
            </div>
        </DashboardLayout>
    ) : <Loading />;
}


