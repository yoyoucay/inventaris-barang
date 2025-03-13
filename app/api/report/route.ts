// app/api/report/route.ts
import pool from '@/modules/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('iYear');
    const semester = searchParams.get('iSemester');

    const users = await getReport(year, semester);
    return NextResponse.json(users);
}

// Read all users with optional filtering
export async function getReport(year: string | null, semester: string | null) {
    console.log('getReport :', { year, semester });
    let query = 'SELECT * FROM v_entry_rpt';
    const conditions = [];

    if (year) {
        conditions.push(`iYear = ${year}`);
    }
    if (semester) {
        conditions.push(`iSemester = '${semester === '1' ? 'Ganjil' : 'Genap'}' COLLATE utf8mb4_unicode_ci`);
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    console.log('query :', query);

    const [rows] = await pool.query(query);
    console.log('result :', rows);
    return rows;
}