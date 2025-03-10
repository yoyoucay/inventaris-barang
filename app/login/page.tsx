// app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '../../modules/lib/definitions/user';
import { useUser } from '../../context/UserContext';
import { httpPost } from '../../modules/lib/utils/https';

export default function LoginPage() {
    const [modalData, setModalData] = useState<User>({
        sUserName: null,
        sFullName: null,
        sEmail: null,
        sPassword: null,
        sRole: 'user'
    });
    const [error, setError] = useState<string | null>(null);
    const { login } = useUser();
    const router = useRouter();

    const setData = (key: string, value: string) => {
        setModalData((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const response: any = await httpPost('/api/login', { sUserName: modalData.sUserName, sPassword: modalData.sPassword });
        console.log('response:', response);
        if (response.statusReq && response.statusCode === 200) {
            const responseData = await response.data;
            login(responseData.token); // Use the login function from context
            router.push('/dashboard');
        } else {

            const data = await response;
            setError(data.sMessage || 'Login failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-no-repeat bg-center bg-cover" style={{ backgroundImage: "url('/images/login-background.png')" }}>
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4 bg-gray-200 p-4 rounded">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Username ID
                        </label>
                        <input
                            type="text"
                            id="sUserName"
                            defaultValue={modalData?.sEmail || ''}
                            onChange={(e) => setData('sUserName', e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="sPassword"
                            defaultValue={''}
                            onChange={(e) => setData('sPassword', e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Login
                        </button>
                    </div>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <a href={process.env.NEXT_PUBLIC_BASE_PATH + `/register`} className="text-blue-500 hover:underline">
                        Register here
                    </a>
                </p>
            </div>
        </div>
    );
}