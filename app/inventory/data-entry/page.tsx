// app/dashboard/page.tsx
'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageLayout from '@/components/shared/PageLayout';
import Card from '@/components/shared/Card';
import Chart from '@/components/shared/Chart';
import DataTable from '@/components/shared/DataTable';
import { UserContext } from '@/context/UserContext';
import Loading from '@/components/shared/Loading';

export default function DataEntry() {
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

    // Define column definitions
    const columnDefs = [
        { headerName: 'ID', field: 'id', sortable: true, filter: true },
        { headerName: 'Name', field: 'name', sortable: true, filter: true },
        { headerName: 'Age', field: 'age', sortable: true, filter: true },
        { headerName: 'Email', field: 'email', sortable: true, filter: true },
    ];

    // Define row data
    const rowData = [
        { id: 1, name: 'John Doe', age: 28, email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', age: 34, email: 'jane@example.com' },
        { id: 3, name: 'Sam Wilson', age: 45, email: 'sam@example.com' },
        { id: 4, name: 'Emily Davis', age: 23, email: 'emily@example.com' },
    ];

    return pageState > 0 ? (
        <PageLayout>
            <div className="p-2">
                <main className="p-4 mt-2">
                    <div className='col-span-12 space-y-4'>
                        <div className='grid grid-cols-6 gap-4'>
                            <Card>
                                <h1>Welcome, {user?.sEmail}!</h1>
                            </Card>
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                            <Card>
                                <h1 className="text-2xl font-bold mb-4">Sales Chart</h1>
                                <Chart
                                    options={chartOptions}
                                    series={chartSeries}
                                    type="line"
                                    height={350}
                                />
                            </Card>
                            <Card>
                                <h1 className="text-2xl font-bold mb-4">History Data</h1>
                                <DataTable
                                    columnDefs={columnDefs}
                                    rowData={rowData}
                                    pagination={true}
                                    paginationPageSize={5}

                                />
                            </Card>
                        </div>
                    </div>

                </main>
            </div>
        </PageLayout>
    ) : <Loading />;
}


