"use client"
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useUser();

  useEffect(() => {
    router.push('/login');
  }, [isAuthenticated]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <p className="text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          Your app is running.
        </p>
      </main>
    </div>
  );
}
