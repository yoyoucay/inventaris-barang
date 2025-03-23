"use client"; // Mark this as a Client Component

import PageLayout from "@/components/shared/PageLayout";
import { UserContext } from "@/context/UserContext";
import { useRouter } from 'next/navigation';
import React, { useContext } from "react";

export default function ManualBook() {
    const { user, isAuthenticated } = useContext(UserContext);
    const router = useRouter();

    // Determine the PDF file based on the user's role
    const getPdfFile = () => {
        if (!user) return null; // If no user is logged in, return null

        switch (user.sRole) {
            case 'user':
                return 'manual/manual-user.pdf'; // Path to the user manual PDF
            case 'admin':
                return 'manual/manual-admin.pdf'; // Path to the admin manual PDF
            case 'kepsek':
                return 'manual/manual-kepsek.pdf'; // Path to the kepsek manual PDF
            default:
                return null; // Default case
        }
    };

    const pdfFile = getPdfFile();

    return (
        <PageLayout>
            <div className="p-2">
                <main className="p-4 mt-2">
                    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
                            <h1 className="text-2xl font-bold mb-4 text-center">Manual Book</h1>
                            {pdfFile ? (
                                <iframe
                                    src={pdfFile}
                                    className="w-full h-[600px] rounded-lg border"
                                    title="Manual Book"
                                />
                            ) : (
                                <p className="text-center text-gray-500">No manual available for your role.</p>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </PageLayout>
    );
}