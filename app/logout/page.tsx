// app/logout/page.tsx
"use client";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { UserContext } from "../context/UserContext";

export default function LogoutPage() {
    const { logout } = useContext(UserContext);
    const router = useRouter(); // Initialize the router

    useEffect(() => {
        // Perform logout and then redirect to the login page
        const handleLogout = async () => {
            await logout(); // Call the logout function
            router.push("/login"); // Redirect to the login page
        };

        handleLogout();
    }, [logout, router]);

    return null; // No UI is rendered for this page
}