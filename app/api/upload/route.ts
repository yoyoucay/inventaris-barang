import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import pool from "@/modules/lib/db";

export async function POST(request: Request) {
    try {
        // Parse the FormData from the request
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const iUserID = formData.get("iUserID") as string;

        if (!file || !iUserID) {
            return NextResponse.json(
                { error: "File and userId are required" },
                { status: 400 }
            );
        }

        // Generate a unique file name based on the date and time
        const now = new Date();
        const fileName = `${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}${now.getHours()}${now.getMinutes()}${now.getSeconds()}.${file.name.split(".").pop()}`;

        // Save the file to the public/uploads directory
        const uploadDir = path.join(process.cwd(), "public/uploads");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, fileName);
        const fileBuffer = await file.arrayBuffer();
        fs.writeFileSync(filePath, Buffer.from(fileBuffer));

        // Update the database with the file URL
        const fileUrl = `/uploads/${fileName}`;
        await pool.query("UPDATE tumx01 SET sImgUrl = ? WHERE iUserID = ?", [
            fileUrl,
            iUserID,
        ]);

        return NextResponse.json({ success: true, fileUrl });
    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json(
            { error: "Failed to upload file" },
            { status: 500 }
        );
    }
}