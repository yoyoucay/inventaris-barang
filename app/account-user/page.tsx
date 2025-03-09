// app/users/page.tsx
'use client';

import Card from '@/components/shared/Card';
import DataTable from '@/components/shared/DataTable';
import InputText from '@/components/shared/InputText';
import Loading from '@/components/shared/Loading';
import Modal from '@/components/shared/Modal';
import PageLayout from '@/components/shared/PageLayout';
import { BarcodeRef } from '@/components/shared/PdfBarcode';
import SelectInput from '@/components/shared/SelectInput';
import { UserContext } from '@/context/UserContext';
import { BarangProps } from '@/modules/lib/definitions/barang';
import { OptionProps } from '@/modules/lib/definitions/options';
import { types } from '@/modules/lib/definitions/uom';
import { httpGet, httpPost } from '@/modules/lib/utils/https';
import { updateState } from '@/modules/lib/utils/updateState';
import { useContext, useEffect, useRef, useState } from 'react';

export default function UserData() {

    const { user, isAuthenticated } = useContext(UserContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [formData, setFormData] = useState<any>({
        sUserName: '',
        sFullName: '',
        sEmail: '',
        sRole: { value: '', label: '' },
        iStatus: 1,
        iModifyBy: user?.iUserID,
    });
    const [pageState, setPageState] = useState<number>(0);
    const [error, setError] = useState<string>('');
    const [rowData, setRowData] = useState<any>([]);
    const [localLoading, setLocalLoading] = useState<boolean>(false);
    const barcodeRef = useRef<BarcodeRef>(null);

    const handleChange = (key: keyof typeof formData, value: any) => {
        if (typeof value === 'string') {
            updateState(setFormData, key, value);
        } else if (value instanceof File) {
            updateState(setFormData, key, value);
        } else {
            updateState(setFormData, key, value?.value ?? value);
        }
    };

    const roles: OptionProps[] = [
        { value: 'user', label: 'User' },
        { value: 'admin', label: 'Admin' },
    ];

    const handleSubmit = async (e: any) => {
        setLocalLoading(true);
        e.preventDefault();
        let requiredFields = [
            { name: 'sUserName', alias: 'Username' },
            { name: 'sFullName', alias: 'Nama User' },
            { name: 'sEmail', alias: 'Email' },
            { name: 'sRole', alias: 'Role' },
        ];
        if (!formData.data) {
            for (const field of requiredFields) {
                if (!formData[field.name]) {
                    setError(`${field.alias} wajib diisi`);
                    return;
                }
            }
        }
        let payload: any;
        payload = {
            totalItems: 1,
            items: [{
                iUserID: formData.iUserID,
                sUserName: formData.sUserName,
                sFullName: formData.sFullName,
                sEmail: formData.sEmail,
                sRole: typeof formData.sRole === 'object' ? formData.sRole.value : formData.sRole,
                iModifyBy: user?.iUserID
            }],
            isEdit: isEdit,
            isUpdateStatus: false
        };

        console.log('payload before send : ', payload)
        const response: any = await httpPost('/api/users', payload);
        setLocalLoading(false);
        console.log('response:', response);
        if (response.statusReq && response.statusCode === 200) {
            handleClose();
        } else {
            const data = await response;
            setError(data.sMessage || 'Update User gagal. Silahkan coba lagi.');
        }
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setIsEdit(false);
        setError('');
        setFormData({
            sKode: '',
            sName: '',
            iType: { value: '', label: '' },
            sUoM: { value: '', label: '' },
        });
    };
    const handleEdit = (row: any) => {
        setFormData({
            sUserName: row.sUserName,
            sFullName: row.sFullName,
            sEmail: row.sEmail,
            sRole: { value: row.sRole, label: row.sRole.charAt(0).toUpperCase() + row.sRole.slice(1) },
            iStatus: row.iStatus,
            iModifyBy: row.iModifyBy,
            iUserID: row.iUserID,
        });
        setIsEdit(true);
        setIsModalOpen(true);
    };

    const getData = async () => {
        const response = httpGet('/api/users');
        const result: any = await response;
        if (!result.statusReq) {
            setError(result.sMessage || 'Data User Tidak Ditemukan. Silahkan coba lagi.');
            return;
        }
        setRowData(result.data);
        setPageState(1)
    };

    useEffect(() => {
        getData();
    }, [localLoading]);

    // Define column definitions
    const columnDefs = [
        { headerName: 'ID', field: 'iUserID', sortable: true, filter: true, hide: true },
        { headerName: 'Username', field: 'sUserName', sortable: true, filter: true },
        { headerName: 'Nama', field: 'sFullName', sortable: true, filter: true },
        {
            headerName: 'Email',
            field: 'sEmail',
            sortable: true,
            filter: true
        },
        {
            headerName: 'Role',
            field: 'sRole',
            sortable: true,
            filter: true,
            valueFormatter: (params: any) => params.value?.charAt(0).toUpperCase() + params.value?.slice(1)
        },
        {
            headerName: 'Status',
            field: 'iStatus',
            cellRenderer: (params: any) => (
                <div className='flex items-center justify-center'>
                    <span className={`px-2 rounded ${params.value === 1 ? 'bg-green-100' : 'bg-red-100'}`}>
                        {params.value === 1 ? 'Active' : 'Non-Active'}
                    </span>
                </div>
            ),
        },
        {
            headerName: 'Action',
            field: 'iUserID',
            cellRenderer: (params: any) => (
                <div className="flex items-center gap-2 justify-center">
                    <button
                        onClick={() => handleEdit(params.data)}
                        className="px-4 items-center text-center bg-green-500 text-white rounded block mx-auto"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleChangeStatus(params.data)}
                        className="px-4 items-center text-center bg-blue-500 text-white rounded block mx-auto"
                    >
                        {params.data.iStatus === 1 ? 'Deactive' : 'Active'}
                    </button>
                </div>
            ),
        },
    ];

    const handleChangeStatus = async (row: any) => {
        const iStatus = row.iStatus === 1 ? 0 : 1;
        const payload = {
            totalItems: 1,
            items: [{
                iUserID: row.iUserID,
                iStatus,
                iModifyBy: user?.iUserID,
            }],
            isUpdateStatus: true,
        };
        setLocalLoading(true)
        const response: any = await httpPost('/api/users', payload);
        if (response.statusReq && response.statusCode === 200) {
            setLocalLoading(false)
        } else {
            const data = await response;
            setError(data.sMessage || 'Registrasi Barang gagal. Silahkan coba lagi.');
        }
    };

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
                                    <h1 className="text-2xl font-bold">User Account</h1>
                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => setIsModalOpen(true)}
                                            className="px-4 py-2 bg-blue-500 text-white rounded ml-2"
                                        >
                                            + Insert
                                        </button>
                                    </div>
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
                <Modal isOpen={isModalOpen} onConfirm={(e: any) => handleSubmit(e)} onClose={() => handleClose()} title="User Data">

                    <div className='mb-30'>
                        <InputText
                            id={'sUserName'}
                            name={'sUserName'}
                            disabled={isEdit}
                            required={true}
                            label="Username"
                            onChange={(e) => handleChange('sUserName', e.target.value)}
                            defaultValue={formData.sUserName || ''}
                        />
                        <InputText
                            id={'sFullName'}
                            name={'sFullName'}
                            required={true}
                            label="Nama User"
                            onChange={(e) => handleChange('sFullName', e.target.value)}
                            defaultValue={formData.sFullName || ''}
                        />
                        <InputText
                            id={'sEmail'}
                            name={'sEmail'}
                            required={true}
                            label="Email"
                            onChange={(e) => handleChange('sEmail', e.target.value)}
                            defaultValue={formData.sEmail || ''}
                        />
                        <SelectInput
                            id={'sRole'}
                            name={'sRole'}
                            label="Role"
                            onChange={(e) => handleChange('sRole', { value: e?.value, label: e?.label })}
                            defaultValue={formData.sRole || null}
                            options={roles}
                            limitOption={3}
                        />
                        {isEdit ? (
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={() => console.log('Reset Password')}
                                    className="px-4 py-2 bg-blue-500 text-white rounded ml-2"
                                >
                                    Reset Password
                                </button>
                            </div>
                        ) : null}
                    </div>
                    {error && <div className="text-center text-red-500 ">{error}</div>}
                </Modal>
            </div>
        </PageLayout>
    ) : <Loading />;
}
