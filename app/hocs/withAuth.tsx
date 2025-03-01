import { useEffect } from 'react';
import { useRouter } from 'next/router';

export const withAuth = (WrappedComponent: React.ComponentType) => {
    return (props: any) => {
        const router = useRouter();

        useEffect(() => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
            }
        }, []);

        return <WrappedComponent {...props} />;
    };
};