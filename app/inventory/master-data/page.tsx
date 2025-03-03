// app/inventory/master-data/page.tsx
'use client';

import Card from '@/components/shared/Card';
import DataTable from '@/components/shared/DataTable';
import InputText from '@/components/shared/InputText';
import Loading from '@/components/shared/Loading';
import Modal from '@/components/shared/Modal';
import PageLayout from '@/components/shared/PageLayout';
import SelectInput from '@/components/shared/SelectInput';
import { UserContext } from '@/context/UserContext';
import { BarangProps } from '@/modules/lib/definitions/barang';
import { uoms } from '@/modules/lib/definitions/uom';
import { httpPost } from '@/modules/lib/utils/https';
import { updateState } from '@/modules/lib/utils/updateState';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';

export default function MasterData() {
    const { user, isAuthenticated } = useContext(UserContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [formData, setFormData] = useState<BarangProps>({
        sKode: '',
        sName: '',
        sUoM: { value: '', label: '' },
    });
    const [pageState, setPageState] = useState<number>(0);
    const [error, setError] = useState<string>('');
    const router = useRouter();

    const handleChange = (key: keyof typeof formData, value: any) => {
        if (typeof value === 'string') {
            updateState(setFormData, key, value);
        } else {
            updateState(setFormData, key, value.value);
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        let payload: BarangProps = {
            sKode: formData.sKode,
            sName: formData.sName,
            sUoM: formData.sUoM
        }

        console.log('payload :', payload);

        const response: any = await httpPost('/api/barang', { ...payload, isEdit: isEdit });
        console.log('response:', response);
        if (response.statusReq && response.statusCode === 200) {
            handleClose();
        } else {
            const data = await response;
            setError(data.sMessage || 'Login failed. Please try again.');
        }
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setFormData({
            sKode: '',
            sName: '',
            sUoM: { value: '', label: '' },
        });
    };

    // Redirect to login if user is not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        setPageState(1)

    }, [user]);

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
                <Modal isOpen={isModalOpen} onConfirm={(e: any) => handleSubmit(e)} onClose={() => handleClose()} title="Master Data Barang">
                    {error && <div className="text-red-500">{error}</div>}
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
                        limitOption={3}
                    />
                </Modal>
            </div>
        </PageLayout>
    ) : <Loading />;
}
