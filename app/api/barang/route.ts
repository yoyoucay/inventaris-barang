// app/api/users/route.ts
import bcrypt from "bcrypt";
import pool from '@/modules/lib/db';
import { BarangProps as Barang } from '@/modules/lib/definitions/barang';
import { NextResponse } from 'next/server';
import { apiResponse } from "@/modules/lib/utils/apiResponse";

export async function POST(request: Request) {
    const barang = await request.json();
    try {
        const insertedId = await createBarang(barang);
        return apiResponse({ sMessage: 'Registrasi Barang Berhasil!', statusReq: true, statusCode: 200 });
    } catch (error) {
        console.error(error);
        return apiResponse({ sMessage: 'Registrasi Barang Gagal!', statusReq: false, statusCode: 500 });
    }
}

export async function GET() {
    const users = await getBarang();
    return NextResponse.json(users);
}

export async function createBarang(barang: Barang & { isEdit: boolean }) {
    const connection = await pool.getConnection(); // Get a connection from the pool

    try {
        await connection.beginTransaction(); // Start a transaction
        let query: string;
        let params: any[] = [barang.sKode, barang.sName, barang.sUoM, 1, 1];
        if (barang.isEdit) {
            query = `UPDATE tumx03 SET sName = ?, sUoM = ?, iStatus = ?, iUpdateBy = ? 
                     WHERE sKode = ?`;
            params.unshift(barang.sKode);
        } else {
            query = `INSERT INTO tumx03 (sKode, sName, sUoM, iStatus, iCreateBy) 
                     VALUES (?, ?, ?, ?, ?)`;
        }

        const [result] = await connection.execute(query, params);

        // Step 2: Get the inserted ID
        const [rows]: any = await connection.query('SELECT LAST_INSERT_ID() as insertedId');
        const insertedId = rows[0].insertedId;

        await connection.commit(); // Commit the transaction

        return insertedId; // Return the inserted ID
    } catch (error) {
        await connection.rollback(); // Rollback the transaction in case of error
        console.error('Error creating Barang:', error);
        throw error; // Re-throw the error
    } finally {
        connection.release(); // Release the connection back to the pool
    }
}

// Read all users
export async function getBarang() {
    const [rows] = await pool.query('SELECT * FROM tumx03');
    return rows;
}
