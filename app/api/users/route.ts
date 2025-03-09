// app/api/users/route.ts
import bcrypt from "bcrypt";
import pool from '@/modules/lib/db';
import { User } from '@/modules/lib/definitions/user';
import { NextResponse } from 'next/server';
import { apiResponse } from "@/modules/lib/utils/apiResponse";

export async function POST(request: Request) {
    const user = await request.json();
    try {
        const result = await crudUser(user);
        return apiResponse({ sMessage: result.sMessage, statusReq: result.statusReq, statusCode: result.statusCode });
    } catch (error) {
        console.error('Registration failed: ', error);
        return apiResponse({ sMessage: 'Registrasi User Gagal!', statusReq: false, statusCode: 500 });
    }
}

export async function GET() {
    const users = await getUsers();
    return apiResponse({ sMessage: 'Data User Ditemukan!', statusReq: true, statusCode: 200, data: users });
}

export async function crudUser(payload: any) {

    console.log('payload :', payload);

    if (payload && payload.isUpdateStatus) {
        const connection = await pool.getConnection(); // Get a connection from the pool
        try {
            await connection.beginTransaction(); // Start a transaction
            payload.items.map(async (item: any) => {
                const [result] = await connection.execute(
                    `UPDATE tudt01 SET iStatus = ?, iModifyBy = ? WHERE iUserID = ?`,
                    [item.iStatus, item.iModifyBy, item.iUserID]
                );
                console.log('Step 1 result: ', result);
            });
            await connection.commit(); // Commit the transaction
            return {
                sMessage: 'Data User Berhasil Diupdate!',
                statusReq: true,
                statusCode: 200
            };
        } catch (error) {
            console.error('Error updating user status:', error);
            await connection.rollback(); // Rollback the transaction in case of error
            throw error; // Re-throw the error
        } finally {
            connection.release(); // Release the connection back to the pool
        }
    }

    if (payload && payload.isEdit) {
        const connection = await pool.getConnection(); // Get a connection from the pool
        try {
            await connection.beginTransaction(); // Start a transaction
            payload.items.map(async (item: any) => {
                console.log('item :', item);
                const [result] = await connection.execute(
                    `UPDATE tumx01 SET sFullName = ?, sEmail = ?, iModifyBy = ? WHERE iUserID = ?`,
                    [item.sFullName, item.sEmail, item.iModifyBy, item.iUserID]
                );
                console.log('Step 1 result: ', result);

                await connection.execute(
                    `UPDATE tudt01 SET sRole = ?, iModifyBy = ? WHERE iUserID = ?`,
                    [item.sRole, item.iModifyBy, item.iUserID]
                );

                await connection.execute(
                    `UPDATE tumx02 SET sPassword = ?, iModifyBy = ? WHERE iUserID = ?`,
                    [item.sPassword, item.iModifyBy, item.iUserID]
                );
            });
            await connection.commit(); // Commit the transaction
            return {
                sMessage: 'Data User Berhasil Diupdate!',
                statusReq: true,
                statusCode: 200
            };
        } catch (error) {
            console.error('Error updating user:', error);
            await connection.rollback(); // Rollback the transaction in case of error
            throw error; // Re-throw the error
        } finally {
            connection.release(); // Release the connection back to the pool
        }
    }


    const connection = await pool.getConnection(); // Get a connection from the pool
    try {
        await connection.beginTransaction(); // Start a transaction
        payload.items.map(async (item: any) => {
            const [result] = await connection.execute(
                `INSERT INTO tumx01 (sUserName, sFullName, sEmail, iStatus, iCreateBy) 
                VALUES (?, ?, ?, ?, ?)`,
                [item.sUserName, item.sFullName, item.sEmail, 1, item.iModifyBy]
            );

            console.log('Step 1 result: ', result);

            // Step 2: Get the inserted ID
            const [rows]: any = await connection.query('SELECT LAST_INSERT_ID() as insertedId');
            const insertedId = rows[0].insertedId;

            console.log('Step 2 result: ', rows);

            await connection.execute(
                `INSERT INTO tudt01 (iUserID, sRole, iStatus, iCreateBy) 
                VALUES (?, ?, ?, ?)`,
                [insertedId, item.sRole, 1, item.iModifyBy]
            );

            await connection.commit(); // Commit the transaction
            const saltRounds = 10; // Number of salt rounds for bcrypt
            const hashedPassword = await bcrypt.hash(item.sPassword ?? '123', saltRounds);

            console.log('Step 4 result: ', hashedPassword);

            await connection.execute(
                `INSERT INTO tumx02 (iUserID, iSeq, sPassword, iStatus, iCreateBy) 
                VALUES (?, ?, ? , ? , ?)`,
                [insertedId, 1, hashedPassword, 1, item.iModifyBy]
            );
            console.log('Step 5 result: ', insertedId);

            await connection.commit(); // Commit the transaction
        });

        return {
            sMessage: 'Data User Berhasil Dibuat!',
            statusReq: true,
            statusCode: 200
        };
    } catch (error) {
        console.error('Error creating user:', error);
        await connection.rollback(); // Rollback the transaction in case of error
        throw error; // Re-throw the error
    } finally {
        connection.release(); // Release the connection back to the pool
    }
}

// Read all users
export async function getUsers() {
    const [rows] = await pool.query('SELECT * FROM v_user');
    return rows;
}
