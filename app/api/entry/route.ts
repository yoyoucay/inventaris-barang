// app/api/barang/route.ts
import pool from '@/modules/lib/db';
import { apiResponse } from "@/modules/lib/utils/apiResponse";
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const payload = await request.json();
    try {
        await crudEntry(payload);
        return apiResponse({ sMessage: 'Entry Data Berhasil!', statusReq: true, statusCode: 200 });
    } catch (error) {
        console.error(error);
        return apiResponse({ sMessage: 'Entry Data Gagal!', statusReq: false, statusCode: 500 });
    }
}

export async function crudEntry(payload: any) {
    const connection = await pool.getConnection(); // Get a connection from the pool

    try {
        await connection.beginTransaction(); // Start a transaction

        const queries = payload.items.map((item: any) => {
            return `INSERT INTO tudt02 (sKode, iSemester, iYear, iCondition1, iCondition2, iCondition3, sDesc, iStatus, iCreateBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        });

        const params = payload.items.map((item: any) => {
            return [item.sKode, item.iSemester, item.iYear, item.iCondition1, item.iCondition2, item.iCondition3, item.sDesc, 1, item.iModifyBy];
        });

        console.log('queries : ', queries);
        console.log('params : ', params);

        const results = await Promise.all(params.map((param: any, index: any) => connection.execute(queries[index], param)));

        console.log('results : ', results);

        await connection.commit(); // Commit the transaction
    } catch (error) {
        await connection.rollback(); // Rollback the transaction in case of error
        console.error('Error creating Barang:', error);
        throw error; // Re-throw the error
    } finally {
        connection.release(); // Release the connection back to the pool
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('iYear');
    const semester = searchParams.get('iSemester');
    const iApproved = searchParams.get('iApproved');
    const result = await getEntry(year, semester, iApproved);
    return NextResponse.json(result);
}

// Read all users
export async function getEntry(year: string | null, semester: string | null, iApproved: string | null) {
    console.log('getReport :', { year, semester });
    let query = 'SELECT * FROM v_entry_rpt';
    const conditions = [];

    if (year) {
        conditions.push(`iYear = ${year}`);
    }
    if (semester) {
        conditions.push(`iSemester = '${semester === '1' ? 'Ganjil' : 'Genap'}' COLLATE utf8mb4_unicode_ci`);
    }

    if (iApproved) {
        conditions.push(`iApproved = ${iApproved}`);
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    console.log('query :', query);

    const [rows] = await pool.query(query);
    console.log('result :', rows);
    return rows;
}
