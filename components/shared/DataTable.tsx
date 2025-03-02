// components/DataTable.tsx
'use client'; // Mark this as a Client Component

import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry, provideGlobalGridOptions, themeQuartz } from 'ag-grid-community';


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
}

const DataTable: React.FC<DataTableProps> = ({
    columnDefs,
    rowData,
    pagination = true,
    paginationPageSize = 10,
    rowSelection = 'multiple',
}) => {

    const myTheme = themeQuartz.withParams({ accentColor: 'red' });

    return (
        <div className="ag-theme-alpine" style={{ height: '400px', width: '100%' }}>
            <AgGridReact
                // theme={myTheme}
                columnDefs={columnDefs} // Column configuration
                rowData={rowData} // Data rows
                pagination={pagination} // Enable/disable pagination
                paginationPageSize={paginationPageSize} // Rows per page
                domLayout="autoHeight" // Automatically adjust height based on content
                rowSelection={rowSelection}
            />
        </div>
    );
};

export default DataTable;