// app/components/ImageList.tsx
import React, { useState } from 'react';
import Image from 'next/image';

interface ImageListProps {
    imageName: string[];
    pathFolder: string;
}

const ImageList: React.FC<ImageListProps> = ({ imageName, pathFolder }) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {imageName.map((imageName, index) => (
                <div
                    key={index}
                    className="relative aspect-square group cursor-pointer"
                    onClick={() => setSelectedImage(imageName)} // Open preview on click
                >
                    {/* Thumbnail Image */}
                    <Image
                        src={`${pathFolder}/${imageName}`}
                        alt={`Image ${index}`}
                        fill
                        className="object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                    />
                </div>
            ))}

            {/* Full Preview Overlay */}
            {selectedImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
                    <div className="relative max-w-[90vw] max-h-[90vh]">
                        <Image
                            src={`${pathFolder}/${selectedImage}`}
                            alt={`Preview`}
                            width={1200} // Adjust as needed
                            height={800} // Adjust as needed
                            className="object-contain rounded-lg"
                        />
                        <button
                            onClick={() => setSelectedImage(null)} // Close preview on button click
                            className="absolute top-1 right-1 p-2 bg-white rounded-full hover:bg-gray-200 transition-colors"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageList;