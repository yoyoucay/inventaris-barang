// app/inventory/master-data/page.tsx
'use client';

import Card from '@/components/shared/Card';
import DataTable from '@/components/shared/DataTable';
import Divider from '@/components/shared/Divider';
import FileUpload from '@/components/shared/FileUpload';
import ImageList from '@/components/shared/ImageList';
import ImageUpload from '@/components/shared/ImageUpload';
import InputText from '@/components/shared/InputText';
import Loading from '@/components/shared/Loading';
import Modal from '@/components/shared/Modal';
import PageLayout from '@/components/shared/PageLayout';
import SelectInput from '@/components/shared/SelectInput';
import Textarea from '@/components/shared/TextArea';
import { UserContext } from '@/context/UserContext';
import { httpGet, httpPost } from '@/modules/lib/utils/https';
import { PayloadProps } from '@/modules/lib/utils/payload';
import { showSwal } from '@/modules/lib/utils/swal';
import { updateState } from '@/modules/lib/utils/updateState';
import { useContext, useEffect, useState } from 'react';

interface YearOption {
    value: string;
    label: string;
}

export default function EntryData() {
    const { user, isAuthenticated } = useContext(UserContext);
    const [isModalOpen, setIsModalOpen] = useState({
        entry: false,
        photo: false
    });
    const [formData, setFormData] = useState<any>({
        sKode: '',
        iSemester: { value: '', label: '' },
        iYear: { value: '', label: '' },
        sDesc: '',
        iCondition1: "0",
        iCondition2: "0",
        iCondition3: "0",
    });
    const [pageState, setPageState] = useState<number>(0);
    const [error, setError] = useState<string>('');
    const [file, setFile] = useState<File[] | null>(null);
    const [rowData, setRowData] = useState<any>([]);
    const [folderPath, setFolderPath] = useState<string>('');
    const [imageName, setImageName] = useState<string[]>([]);
    const [localLoading, setLocalLoading] = useState<boolean>(false);
    const [barangOptions, setBarangOptions] = useState<YearOption[]>([]);

    // Define column definitions
    const columnDefs = [
        { headerName: 'ID', field: 'iTransID', sortable: true, filter: true, hide: true },
        { headerName: 'Kode', field: 'sKode', sortable: true, filter: true },
        { headerName: 'Nama', field: 'sName', sortable: true, filter: true },
        { headerName: 'Semester', field: 'iSemester', sortable: true, filter: true },
        { headerName: 'Tahun', field: 'iYear', sortable: true, filter: true },
        { headerName: 'Baik', field: 'iCondition1', sortable: true, filter: true },
        { headerName: 'Kurang Baik', field: 'iCondition2', sortable: true, filter: true },
        { headerName: 'Rusak', field: 'iCondition3', sortable: true, filter: true },
        { headerName: 'Jumlah', field: 'iSumCondition', sortable: true, filter: false },
        { headerName: 'Deskripsi', field: 'sDesc', sortable: true, filter: true },
        {
            headerName: 'Actions',
            cellRenderer: (params: any) => {
                if (params?.data) {
                    const handPreview = () => {
                        setIsModalOpen({ entry: false, photo: true });
                        setFormData({
                            sKode: params.data.sKode,
                            iSemester: params.data.iSemester,
                            iYear: params.data.iYear,
                            sDesc: params.data.sDesc,
                            iCondition1: params.data.iCondition1,
                            iCondition2: params.data.iCondition2,
                            iCondition3: params.data.iCondition3,
                        })
                    };

                    return (
                        <div className="flex items-center gap-2 justify-center">
                            <button
                                onClick={handPreview}
                                className="px-2 bg-blue-500 text-white rounded ml-2 text-center"
                            >
                                Preview
                            </button>
                            {user?.sRole === 'kepsek' && !params.data.iApproved && (
                                <button
                                    onClick={() => handleApprove(params.data.iYear, params.data.iSemester)}
                                    className="px-2 bg-green-500 text-white rounded ml-2"
                                >
                                    Approve
                                </button>
                            )}
                        </div>
                    );
                } else {
                    return null;
                }
            },
            sortable: false,
            filter: false,
        },
    ];


    const handleChange = (key: keyof typeof formData, value: any) => {
        if (typeof value === 'string') {
            updateState(setFormData, key, value);
        } else if (value instanceof File) {
            updateState(setFormData, key, value);
        } else {
            updateState(setFormData, key, value?.value ?? value);
        }
    };

    const handleFileChange = (files: File[] | null) => {
        if (files) {
            setFile(files)
        } else {
            console.log('No files selected.');
        }
    }

    const currentYear = new Date().getFullYear();
    const years: YearOption[] = Array.from({ length: currentYear - 2019 }, (_, i) => ({
        value: (2020 + i).toString(),
        label: (2020 + i).toString(),
    }));

    const currentSemester = new Date().getMonth() >= 6 ? 2 : 1;
    const semesters: YearOption[] = Array.from({ length: 2 }, (_, i) => ({
        value: (currentSemester + i) % 2 === 0 ? '2' : '1',
        label: `${(currentSemester + i) % 2 === 0 ? 'Genap' : 'Ganjil'}`,
    }));

    const handleSubmit = async (e: any) => {
        setLocalLoading(true);
        e.preventDefault();

        let payload: any;
        if (formData.data && formData.data.length > 0) {
            let data = formData.data.map((item: any) => {
                return {
                    sKode: item["Kode"],
                    iSemester: item["Semester"] === 'Ganjil' ? 1 : 2,
                    iYear: item["Tahun"],
                    iCondition1: item["Baik"],
                    iCondition2: item["Kurang Baik"],
                    iCondition3: item["Rusak"],
                    sDesc: item["Deskripsi"],
                    iStatus: 1,
                    iModifyBy: user?.iUserID
                }
            });
            payload = {
                totalItems: formData.data.length,
                items: data
            };
        } else {

            let requiredFields = [
                { name: 'iCondition1', alias: 'Baik' },
                { name: 'iCondition2', alias: 'Kurang Baik' },
                { name: 'iCondition3', alias: 'Rusak' },
            ];
            for (const field of requiredFields) {
                if (!formData[field.name]) {
                    setError(`${field.alias} wajib diisi`);
                    return;
                }
            }

            payload = {
                totalItems: 1,
                items: [{
                    sKode: formData.sKode,
                    iSemester: formData.iSemester,
                    iYear: formData.iYear,
                    iCondition1: formData.iCondition1 ?? 0,
                    iCondition2: formData.iCondition2 ?? 0,
                    iCondition3: formData.iCondition3 ?? 0,
                    sDesc: formData.sDesc ?? '',
                    iStatus: 1,
                    iModifyBy: user?.iUserID,
                }],
            };
        }
        console.log('payload before send : ', payload)
        const response: any = await httpPost('/api/entry', payload);
        setLocalLoading(false);
        console.log('response:', response);
        if (response.statusReq && response.statusCode === 200) {
            handleClose();
        } else {
            const data = await response;
            setError(data.sMessage || 'Registrasi Barang gagal. Silahkan coba lagi.');
        }
    };

    const handleUploadPhoto = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('File : ', file)


        if (!file || !user?.iUserID) {
            setError("Please select a file and provide a valid user ID.");
            return;
        }

        console.log('formData : ', formData)
        const promises = file.map(async (f) => {
            const formDataPOST: any = new FormData();
            formDataPOST.append("file", f); // Append the file
            formDataPOST.append("sKode", formData.sKode || '');
            formDataPOST.append("iSemester", formData.iSemester === 'Ganjil' ? 1 : 2);
            formDataPOST.append("iYear", formData.iYear || '');
            formDataPOST.append("iUserID", user?.iUserID?.toString() || '');

            // Send the FormData object
            const response = await fetch(process.env.NEXT_PUBLIC_BASE_PATH + "/api/entry-photo", {
                method: "POST",
                body: formDataPOST, // No need to set Content-Type manually
            });

            if (response.ok) {
                return { success: true, message: 'Entry Photo Inserted!' };
            } else {
                const errorData = await response.json();
                return { success: false, message: errorData.error || "Failed to upload file" };
            }
        });

        const results = await Promise.all(promises);

        const successCount = results.filter((r) => r.success).length;
        const failedCount = results.filter((r) => !r.success).length;

        if (successCount === results.length) {
            showSwal({
                title: 'Entry Photo Inserted!',
                icon: 'success',
                confirmButtonText: 'OK',
            })
            handleClose();
        } else {
            setError(`Failed to upload file ${failedCount} of ${results.length}`);
            showSwal({
                title: 'Failed to upload file',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    };

    const handleClose = () => {
        setIsModalOpen((prev) => ({
            ...prev,
            entry: false,
            photo: false
        }));
        setError('');
        setFormData({
            sKode: '',
            iSemester: { value: '', label: '' },
            iYear: { value: '', label: '' },
            sDesc: '',
            iCondition1: "0",
            iCondition2: "0",
            iCondition3: "0",
        });
    };

    const handleApprove = (iYear: string, iSemester: string) => {
        console.log('handleApprove');
        setLocalLoading(true);
        const payload: PayloadProps = {
            totalItems: 1,
            items: [{
                iYear: iYear,
                iSemester: iSemester === 'Ganjil' ? 1 : 2,
                iModifyBy: user?.iUserID
            }]
        };
        httpPost('/api/entry-approve', payload).then((response) => {
            console.log('response : ', response);
            showSwal({
                title: 'Entry Approved!',
                icon: 'success',
                confirmButtonText: 'OK',
            })
            setLocalLoading(false);
        });
    }

    const getData = async () => {
        const response = httpGet('/api/entry');
        const data = await response;
        setRowData(data);
        setPageState(1)
    };

    const getPhotoEntry = async (iYear: string, iSemester: string) => {
        const response = httpGet('/api/entry-photo?iYear=' + iYear + '&iSemester=' + (iSemester === 'Ganjil' ? '1' : '2'));
        const data: any = await response;
        console.log('data photo entry : ', data);
        setImageName(data.map((item: any) => item.sImgName));
        setFolderPath(process.env.NEXT_PUBLIC_BASE_PATH + '/entry/' + formData.sKode + '-' + formData.iYear + '-' + (formData.iSemester === 'Ganjil' ? '1' : '2'));
    };

    useEffect(() => {
        getData();
    }, [localLoading]);


    const fetchBarangOptions = async () => {
        try {
            const response: any = await httpGet('/api/barang');
            const options: YearOption[] = response.map((item: any) => ({
                value: item.sKode,
                label: item.sKode + ' - ' + item.sName,
            }));
            setBarangOptions(options);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchBarangOptions();
    }, [formData.sKode]);

    useEffect(() => {
        if (isModalOpen.photo) {
            getPhotoEntry(formData.iYear, formData.iSemester);

        }
    }, [isModalOpen.photo]);

    console.log('folderPath : ', folderPath);
    console.log('imageName : ', imageName)

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
                                    <h1 className="text-2xl font-bold">Data Entry</h1>
                                    <div className="flex justify-end">
                                        <a href={`${process.env.NEXT_PUBLIC_BASE_PATH}/template/FormatEntry.xlsx`} download>
                                            <button className="px-4 py-2 bg-green-500 text-white rounded">
                                                Download Template
                                            </button>
                                        </a>
                                        <button
                                            onClick={() => setIsModalOpen({ entry: true, photo: false })}
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
                <Modal isOpen={isModalOpen.entry} onConfirm={(e: any) => handleSubmit(e)} onClose={() => handleClose()} title="Data Entry Inventory">

                    <div className='mb-4'>
                        <div className="grid grid-cols-2 gap-4">
                            <SelectInput
                                id={'iSemester'}
                                name={'iSemester'}
                                label="Semester"
                                onChange={(e) => handleChange('iSemester', { value: e?.value, label: e?.label })}
                                defaultValue={formData.iSemester || null}
                                options={semesters}
                                limitOption={3}
                            />
                            <SelectInput
                                id={'iYear'}
                                name={'iYear'}
                                label="Tahun"
                                onChange={(e) => handleChange('iYear', { value: e?.value, label: e?.label })}
                                defaultValue={formData.iYear || null}
                                options={years}
                                limitOption={8}
                            />
                        </div>
                        <Divider />
                        <SelectInput
                            id={'sKode'}
                            name={'sKode'}
                            label="Kode Barang"
                            onChange={(e) => handleChange('sKode', { value: e?.value, label: e?.label })}
                            defaultValue={formData.sKode || ''}
                            options={barangOptions}
                            limitOption={3}
                        />
                        <div className="grid grid-cols-3 gap-4">
                            <InputText
                                id={'iCondition1'}
                                name={'iCondition1'}
                                required={true}
                                label="Baik"
                                type="number"
                                onChange={(e) => handleChange('iCondition1', e.target.value)}
                                defaultValue={formData.iCondition1 || "0"}
                            />
                            <InputText
                                id={'iCondition2'}
                                name={'iCondition2'}
                                required={true}
                                label="Kurang Baik"
                                type="number"
                                onChange={(e) => handleChange('iCondition2', e.target.value)}
                                defaultValue={formData.iCondition2 || "0"}
                            />
                            <InputText
                                id={'iCondition3'}
                                name={'iCondition3'}
                                required={true}
                                label="Rusak"
                                type="number"
                                onChange={(e) => handleChange('iCondition3', e.target.value)}
                                defaultValue={formData.iCondition3 || "0"}
                            />
                        </div>
                        <Textarea
                            id="sDesc"
                            name="sDesc"
                            defaultValue={formData.sDesc || ''}
                            onChange={(e) => handleChange('sDesc', e.target.value)}
                            placeholder="Deskripsi Barang"
                            label="Deskripsi Barang"
                            error={error}
                            rows={6}
                            required
                        />
                    </div>
                    {error && <div className="text-center text-red-500 ">{error}</div>}

                    <Divider margin="my-4" />

                    <FileUpload
                        accept=".xlsx,.xls" // Customize accepted file types
                        onFileChange={(file) => handleChange('file', file)}
                        onFileRead={(data) => handleChange('data', data)}
                    />
                </Modal>

                <Modal isOpen={isModalOpen.photo} onConfirm={(e: any) => handleUploadPhoto(e)} onClose={() => handleClose()} title="Tambah Photo Data Entry Inventory">
                    {/* list image */}
                    <ImageList imageName={imageName} pathFolder={folderPath} />
                    <Divider margin="my-4" />
                    <ImageUpload onFileChange={handleFileChange} />
                </Modal>
            </div>
        </PageLayout>
    ) : <Loading />;
}
