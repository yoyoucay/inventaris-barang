// components/Sidebar.tsx
import { useState } from 'react';
import Link from 'next/link';

export default function Sidebar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <>
            <button
                className="fixed top-4 left-4 z-20 lg:hidden"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                aria-label={isSidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
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
                        d={isSidebarOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                    />
                </svg>
            </button>
            <aside
                className={`fixed inset-y-0 left-0 w-64 bg-white shadow-md transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-64'
                    } lg:translate-x-0 transition-transform duration-200 ease-in-out`}
            >
                <div className="p-6">
                    <h1 className="text-xl font-bold text-blue-600">Invent</h1>
                </div>
                <nav className="mt-6">
                    <Link href="/dashboard" className="block py-2 px-6 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                        Dashboard
                    </Link>
                    <Link href="/profile" className="block py-2 px-6 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                        Profile
                    </Link>
                    <Link href="/settings" className="block py-2 px-6 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                        Settings
                    </Link>
                    <Link href="/logout" className="block py-2 px-6 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                        Logout
                    </Link>
                </nav>
            </aside>
        </>
    );
}