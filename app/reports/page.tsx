// app/reports/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { httpGet } from '@/modules/lib/utils/https';
import PageLayout from '@/components/shared/PageLayout';
import Loading from '@/components/shared/Loading';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import PdfDocument from '@/components/shared/PdfDocument';
import Card from '@/components/shared/Card';
import SelectInput from '@/components/shared/SelectInput';
import { getParamsUrl } from '@/modules/lib/utils/functions';
import DataTable from '@/components/shared/DataTable';


export default function Reports() {
    const [pageState, setPageState] = useState<number>(0);
    const [rowData, setRowData] = useState<any>([]);

    useEffect(() => {
        getData();
        setPageState(1)
    }, []);


    const getData = async () => {
        const response = httpGet(`/api/report?${getParamsUrl({ iApproved: 1 })}`);
        const data: any = await response;
        if (data.length > 0) {
            const result = data.sort((a: any, b: any) => {
                if (a.iYear !== b.iYear) {
                    return a.iYear - b.iYear;
                }
                if (a.iSemester !== b.iSemester) {
                    return a.iSemester - b.iSemester;
                }
                return a.sKode.localeCompare(b.sKode);
            }).map((item: any) => ({
                "Kode": item.sKode,
                "Nama": item.sName,
                "Tipe": item.iType,
                "Semester": item.iSemester,
                "Tahun": item.iYear,
                "Baik": item.iCondition1,
                "Krg. Baik": item.iCondition2,
                "Rusak": item.iCondition3,
                "Jumlah": item.iSumCondition,
                "Deskripsi": item.sDesc
            }));

            const transformedData = data.map((item: any) => ({
                Kode: item.sKode,
                Nama: item.sName,
                Tipe: item.iType,
                Semester: item.iSemester,
                Tahun: item.iYear,
                Baik: item.iCondition1,
                'Krg. Baik': item.iCondition2,
                Rusak: item.iCondition3,
                Jumlah: item.iSumCondition,
                Deskripsi: item.sDesc,
            }));

            setRowData(transformedData);
        } else {
            setRowData([]);
        }
    };

    console.log('rowData : ', rowData)

    return pageState > 0 ? (
        <PageLayout>
            <div className="p-2">
                <main className="p-4 mt-2">
                    <div className="col-span-12 space-y-4">
                        <div className='grid grid-cols-1 gap-4'>
                            <div className="grid grid-cols-1 gap-4">
                                <Card>
                                    <DataTable
                                        columnDefs={columnDefs}
                                        rowData={rowData}
                                    />
                                    <div className="flex justify-end mt-2">
                                        {rowData && (
                                            <PDFDownloadLink
                                                document={<PdfDocument title="Laporan Inventaris SMP Negeri 8 Batam" data={rowData} splitBy={['Tahun', 'Semester']} />}
                                                fileName="report.pdf"
                                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                            >
                                                {({ blob, url, loading, error }) => (error ? 'Error generating PDF!' : loading ? 'Generating PDF...' : 'Preview Report')}
                                            </PDFDownloadLink>
                                        )}
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </PageLayout>
    ) : <Loading />;
}

const columnDefs = [
    { field: 'Kode', sortable: true, filter: true },
    { field: 'Nama', sortable: true, filter: true },
    { field: 'Tipe', sortable: true, filter: true },
    { field: 'Semester', sortable: true, filter: true },
    { field: 'Tahun', sortable: true, filter: true },
    { field: 'Baik', sortable: true, filter: true },
    { field: 'Krg. Baik', sortable: true, filter: true },
    { field: 'Rusak', sortable: true, filter: true },
    { field: 'Jumlah', sortable: true, filter: true },
    { field: 'Deskripsi', sortable: true, filter: true },
];