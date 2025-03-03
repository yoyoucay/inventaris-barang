// app/api/users/route.ts
import bcrypt from "bcrypt";
import { NextResponse } from 'next/server';
import { User } from "../../lib/definitions/user";
import pool from "../../lib/db";

export async function POST(request: Request) {
    const user = await request.json();
    try {
        const insertedId = await createUser(user);
        return NextResponse.json({ message: 'User registered successfully', insertedId }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Registration failed' }, { status: 500 });
    }
}

export async function GET() {
    const users = await getUsers();
    return NextResponse.json(users);
}

export async function createUser(user: User) {
    const connection = await pool.getConnection(); // Get a connection from the pool

    try {
        await connection.beginTransaction(); // Start a transaction


        // Step 1: Insert user data into tumx01
        const [result] = await connection.execute(
            `INSERT INTO tumx01 (sUserName, sFullName, sEmail, iStatus, iCreateBy) 
            VALUES (?, ?, ?, ?, ?)`,
            [user.sUserName, user.sFullName, user.sEmail, 1, 1]
        );

        // Step 2: Get the inserted ID
        const [rows]: any = await connection.query('SELECT LAST_INSERT_ID() as insertedId');
        const insertedId = rows[0].insertedId;

        // Step 3: Insert user role data into tudt01
        await connection.execute(
            `INSERT INTO tudt01 (iUserID, sRole, iStatus, iCreateBy) 
            VALUES (?, ?, ?, ?)`,
            [insertedId, 'user', 1, 1]
        );

        await connection.commit(); // Commit the transaction


        // Step 4: Hash the password
        const saltRounds = 10; // Number of salt rounds for bcrypt
        const hashedPassword = await bcrypt.hash(user.sPassword as string, saltRounds);

        // Step 5: Insert the hashed password and inserted ID into tumx02
        await connection.execute(
            `INSERT INTO tumx02 (iUserID, iSeq, sPassword, iStatus, iCreateBy) 
            VALUES (?, ?, ? , ? , ?)`,
            [insertedId, 1, hashedPassword, 1, 1]
        );

        await connection.commit(); // Commit the transaction
        return insertedId; // Return the inserted ID
    } catch (error) {
        await connection.rollback(); // Rollback the transaction in case of error
        console.error('Error creating user:', error);
        throw error; // Re-throw the error
    } finally {
        connection.release(); // Release the connection back to the pool
    }
}

// Read all users
export async function getUsers() {
    const [rows] = await pool.query('SELECT * FROM tumx01');
    return rows;
}
