// app/dashboard/page.tsx
'use client';

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserContext } from '../context/UserContext';

export default function Dashboard() {
    const { user, logout } = useContext(UserContext);
    const router = useRouter();

    // Redirect to login if user is not authenticated
    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user, router]);

    // Show loading state while checking authentication
    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Welcome, {user.sEmail}!</h1>
            <button onClick={logout}>Logout</button>
        </div>
    );
}