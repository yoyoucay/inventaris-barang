// app/dashboard/page.tsx
'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserContext } from '../context/UserContext';
import Loading from '../components/shared/Loading';

export default function Dashboard() {
    const { user, logout } = useContext(UserContext);
    const [pageState, setPageState] = useState<number>(0);
    const router = useRouter();

    console.log('user : ', user);

    // Redirect to login if user is not authenticated
    useEffect(() => {
     if (!localStorage.getItem('token')) {
            router.push('/login');
            return;
        }

        setPageState(1)        

    }, [user]);

    return pageState > 0 ? (
        <div>
            <h1>Welcome, {user?.sEmail}!</h1>
            <button onClick={logout}>Logout</button>
        </div>
    ) : <Loading />;
}
