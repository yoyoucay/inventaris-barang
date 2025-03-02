// components/Chart.tsx
'use client'; // Mark this file as a Client Component

import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import react-apexcharts and disable SSR
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ChartProps {
    options: any; // ApexCharts configuration options
    series: any[]; // Data series for the chart
    type: 'line' | 'bar' | 'pie' | 'donut' | 'radialBar' | 'heatmap' | 'treemap'; // Chart type
    height: string | number; // Height of the chart
}

const Chart: React.FC<ChartProps> = ({ options, series, type, height }) => {
    return (
        <div>
            <ApexCharts
                options={options}
                series={series}
                type={type}
                height={height}
            />
        </div>
    );
};

export default Chart;