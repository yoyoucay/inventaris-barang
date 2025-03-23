// app/dashboard/page.tsx
'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserContext } from '../../context/UserContext';
import Loading from '../../components/shared/Loading';
import PageLayout from '@/components/shared/PageLayout';
import Card from '@/components/shared/Card';
import Chart from '@/components/shared/Chart';
import DataTable from '@/components/shared/DataTable';
import { httpGet } from '@/modules/lib/utils/https';
import { getParamsUrl } from '@/modules/lib/utils/functions';

export default function Dashboard() {
    const { user, logout, isAuthenticated } = useContext(UserContext);
    const [data, setData] = useState<any>({
        barang: undefined,
        rowData: undefined
    });
    const [pageState, setPageState] = useState<number>(0);
    const [filteredData, setFilteredData] = useState<any>([]);
    const router = useRouter();

    // Redirect to login if user is not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
    }, [user]);
    console.log('user : ', user)


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
    ];

    const getData = async () => {
        let response: any;
        response = await httpGet(`/api/entry?${getParamsUrl({ iApproved: 1 })}`);
        let entry = await response;

        let rowData = entry;

        entry = entry.map((item: any) => ({
            ...item,
            iCondition1: Number(item.iCondition1),
            iCondition2: Number(item.iCondition2),
            iCondition3: Number(item.iCondition3),
        }));

        let cardData = {
            sarana: entry.filter((item: any) => item.iType == "Sarana").length,
            prasarana: entry.filter((item: any) => item.iType == "Prasarana").length,
            baik: entry.reduce((prev: any, current: any) => prev + current.iCondition1, 0),
            kurangBaik: entry.reduce((prev: any, current: any) => prev + current.iCondition2, 0),
            rusak: entry.reduce((prev: any, current: any) => prev + current.iCondition3, 0),
        };

        setData({
            ...data,
            sarana: entry.filter((item: any) => item.iType == "Sarana").length,
            prasarana: entry.filter((item: any) => item.iType == "Prasarana").length,
            baik: entry.reduce((prev: any, current: any) => prev + current.iCondition1, 0),
            kurangBaik: entry.reduce((prev: any, current: any) => prev + current.iCondition2, 0),
            rusak: entry.reduce((prev: any, current: any) => prev + current.iCondition3, 0),
        });

        const chartData = entry.map((item: any) => ({
            name: item.sName,
            data: [item.iCondition1, item.iCondition2, item.iCondition3],
        }));

        setData({
            ...data,
            cardData: cardData,
            chartData: chartData,
            rowData: rowData
        });
    }

    const onFilterChanged = (params: any) => {
        const filteredRows: any = [];
        params.api.forEachNodeAfterFilter((node: any) => {
            filteredRows.push(node.data);
        });
        setFilteredData(filteredRows);
        const chartData = filteredRows.map((item: any) => ({
            name: item.sName,
            data: [item.iCondition1, item.iCondition2, item.iCondition3],
        }));
        setData({
            ...data,
            chartData: chartData,
        });
    };


    const chartOptions = {
        chart: {
            id: 'basic-bar',
            type: 'bar',
        },
        xaxis: {
            categories: ['Baik', 'Kurang Baik', 'Rusak'],
        },
    };

    const chartSeries = data.chartData || [];

    console.log('data:  ', data)

    useEffect(() => {
        getData();
        setPageState(1);
    }, []);


    return pageState > 0 ? (
        <PageLayout>
            <div className="p-2">
                <main className="p-4 mt-2">
                    <div className='col-span-12 space-y-4'>
                        <div className='grid grid-cols-6 gap-4'>
                            <Card>
                                <div className="flex items-center gap-2">
                                    <i className="bx bx-user text-2xl p-2"></i>
                                    <h1>Welcome, {user?.sEmail}!</h1>
                                </div>
                            </Card>
                            <Card>
                                <h1 className="text-1xl font-bold mb-4">Jumlah Barang terdaftar</h1>
                                <p className="text-2xl font-bold">Sarana : {data.cardData?.sarana ?? 0} </p>
                                <p className="text-2xl font-bold">Prasarana : {data.cardData?.prasarana ?? 0} </p>
                            </Card>
                            <Card>
                                <h1 className="text-1xl font-bold mb-4">Kondisi Inventaris</h1>
                                <p className="text-xl font-bold">Baik : {data.cardData?.baik ?? 0} </p>
                                <p className="text-xl font-bold">Kurang Baik : {data.cardData?.kurangBaik ?? 0} </p>
                                <p className="text-xl font-bold">Rusak : {data.cardData?.rusak ?? 0} </p>
                            </Card>
                        </div>

                        <div className='grid grid-cols-1 gap-4'>
                            <Card>
                                <h1 className="text-2xl font-bold mb-4">Kondisi Inventaris</h1>
                                <Chart
                                    options={chartOptions}
                                    series={chartSeries}
                                    type="bar"
                                    height={350}
                                />
                            </Card>
                            <Card>
                                <h1 className="text-2xl font-bold mb-4">Entry Inventory</h1>
                                <DataTable
                                    columnDefs={columnDefs}
                                    rowData={data.rowData || []}
                                    pagination={true}
                                    paginationPageSize={5}
                                    onFilterChanged={onFilterChanged}
                                />
                            </Card>
                        </div>
                    </div>

                </main>
            </div>
        </PageLayout>
    ) : <Loading />;
}
