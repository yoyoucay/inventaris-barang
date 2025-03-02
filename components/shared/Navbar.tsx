import Link from 'next/link';
import { useState } from 'react';

interface NavbarProps {
    toggleSidebar: () => void;
    isSidebarOpen: boolean;
}


export default function Navbar({ toggleSidebar, isSidebarOpen }: NavbarProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    console.log('isSidebarOpen : ', isSidebarOpen)
    return (
        <header className={`fixed top-0 flex gap-4 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'left-72' : 'left-22'} right-0 bg-white shadow-md p-3 z-10`}>
            <div className="flex w-full gap-2 justify-start items-center">
                <button onClick={toggleSidebar} className="items-center justify-center w-10 h-10 text-gray-500 border-gray-200 rounded-lg z-99999 dark:border-gray-800 lg:flex dark:text-gray-400 lg:h-11 lg:w-11 lg:border" aria-label="Toggle Sidebar"><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M0.583252 1C0.583252 0.585788 0.919038 0.25 1.33325 0.25H14.6666C15.0808 0.25 15.4166 0.585786 15.4166 1C15.4166 1.41421 15.0808 1.75 14.6666 1.75L1.33325 1.75C0.919038 1.75 0.583252 1.41422 0.583252 1ZM0.583252 11C0.583252 10.5858 0.919038 10.25 1.33325 10.25L14.6666 10.25C15.0808 10.25 15.4166 10.5858 15.4166 11C15.4166 11.4142 15.0808 11.75 14.6666 11.75L1.33325 11.75C0.919038 11.75 0.583252 11.4142 0.583252 11ZM1.33325 5.25C0.919038 5.25 0.583252 5.58579 0.583252 6C0.583252 6.41421 0.919038 6.75 1.33325 6.75L7.99992 6.75C8.41413 6.75 8.74992 6.41421 8.74992 6C8.74992 5.58579 8.41413 5.25 7.99992 5.25L1.33325 5.25Z" fill="currentColor">
                    </path>
                </svg>
                </button>

                <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
                <div className="flex justify-end items-center space-x-4">
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