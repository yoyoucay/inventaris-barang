// app/components/PdfDocument.tsx
import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Define styles for the PDF
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#E4E4E4',
        padding: 20,
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
    },
    title: {
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 20,
    },
    table: {
        display: 'flex',
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        marginBottom: 20, // Add margin between tables
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableCol: {
        width: '16.66%', // Adjust based on the number of columns
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
    },
    tableCell: {
        margin: 5,
        fontSize: 10,
    },
    tableHeader: {
        backgroundColor: '#3B82F6', // Blue color for header
        color: '#FFFFFF', // White text color
        fontWeight: 'bold',
    },
    groupTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

// Define the props for the PDF component
interface PdfDocumentProps {
    title: string;
    data: Array<{ [key: string]: any }>; // Dynamic data structure
    splitBy?: string[]; // Array of column names to split the data by
}

const PdfDocument: React.FC<PdfDocumentProps> = ({ title, data, splitBy }) => {
    // Get the keys (column names) from the first object in the data array
    const columns = data.length > 0 ? Object.keys(data[0]) : [];

    // Filter out the splitBy columns from the table columns
    const tableColumns = splitBy
        ? columns.filter((column) => !splitBy.includes(column))
        : columns;

    // Group data by the `splitBy` columns if provided
    const groupedData = splitBy
        ? data.reduce((acc, row) => {
            // Create a composite key using the values of the `splitBy` columns
            const key = splitBy.map((col) => row[col]).join('-');
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(row);
            return acc;
        }, {} as { [key: string]: Array<{ [key: string]: any }> })
        : { [title]: data }; // If no splitBy, treat all data as one group

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text style={styles.title}>{title}</Text>

                    {/* Render tables for each group */}
                    {Object.entries(groupedData).map(([groupKey, groupData]) => (
                        <View key={groupKey}>
                            {/* Group Title */}
                            {splitBy && (
                                <Text style={styles.groupTitle}>
                                    {splitBy.map((col, index) => (
                                        <React.Fragment key={col}>
                                            {col}: {groupData[0][col]}
                                            {index < splitBy.length - 1 ? ', ' : ''}
                                        </React.Fragment>
                                    ))}
                                </Text>
                            )}

                            {/* Render the table */}
                            <View style={styles.table}>
                                {/* Table Header */}
                                <View style={[styles.tableRow, styles.tableHeader]}>
                                    {tableColumns.map((column, index) => (
                                        <View key={index} style={styles.tableCol}>
                                            <Text style={styles.tableCell}>{column}</Text>
                                        </View>
                                    ))}
                                </View>

                                {/* Table Rows */}
                                {groupData.map((row: any, rowIndex: any) => (
                                    <View key={rowIndex} style={styles.tableRow}>
                                        {tableColumns.map((column: any, colIndex: any) => (
                                            <View key={colIndex} style={styles.tableCol}>
                                                <Text style={styles.tableCell}>{row[column]}</Text>
                                            </View>
                                        ))}
                                    </View>
                                ))}
                            </View>
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    );
};

export default PdfDocument;