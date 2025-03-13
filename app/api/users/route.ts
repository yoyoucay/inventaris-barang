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
        console.log('result crudUser : ', result);
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
    let connection: any;

    try {
        connection = await pool.getConnection(); // Get a connection from the pool
        await connection.beginTransaction(); // Start a transaction

        if (payload && payload.isUpdateStatus) {
            // Update user status
            await Promise.all(
                payload.items.map(async (item: any) => {
                    await connection.execute(
                        `UPDATE tudt01 SET iStatus = ?, iModifyBy = ? WHERE iUserID = ?`,
                        [item.iStatus, item.iModifyBy, item.iUserID]
                    );
                })
            );
        } else if (payload && payload.isEdit) {
            // Edit user details
            await Promise.all(
                payload.items.map(async (item: any) => {
                    await connection.execute(
                        `UPDATE tumx01 SET sFullName = ?, sEmail = ?, iModifyBy = ? WHERE iUserID = ?`,
                        [item.sFullName, item.sEmail, item.iModifyBy, item.iUserID]
                    );

                    await connection.execute(
                        `UPDATE tudt01 SET sRole = ?, iModifyBy = ? WHERE iUserID = ?`,
                        [item.sRole, item.iModifyBy, item.iUserID]
                    );

                    await connection.execute(
                        `UPDATE tumx02 SET sPassword = ?, iModifyBy = ? WHERE iUserID = ?`,
                        [item.sPassword, item.iModifyBy, item.iUserID]
                    );
                })
            );
        } else {
            // Create new user
            await Promise.all(
                payload.items.map(async (item: any) => {
                    // Step 1: Insert into tumx01
                    const [result] = await connection.execute(
                        `INSERT INTO tumx01 (sUserName, sFullName, sEmail, iStatus, iCreateBy) 
                        VALUES (?, ?, ?, ?, ?)`,
                        [item.sUserName, item.sFullName, item.sEmail, 1, item.iModifyBy]
                    );

                    // Step 2: Get the inserted ID
                    const [rows]: any = await connection.query('SELECT LAST_INSERT_ID() as insertedId');
                    const insertedId = rows[0].insertedId;

                    // Step 3: Insert into tudt01
                    await connection.execute(
                        `INSERT INTO tudt01 (iUserID, sRole, iStatus, iCreateBy) 
                        VALUES (?, ?, ?, ?)`,
                        [insertedId, item.sRole, 1, item.iModifyBy]
                    );

                    // Step 4: Hash password and insert into tumx02
                    const saltRounds = 10;
                    const hashedPassword = await bcrypt.hash(item.sPassword ?? '123', saltRounds);

                    await connection.execute(
                        `INSERT INTO tumx02 (iUserID, iSeq, sPassword, iStatus, iCreateBy) 
                        VALUES (?, ?, ?, ?, ?)`,
                        [insertedId, 1, hashedPassword, 1, item.iModifyBy]
                    );
                })
            );
        }

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
