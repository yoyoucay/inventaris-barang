import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <header className="fixed top-0 left-64 right-0 bg-white shadow-md p-4 z-10">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
                <div className="flex items-center space-x-4">
                    <button className="text-gray-600 hover:text-gray-800">
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
                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                            />
                        </svg>
                    </button>
                    <div className="relative">
                        <img
                            src="/images/user.png" // Placeholder image
                            alt="User"
                            className="w-10 h-10 rounded-full cursor-pointer"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        />
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                                <Link
                                    href="/profile"
                                    className="block px-4 py-2 text-gray-800 hover:bg-blue-50"
                                >
                                    Profile
                                </Link>
                                <Link
                                    href="/settings"
                                    className="block px-4 py-2 text-gray-800 hover:bg-blue-50"
                                >
                                    Settings
                                </Link>
                                <Link
                                    href="/logout"
                                    className="block px-4 py-2 text-gray-800 hover:bg-blue-50"
                                >
                                    Logout
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}