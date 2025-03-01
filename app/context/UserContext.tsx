// context/UserContext.tsx
'use client'; // Mark this as a Client Component

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';
import { User } from '../lib/definitions/user';

type UserContextType = {
    user: User | null;
    login: (token: string) => void;
    logout: () => void;
};

// Provide a default value
const defaultContextValue: UserContextType = {
    user: null,
    login: () => {},
    logout: () => {},
};

export const UserContext = createContext<UserContextType>(defaultContextValue);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)

    // Check for a token in localStorage on initial load
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwt.decode(token) as User;
            if (decoded) {
                setUser({ 
                    iUserID: decoded.iUserID, 
                    sUserName: decoded.sUserName,
                    sFullName: decoded.sFullName,
                    sEmail: decoded.sEmail,
                    sRole: decoded.sRole
             });
            }
        }
    }, []);

    const login = (token: string) => {
        localStorage.setItem('token', token);
        const decoded = jwt.decode(token) as User;
        setUser({ 
            iUserID: decoded.iUserID, 
            sUserName: decoded.sUserName,
            sFullName: decoded.sFullName,
            sEmail: decoded.sEmail,
            sRole: decoded.sRole
     });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};