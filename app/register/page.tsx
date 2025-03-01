'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '../lib/definitions/user';

export default function Register() {
    const router = useRouter();
   const [modalData, setModalData] = useState<User>({
    sUserName: '',
    sFullName: 'beemonswtf', 
    sEmail: 'beemons123@gmail.com',
   });
    
    const setData = (key: string, value: string) => {
        setModalData((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let payload:User = {
            sUserName: modalData.sUserName,
            sFullName: modalData.sFullName, 
            sEmail: 'beemons123@gmail.com',
        }

        const response = await fetch(process.env.NEXT_PUBLIC_BASE_PATH + '/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        console.log('response :', response);

        if (response.ok) {
            router.push('/login');
        } else {
            alert('Registration failed');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                placeholder="Email"
                value={modalData.sEmail || ""}
                onChange={(e) => setData("sEmail" ,e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={modalData.sPassword|| ""}
                onChange={(e) => setData("sPassword",e.target.value)}
                required
            />
            <button type="submit">Register</button>
        </form>
    );
}