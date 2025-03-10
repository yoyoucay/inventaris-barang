// context/UserContext.tsx
'use client'; // Mark this as a Client Component

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';
import { User } from '../modules/lib/definitions/user';

type UserContextType = {
    user: User | null;
    login: (token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
};

// Provide a default value
const defaultContextValue: UserContextType = {
    user: null,
    login: () => { },
    logout: () => { },
    isAuthenticated: false,
};

export const UserContext = createContext<UserContextType>(defaultContextValue);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // Decode the token
                const decoded = jwt.decode(token) as any;

                if (decoded && decoded.user) {
                    const { iUserID, sUserName, sFullName, sEmail, sImgUrl, sRole } = decoded.user;

                    // Set the user state
                    setUser({ iUserID, sUserName, sFullName, sEmail, sImgUrl, sRole });
                    setIsAuthenticated(true); // Mark the user as authenticated
                }
            } catch (error) {
                console.error('Error decoding token:', error);
                logout(); // Clear invalid token
            }
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    const login = (token: string) => {
        try {
            // Decode the token
            const decoded = jwt.decode(token) as any;

            if (decoded && decoded.user) {
                const { iUserID, sUserName, sFullName, sEmail, sImgUrl, sRole } = decoded.user;

                // Set the user state
                setUser({ iUserID, sUserName, sFullName, sEmail, sImgUrl, sRole });
                setIsAuthenticated(true); // Mark the user as authenticated

                // Store the token in localStorage
                localStorage.setItem('token', token);
            }
        } catch (error) {
            console.error('Error decoding token:', error);
            logout(); // Clear invalid token
        }
    };

    const logout = () => {
        // Clear the user state and token
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
    };

    return (
        <UserContext.Provider value={{ user, login, logout, isAuthenticated }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};