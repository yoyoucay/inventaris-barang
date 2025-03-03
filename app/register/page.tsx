'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '../../modules/lib/definitions/user';

export default function Register() {
    const router = useRouter();
    const [modalData, setModalData] = useState<User>({
        sUserName: null,
        sFullName: null,
        sEmail: null,
        sPassword: null,
        sRole: 'user'
    });
    const [error, setError] = useState<string | null>(null);

    const setData = (key: string, value: string) => {
        setModalData((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let payload: User = {
            sUserName: modalData.sUserName,
            sFullName: modalData.sFullName,
            sEmail: modalData.sEmail,
            sPassword: modalData.sPassword,
            sRole: modalData.sRole
        }

        console.log('payload :', payload);

        const response = await fetch(process.env.NEXT_PUBLIC_BASE_PATH + '/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        console.log('response :', response);

        if (response.ok) {
            router.push('/login');
        } else {
            console.log('response Err:', response);
            alert('Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="sUserName" className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            type="text"
                            id="sUserName"
                            defaultValue={modalData?.sUserName || ''}
                            onChange={(e) => setData('sUserName', e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="sFullName" className="block text-sm font-medium text-gray-700">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="sFullName"
                            defaultValue={modalData?.sFullName || ''}
                            onChange={(e) => setData('sFullName', e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="sEmail" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="sEmail"
                            defaultValue={modalData?.sEmail || ''}
                            onChange={(e) => setData('sEmail', e.target.value)}
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
                            id="password"
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
                            Register
                        </button>
                    </div>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <a href={process.env.NEXT_PUBLIC_BASE_PATH + `/login`} className="text-blue-500 hover:underline">
                        Login here
                    </a>
                </p>
            </div>
        </div>
    );
}