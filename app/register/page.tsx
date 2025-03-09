'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '../../modules/lib/definitions/user';
import { httpPost } from '@/modules/lib/utils/https';
import { updateState } from '@/modules/lib/utils/updateState';

export default function Register() {
    const router = useRouter();


    const [localLoading, setLocalLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState<any>({
        sUserName: null,
        sFullName: null,
        sEmail: null,
        sPassword: null,
        sRole: 'user',
        iUserID: null,
    });
    const [error, setError] = useState<string | null>(null);

    const handleChange = (key: keyof typeof formData, value: any) => {
        if (typeof value === 'string') {
            updateState(setFormData, key, value);
        } else if (value instanceof File) {
            updateState(setFormData, key, value);
        } else {
            updateState(setFormData, key, value?.value ?? value);
        }
    };

    const handleSubmit = async (e: any) => {
        setLocalLoading(true);
        e.preventDefault();

        let requiredFields = [
            { name: 'sUserName', alias: 'Username' },
            { name: 'sFullName', alias: 'Nama User' },
            { name: 'sEmail', alias: 'Email' },
        ];
        if (!formData.data) {
            for (const field of requiredFields) {
                if (!formData[field.name]) {
                    setError(`${field.alias} wajib diisi`);
                    return;
                }
            }
        }
        let payload: any;
        payload = {
            totalItems: 1,
            items: [{
                iUserID: formData.iUserID,
                sUserName: formData.sUserName,
                sFullName: formData.sFullName,
                sEmail: formData.sEmail,
                sPassword: formData.sPassword,
                sRole: formData.sRole,
                iModifyBy: 1,
            }],
            isEdit: false,
            isUpdateStatus: false
        };
        console.log('payload before send : ', payload)
        const response: any = await httpPost('/api/users', payload);
        setLocalLoading(false);
        console.log('response:', response);
        if (response.statusReq && response.statusCode === 200) {
            router.push('/login');
        } else {
            const data = await response;
            setError(data.sMessage || 'Update User gagal. Silahkan coba lagi.');
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
                            onChange={(e) => handleChange('sUserName', e.target.value)}
                            defaultValue={formData.sUserName || ''}
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
                            onChange={(e) => handleChange('sFullName', e.target.value)}
                            defaultValue={formData.sFullName || ''}
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
                            onChange={(e) => handleChange('sEmail', e.target.value)}
                            defaultValue={formData.sEmail || ''}
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
                            onChange={(e) => handleChange('sPassword', e.target.value)}
                            defaultValue={formData.sPassword || ''}
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