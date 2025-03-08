// app/inventory/master-data/page.tsx
'use client';

import Card from '@/components/shared/Card';
import DataTable from '@/components/shared/DataTable';
import Divider from '@/components/shared/Divider';
import FileUpload from '@/components/shared/FileUpload';
import InputText from '@/components/shared/InputText';
import Loading from '@/components/shared/Loading';
import Modal from '@/components/shared/Modal';
import PageLayout from '@/components/shared/PageLayout';
import BarcodeComponent, { BarcodeRef } from '@/components/shared/PdfBarcode';
import SelectInput from '@/components/shared/SelectInput';
import { UserContext } from '@/context/UserContext';
import { BarangProps } from '@/modules/lib/definitions/barang';
import { types, uoms } from '@/modules/lib/definitions/uom';
import { httpGet, httpPost } from '@/modules/lib/utils/https';
import { updateState } from '@/modules/lib/utils/updateState';
import { useContext, useEffect, useRef, useState } from 'react';

export default function MasterData() {

    const { user, isAuthenticated } = useContext(UserContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [formData, setFormData] = useState<BarangProps | any>({
        sKode: '',
        sName: '',
        iType: { value: '', label: '' },
        sUoM: { value: '', label: '' },
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

    console.log('formData :', formData)

    const handleSubmit = async (e: any) => {
        setLocalLoading(true);
        e.preventDefault();
        let requiredFields = [
            { name: 'sKode', alias: 'Kode Barang' },
            { name: 'sName', alias: 'Nama Barang' },
            { name: 'sUoM', alias: 'Satuan Barang' },
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
        console.log('formData.data : ', formData.data)
        if (formData.data && formData.data.length > 0) {
            payload = {
                totalItems: formData.data.length,
                items: formData.data.map((item: any) => ({
                    sKode: item.Kode,
                    sName: item.Nama,
                    iType: types.find((types) => types.label === item.Tipe)?.value || '',
                    sUoM: item.UoM,
                    iModifyBy: user?.iUserID
                })),
            };
        } else {
            payload = {
                totalItems: 1,
                items: [{
                    sKode: formData.sKode,
                    sName: formData.sName,
                    iType: typeof formData.iType === 'object' ? formData.iType.value : formData.iType || '',
                    sUoM: typeof formData.sUoM === 'object' ? formData.sUoM.value : formData.sUoM || '',
                    iModifyBy: user?.iUserID
                }],
            };
        }
        console.log('payload before send : ', payload)
        const response: any = await httpPost('/api/barang', { ...payload, isEdit: isEdit });
        setLocalLoading(false);
        console.log('response:', response);
        if (response.statusReq && response.statusCode === 200) {
            handleClose();
        } else {
            const data = await response;
            setError(data.sMessage || 'Registrasi Barang gagal. Silahkan coba lagi.');
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
        const sUoM = uoms.find((uom) => uom.value === row.sUoM);
        const iType = types.find((type) => type.value.toString() === row.iType.toString());
        setFormData({
            sKode: row.sKode,
            sName: row.sName,
            iType: { value: iType?.value || '', label: iType?.label || '' },
            sUoM: { value: sUoM?.value || '', label: sUoM?.label || '' },
        });
        setIsEdit(true);
        setIsModalOpen(true);
    };
    const getData = async () => {
        const response = httpGet('/api/barang');
        const data = await response;
        setRowData(data);
        setPageState(1)
    };

    const handlePreviewPDF = async () => {
        if (barcodeRef.current) {
            try {
                const pdfUrl = await barcodeRef.current.generatePdfUrl();
                window.open(pdfUrl, "_blank");
            } catch (error) {
                console.error("Failed to generate PDF:", error);
            }
        }
    };


    useEffect(() => {
        getData();
    }, [localLoading]);

    // Define column definitions
    const columnDefs = [
        { headerName: 'ID', field: 'iBarangID', sortable: true, filter: true },
        { headerName: 'Kode', field: 'sKode', sortable: true, filter: true },
        { headerName: 'Nama', field: 'sName', sortable: true, filter: true },
        {
            headerName: 'Jenis',
            field: 'iType',
            cellRenderer: (params: any) => {
                const val = params.value.toString();
                return (
                    <div className='flex items-center justify-center'>
                        <span className={`px-2 rounded ${params.value === "1" ? 'bg-green-100' : 'bg-red-100'}`}>
                            {params.value === "1" ? 'Prasarana' : 'Sarana'}
                        </span>
                    </div>
                )

            },
        },
        { headerName: 'Satuan', field: 'sUoM', sortable: true, filter: true },
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
            headerName: 'Barcode',
            field: 'sKode',
            cellRenderer: (params: any) => (
                <div className="items-center gap-2 justify-center">
                    <button
                        onClick={handlePreviewPDF}
                        className="px-4 items-center text-center bg-blue-500 text-white rounded block mx-auto"
                    >
                        Print
                    </button>
                    <BarcodeComponent value={params.data.sKode} name={params.data.sName} ref={barcodeRef} />
                </div>
            ),
        },
        {
            headerName: 'Action',
            field: 'iBarangID',
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
                iBarangID: row.iBarangID,
                iStatus,
                iModifyBy: user?.iUserID,
            }],
            isUpdateStatus: true,
        };
        setLocalLoading(true)
        const response: any = await httpPost('/api/barang', payload);
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
                                    <h1 className="text-2xl font-bold">Master Data Barang</h1>
                                    <div className="flex justify-end">
                                        <a href={`${process.env.NEXT_PUBLIC_BASE_PATH}/template/FormatBarang.xlsx`} download>
                                            <button className="px-4 py-2 bg-green-500 text-white rounded">
                                                Download Template
                                            </button>
                                        </a>
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
                <Modal isOpen={isModalOpen} onConfirm={(e: any) => handleSubmit(e)} onClose={() => handleClose()} title="Master Data Barang">

                    <div className='mb-30'>
                        <InputText
                            id={'sKode'}
                            name={'sKode'}
                            disabled={isEdit}
                            required={true}
                            label="Kode Barang"
                            onChange={(e) => handleChange('sKode', e.target.value)}
                            defaultValue={formData.sKode || ''}
                        />
                        <InputText
                            id={'sNama'}
                            name={'sNama'}
                            required={true}
                            label="Nama Barang"
                            onChange={(e) => handleChange('sName', e.target.value)}
                            defaultValue={formData.sName || ''}
                        />
                        <SelectInput
                            id={'iType'}
                            name={'iType'}
                            label="Jenis Barang"
                            onChange={(e) => handleChange('iType', { value: e?.value, label: e?.label })}
                            defaultValue={formData.iType || null}
                            options={types}
                            limitOption={3}
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
                    </div>
                    {error && <div className="text-center text-red-500 ">{error}</div>}

                    <Divider margin="my-6" />

                    {!isEdit && (
                        <FileUpload
                            accept=".xlsx,.xls" // Customize accepted file types
                            onFileChange={(file) => handleChange('file', file)}
                            onFileRead={(data) => handleChange('data', data)}
                        />
                    )}
                </Modal>
            </div>
        </PageLayout>
    ) : <Loading />;
}
