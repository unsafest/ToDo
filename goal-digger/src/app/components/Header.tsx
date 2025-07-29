"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

export default function Header() {
    const [user, setUser] = useState<User | null>(null);
    const supabase = createClient();
    const router = useRouter();
    
    useEffect(() => {
        const fetchUser = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (!error) setUser(data.user);
        }
        fetchUser()
    }, [supabase.auth])

    const logout = async () => {
        await supabase.auth.signOut();
        router.push('/login'); 
    };

    return (
        <header className="w-full max-w-5xl bg-white shadow-md py-3 px-4 sm:py-4 sm:px-6 flex items-center justify-between mb-4 sm:mb-8 rounded-lg">
            <h1 className="text-lg sm:text-2xl font-bold tracking-tight">
                Goal Digger
            </h1>
            <nav>
                <ul className="flex items-center gap-3 sm:gap-6">
                    <li>
                        <Link href="/" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium text-sm sm:text-base">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link href="/userPage" className="flex items-center gap-1 sm:gap-2 text-gray-700 hover:text-indigo-600 transition-colors font-medium text-sm sm:text-base">
                            <span className="inline-block rounded-full bg-indigo-100 text-indigo-600 px-2 py-1 text-xs font-semibold max-w-20 sm:max-w-none truncate">
                                {user ? (user.user_metadata?.name ?? user.email) : "User"}
                            </span>
                        </Link>
                    </li>
                    <li>
                        <button
                            onClick={logout}
                            className="text-gray-500 hover:text-red-500 transition-colors font-medium text-sm sm:text-base"
                        >
                            Log out
                        </button>
                    </li>
                </ul>
            </nav>
        </header>
    )
}