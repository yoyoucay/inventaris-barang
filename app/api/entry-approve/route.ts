// app/api/users/route.ts
import pool from '@/modules/lib/db';
import { apiResponse } from "@/modules/lib/utils/apiResponse";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
    const payload = await request.json();
    try {
        const result = await approveEntry(payload);
        return apiResponse({ sMessage: result.sMessage, statusReq: result.statusReq, statusCode: result.statusCode });
    } catch (error) {
        console.error('Registration failed: ', error);
        return apiResponse({ sMessage: 'Registrasi User Gagal!', statusReq: false, statusCode: 500 });
    }
}

export async function approveEntry(payload: any) {

    console.log('payload : ', payload);
    let connection: any;

    try {
        connection = await pool.getConnection(); // Get a connection from the pool
        await connection.beginTransaction(); // Start a transaction

        await Promise.all(
            payload.items.map(async (item: any) => {
                await connection.execute(
                    `UPDATE tudt02 SET iApproved = ?, iModifyBy = ? WHERE iYear = ? AND iSemester = ?`,
                    [1, item.iModifyBy, item.iYear, item.iSemester]
                );
            })
        );

        await connection.commit(); // Commit the transaction

        return {
            sMessage: 'Operation completed successfully!',
            statusReq: true,
            statusCode: 200,
        };
    } catch (error) {
        console.error('Error during CRUD operation:', error);

        if (connection) {
            await connection.rollback(); // Rollback the transaction in case of error
            connection.release();
        }

        return {
            sMessage: 'Internal Server Error',
            statusReq: false,
            statusCode: 500,
        };
    } finally {
        if (connection) {
            connection.release(); // Release the connection back to the pool
        }
    }
}
// Read all users
export async function getUsers() {
    const [rows] = await pool.query('SELECT * FROM v_user');
    return rows;
}
