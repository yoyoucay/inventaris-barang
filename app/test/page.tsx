'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '../../modules/lib/definitions/user';

export default function Register() {
    const router = useRouter();

    const [message, setMessage] = useState<string>('');

    const handleTestConnection = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_BASE_PATH + '/api/test-connection');
        const result = await response.json();

        if (result.success) {
            console.log('success')
            setMessage('Connection to MySQL server successful!');
        } else {
            console.log('error : ', result)
            setMessage(result)
        }
    };

    return (
        <div>
            <h1>Test Connection</h1>
            <button onClick={handleTestConnection}>Test Connection</button>
            <div>{message}</div>
        </div>
    );
}