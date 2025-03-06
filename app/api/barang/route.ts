// app/api/users/route.ts
import bcrypt from "bcrypt";
import pool from '@/modules/lib/db';
import { BarangProps as Barang } from '@/modules/lib/definitions/barang';
import { NextResponse } from 'next/server';
import { apiResponse } from "@/modules/lib/utils/apiResponse";

export async function POST(request: Request) {
    const payload = await request.json();
    try {
        const insertedId = await crudBarang(payload);
        return apiResponse({ sMessage: 'Registrasi Barang Berhasil!', statusReq: true, statusCode: 200 });
    } catch (error) {
        console.error(error);
        return apiResponse({ sMessage: 'Registrasi Barang Gagal!', statusReq: false, statusCode: 500 });
    }
}

export async function crudBarang(payload: any) {
    const connection = await pool.getConnection(); // Get a connection from the pool
    console.log('payload.items : ', payload.items);

    try {
        await connection.beginTransaction(); // Start a transaction

        const queries = payload.items.map((item:any) => {
            if (payload.isUpdateStatus) {
                return `UPDATE tumx03 SET iStatus = ?, iModifyBy = ? WHERE iBarangID = ?`;
            } else if (payload.isEdit) {
                return `UPDATE tumx03 SET sName = ?, sUoM = ?, iStatus = ?, iModifyBy = ? WHERE sKode = ?`;
            } else {
                return `INSERT INTO tumx03 (sKode, sName, sUoM, iStatus, iCreateBy) VALUES (?, ?, ?, ?, ?)`;
            }
        });

        const params = payload.items.map((item:any) => {
            if (payload.isUpdateStatus) {
                return [item.iStatus, item.iModifyBy, item.iBarangID];
            } else if (payload.isEdit) {
                return [item.sName, item.sUoM, 1, item.iModifyBy, item.sKode];
            } else {
                return [item.sKode, item.sName, item.sUoM, 1, item.iModifyBy];
            }
        });

        console.log('queries : ', queries);
        console.log('params : ', params);

        const results = await Promise.all(params.map((param:any, index:any) => connection.execute(queries[index], param)));

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

export async function GET() {
    const users = await getBarang();
    return NextResponse.json(users);
}

// Read all users
export async function getBarang() {
    const [rows] = await pool.query('SELECT * FROM tumx03');
    return rows;
}
