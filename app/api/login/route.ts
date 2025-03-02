// app/api/login/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import pool from '@/app/lib/db';
import jwt from 'jsonwebtoken';
import { apiResponse } from '@/app/lib/utils/apiResponse';

/**
 * Handles the POST request for user login.
 * 
 * @param {Request} request - The incoming request object.
 * @returns {Promise<Response>} - A promise that resolves to a NextResponse.
 */
export async function POST(request: Request): Promise<Response> {
    const { sUserName, sPassword }: { sUserName: string; sPassword: string } = await request.json();

    try {
        // Find the user in the database
        const [users]: any = await pool.query('SELECT * FROM v_user WHERE sUserName = ?', [sUserName]);
        const user: any = users[0];
        
        if (!user) {
            return apiResponse({ sMessage: 'Invalid username or password', statusReq: false, statusCode: 401 });
        }

        // Find the hashed password in tumx02
        const [passwords]: any = await pool.query('SELECT * FROM tumx02 WHERE iUserId = ?', [user.iUserID]);
        const hashedPassword: string | undefined = passwords[0]?.sPassword;

        if (!hashedPassword) {
            return apiResponse({ sMessage: 'Invalid username or password', statusReq: false, statusCode: 401 });
        }

        // Compare the provided password with the hashed password
        const isPasswordValid: boolean = await bcrypt.compare(sPassword, hashedPassword);

        if (!isPasswordValid) {
            return apiResponse({ sMessage: 'Invalid username or password', statusReq: false, statusCode: 401 });
        }

        // Sign the user data into a JWT token
        const token: string = jwt.sign({ user }, process.env.JWT_SECRET || 'secret', { expiresIn: '12h' });
        return apiResponse({ sMessage: 'Login Success!', statusReq: true, statusCode: 200, data: { token } });
    } catch (error) {
        console.error(error);
        return apiResponse({ sMessage: 'Unknown Error', statusReq: false, statusCode: 500 });
    }
}
