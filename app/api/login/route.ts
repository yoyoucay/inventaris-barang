// app/api/login/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import pool from '@/app/lib/db';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
    const { sEmail, sPassword } = await request.json();

    try {
        // Find the user in the database
        const [users]:any = await pool.query('SELECT * FROM v_user WHERE sEmail = ?', [sEmail]);
        let user = users[0];
        
        if (!user) {
            return NextResponse.json({ message: 'Invalid credentials'});
        }


        // Find the hashed password in tumx02
        const [passwords]:any = await pool.query('SELECT * FROM tumx02 WHERE iUserId = ?', [user.iUserID]);
        const hashedPassword = passwords[0]?.sPassword;

        if (!hashedPassword) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
        }

        // Compare the provided password with the hashed password
        const isPasswordValid = await bcrypt.compare(sPassword, hashedPassword);

        if (!isPasswordValid) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
        }

        // Sign the user data into a JWT token
        const token = jwt.sign({ user }, process.env.JWT_SECRET || 'secret', { expiresIn: '12h' });
        return NextResponse.json({ message: 'Login successful', token });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Login failed' }, { status: 500 });
    }
}