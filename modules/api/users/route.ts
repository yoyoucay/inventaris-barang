// app/api/users/route.ts
import { createUser, getUsers } from '@/modules/lib/api/crud/user';
import { NextResponse } from 'next/server';

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