// utils/apiResponse.ts
import { NextResponse } from 'next/server';

interface ApiResponseOptions {
    sMessage: string;
    statusReq: boolean;
    statusCode: number;
    data?: any; // Optional data payload
    items?: any; // Optional data payload
}

export const apiResponse = (options: ApiResponseOptions) => {
    const { sMessage, statusReq, statusCode, data } = options;

    return NextResponse.json(
        {
            sMessage: sMessage,
            statusReq,
            statusCode,
            ...(data && { data }), // Include data if provided
        },
        { status: statusCode }
    );
};