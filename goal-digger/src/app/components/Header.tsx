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
        router.push('/login'); // or wherever your login page is
    };

    return (
        <header className="w-full bg-white shadow-md py-4 px-8 flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold tracking-tight">
                Goal Digger
            </h1>
            <nav>
                <ul className="flex items-center gap-6">
                    <li>
                        <Link href="/" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link href="/userPage" className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition-colors font-medium">
                            <span className="inline-block rounded-full bg-indigo-100 text-indigo-600 px-3 py-1 text-xs font-semibold">
                                {user ? (user.user_metadata?.name || user.email) : "User"}
                            </span>
                        </Link>
                    </li>
                    <li>
                        <button
                            onClick={logout}
                            className="text-gray-500 hover:text-red-500 transition-colors font-medium"
                        >
                            Log out
                        </button>
                    </li>
                </ul>
            </nav>
        </header>
    )
}