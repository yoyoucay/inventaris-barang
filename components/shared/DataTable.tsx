// components/DataTable.tsx
'use client'; // Mark this as a Client Component

import React from 'react';
import { AllCommunityModule, ModuleRegistry, provideGlobalGridOptions, themeQuartz } from 'ag-grid-community';
import dynamic from 'next/dynamic';

const AgGridReact = dynamic(
    () => import('ag-grid-react').then((mod) => mod.AgGridReact),
    { ssr: false }
);
// Mark all grids as using legacy themes
provideGlobalGridOptions({
    theme: "legacy",
});

ModuleRegistry.registerModules([AllCommunityModule]);

interface DataTableProps {
    columnDefs: any[];
    rowData: any[];
    pagination?: boolean;
    paginationPageSize?: number;
    rowSelection?: 'single' | 'multiple'; // Enable row selection
    onFilterChanged?: (event: any) => void;
}

const DataTable: React.FC<DataTableProps> = ({
    columnDefs,
    rowData,
    pagination = true,
    paginationPageSize = 10,
    rowSelection = 'multiple',
    onFilterChanged
}) => {

    const myTheme = themeQuartz.withParams({ accentColor: 'red' });

    return (
        <div className="ag-theme-alpine w-full h-fit">
            <AgGridReact
                columnDefs={columnDefs.map(col => ({ ...col, flex: 1 }))} // Column configuration
                rowData={rowData} // Data rows
                pagination={pagination} // Enable/disable pagination
                paginationPageSize={paginationPageSize} // Rows per page
                domLayout="autoHeight" // Automatically adjust height based on content
                onFilterChanged={onFilterChanged}
                rowSelection={rowSelection}
            />
        </div>
    );
};

export default DataTable;