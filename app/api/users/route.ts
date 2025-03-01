// app/api/users/route.ts
import { createUser, getUsers } from '@/app/lib/api/crud/user';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const user = await request.json();
    const result = await createUser(user);
    console.log('result POST : ', result);
    return NextResponse.json(result);
}

export async function GET() {
    const users = await getUsers();
    return NextResponse.json(users);
}