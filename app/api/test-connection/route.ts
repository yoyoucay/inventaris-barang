// app/api/test-connection/route.ts
import { testConnection } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    const result = await testConnection();
    return NextResponse.json(result);
}