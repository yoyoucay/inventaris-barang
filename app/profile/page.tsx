"use client"; // Mark this as a Client Component

import PageLayout from "@/components/shared/PageLayout";
import { UserContext } from "@/context/UserContext";
import { httpPost, httpPostFile } from "@/modules/lib/utils/https";
import React, { useContext, useEffect, useState } from "react";

export default function Profile() {
    const { user, isAuthenticated } = useContext(UserContext);

    const [file, setFile] = useState<File | null>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(user?.sImgUrl || null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user?.sImgUrl) {
            setFileUrl(process.env.NEXT_PUBLIC_BASE_PATH + user.sImgUrl);
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file || !user?.iUserID) {
            setError("Please select a file and provide a valid user ID.");
            return;
        }

        try {
            // Create a FormData object
            const formData = new FormData();
            formData.append("file", file); // Append the file
            formData.append("iUserID", user.iUserID.toString()); // Append the user ID

            // Send the FormData object
            const response = await fetch(process.env.NEXT_PUBLIC_BASE_PATH + "/api/upload", {
                method: "POST",
                body: formData, // No need to set Content-Type manually
            });

            if (response.ok) {
                const result = await response.json();
                setFileUrl(process.env.NEXT_PUBLIC_BASE_PATH + result.fileUrl);
                setError(null);
            } else {
                const errorData = await response.json();
                setError(errorData.error || "Failed to upload file");
            }
        } catch (err) {
            setError("Failed to upload file");
        }
    };

    return (
        <PageLayout>
            <div className="p-2">
                <main className="p-4 mt-2">
                    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                            <h1 className="text-2xl font-bold mb-6 text-center">Profile Picture</h1>

                            {/* Upload Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Upload Profile Picture
                                    </label>
                                    <input
                                        type="file"
                                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                                        accept="image/*"
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                </div>

                                {/* Preview Image */}
                                {fileUrl && (
                                    <div className="mt-4">
                                        <h2 className="text-sm font-medium text-gray-700 mb-2">
                                            Preview:
                                        </h2>
                                        <img
                                            src={fileUrl}
                                            alt="Profile Preview"
                                            className="w-32 h-32 rounded-full object-cover mx-auto"
                                        />
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
                                >
                                    Upload
                                </button>

                                {/* Error Message */}
                                {error && (
                                    <p className="text-red-500 text-sm text-center mt-4">{error}</p>
                                )}
                            </form>
                        </div>
                    </div>

                    {error && <p className="text-lg text-red-600">{error}</p>}
                </main>
            </div>
        </PageLayout>
    );
}