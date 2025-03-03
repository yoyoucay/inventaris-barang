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
import Modal from '@/components/shared/Modal';
import InputText from '@/components/shared/InputText';
import { updateState } from '@/modules/lib/utils/updateState';
import { BarangProps } from '@/modules/lib/definitions/barang';
import SelectInput from '@/components/shared/SelectInput';
import { uoms } from '@/modules/lib/definitions/uom';

export default function MasterData() {
    const { user, logout, isAuthenticated } = useContext(UserContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<BarangProps>({
        sKode: '',
        sName: '',
        sUoM: { value: '', label: '' },
    });
    const [pageState, setPageState] = useState<number>(0);
    const router = useRouter();

    const handleChange = (key: keyof typeof formData, value: any) => {
        if (typeof value === 'string') {
            updateState(setFormData, key, value);
        } else {
            updateState(setFormData, key, value.value);
        }
    };

    console.log(formData);

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

                        <div className='grid grid-cols-1 gap-4'>
                            <Card>
                                <div className="flex justify-between items-center mb-4">
                                    <h1 className="text-2xl font-bold">History Data</h1>
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="px-4 py-2 bg-blue-500 text-white rounded"
                                    >
                                        + Insert
                                    </button>
                                </div>
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
                <Modal isOpen={isModalOpen} onConfirm={() => setIsModalOpen(false)} onClose={() => setIsModalOpen(false)} title="Master Data Barang">
                    <InputText
                        id={'sKode'}
                        name={'sKode'}
                        label="Kode Barang"
                        onChange={(e) => handleChange('sKode', e.target.value)}
                        defaultValue={formData.sKode || ''}
                    />
                    <InputText
                        id={'sNama'}
                        name={'sNama'}
                        label="Nama Barang"
                        onChange={(e) => handleChange('sName', e.target.value)}
                        defaultValue={formData.sName || ''}
                    />
                    <SelectInput
                        id={'sUoM'}
                        name={'sUoM'}
                        label="Satuan Barang"
                        onChange={(e) => handleChange('sUoM', { value: e?.value, label: e?.label })}
                        defaultValue={formData.sUoM || null}
                        options={uoms}
                    />
                </Modal>
            </div>
        </PageLayout>
    ) : <Loading />;
}


