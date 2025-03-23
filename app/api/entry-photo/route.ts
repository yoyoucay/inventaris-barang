// app/api/barang/route.ts
import fs from 'fs';
import path from 'path';
import pool from '@/modules/lib/db';
import { apiResponse } from "@/modules/lib/utils/apiResponse";
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const formData = await request.formData();
    const files = formData.get("file") as File;
    const iYear = formData.get("iYear") as string;
    const iSemester = formData.get("iSemester") as string;
    const iUserID = formData.get("iUserID") as string;
    const sKode = formData.get("sKode") as string;
    try {
        await crudEntry(files, sKode, iYear, iSemester, iUserID);
        return apiResponse({ sMessage: 'Upload Photo Entry Berhasil!', statusReq: true, statusCode: 200 });
    } catch (error) {
        console.error(error);
        return apiResponse({ sMessage: 'Upload Photo Entry Gagal!', statusReq: false, statusCode: 500 });
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('iYear');
    const semester = searchParams.get('iSemester');
    console.log('GET :', { year, semester });
    const result = await getPhotoEntry(year, semester);
    return NextResponse.json(result);
}

export async function crudEntry(files: File, sKode: string, iYear: string, iSemester: string, iUserID: string) {
    console.log('Files:', files);
    console.log('sKode:', sKode);
    console.log('iYear:', iYear);
    console.log('iSemester:', iSemester);
    console.log('iUserID:', iUserID);

    const folderName = `${sKode}-${iYear}-${iSemester}`; // Create folder name (e.g., "2024-1")
    const folderPath = path.join(process.cwd(), 'public/entry', folderName); // Full path to the folder

    try {
        // Check if the folder exists, if not, create it
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true }); // Create folder recursively
            console.log(`Folder created: ${folderPath}`);
        } else {
            console.log(`Folder already exists: ${folderPath}`);
        }

        const now = new Date();
        const fileName = `${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}${now.getHours()}${now.getMinutes()}${now.getSeconds()}${now.getMilliseconds()}.${files.name.split(".").pop()}`;

        const filePath = path.join(folderPath, fileName); // Full path to the file
        const fileBuffer = Buffer.from(await files.arrayBuffer()); // Convert file to buffer

        fs.writeFileSync(filePath, fileBuffer); // Save file to disk
        console.log(`File saved: ${filePath}`);

        const connection = await pool.getConnection(); // Get a connection from the pool

        try {
            await connection.beginTransaction(); // Start a transaction

            // Insert file records into the database
            const queries = `INSERT INTO tumx04 (sKode, iSemester, iYear, sImgName, iStatus, iCreateBy) VALUES (?, ?, ?, ?, ?, ?)`;

            const params = [sKode, iSemester, iYear, path.basename(filePath), 1, iUserID];

            console.log('Queries:', queries);
            console.log('Params:', params);

            const results = await connection.execute(queries, params);
            console.log('Results:', results);

            await connection.commit(); // Commit the transaction
        } catch (error) {
            await connection.rollback(); // Rollback the transaction in case of error
            console.error('Error creating Barang:', error);
            throw error; // Re-throw the error
        } finally {
            connection.release(); // Release the connection back to the pool
        }
    } catch (error) {
        console.error('Error saving files or creating folder:', error);
        throw error; // Re-throw the error
    }
}


export async function getPhotoEntry(year: string | null, semester: string | null) {
    console.log('getPhotoEntry :', { year, semester });
    let query = 'SELECT * FROM tumx04';
    const conditions = [];

    if (year) {
        conditions.push(`iYear = ${year}`);
    }
    if (semester) {
        conditions.push(`iSemester = '${semester}' COLLATE utf8mb4_unicode_ci`);
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    console.log('query :', query);

    const [rows] = await pool.query(query);
    console.log('result :', rows);
    return rows;
}