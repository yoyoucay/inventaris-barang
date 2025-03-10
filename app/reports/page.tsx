// app/reports/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { httpGet } from '@/modules/lib/utils/https';
import PageLayout from '@/components/shared/PageLayout';
import Loading from '@/components/shared/Loading';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PdfDocument from '@/components/shared/PdfDocument';
import Card from '@/components/shared/Card';

export default function Reports() {
    const [pageState, setPageState] = useState<number>(0);
    const [rowData, setRowData] = useState<any>([]);
    const [localLoading, setLocalLoading] = useState<boolean>(false);


    const getData = async () => {
        const response = httpGet('/api/report');
        const data: any = await response;
        console.log('data report : ', data)
        setRowData(data.sort((a: any, b: any) => {
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
        })));
        setPageState(1)
    };

    useEffect(() => {
        getData();
    }, [localLoading]);

    return pageState > 0 ? (
        <PageLayout>
            <div className="p-2">
                <main className="p-4 mt-2">
                    <div className="col-span-12 space-y-4">
                        <div className='grid grid-cols-1 gap-4'>
                            <Card>
                                <PDFDownloadLink
                                    target="_blank"
                                    document={<PdfDocument title="Laporan Inventaris SMP Negeri 8 Batam" data={rowData} splitBy={['Tahun', 'Semester']} />}
                                    fileName="report.pdf"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                >
                                    {({ loading }) => (loading ? 'Generating PDF...' : 'Preview Report')}
                                </PDFDownloadLink>
                            </Card>
                        </div>
                    </div>
                </main>
            </div>
        </PageLayout>
    ) : <Loading />;
}