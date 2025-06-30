'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation' 
import Header from "../components/Header"

export default function UserPage() {
    const [user, setUser] = useState<User | null>(null)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState<string | null>(null)
    const supabase = createClient()
    const router = useRouter() 

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true)
            const { data, error } = await supabase.auth.getUser()
            if (!error && data.user) {
                setUser(data.user)
                setName(data.user.user_metadata?.name ?? '')
                setEmail(data.user.email ?? '')
            } else {
                router.replace('/login') 
            }
            setLoading(false)
        }
        fetchUser()
    }, [router, supabase.auth])

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setMessage(null)
        setLoading(true)
        const { error } = await supabase.auth.updateUser({
            data: { name }
        })
        if (error) {
            setMessage('Failed to update user info.')
        } else {
            setMessage('Profile updated!')
        }
        setLoading(false)
    }

    if (loading) return <div className="text-center py-8">Loading...</div>
    if (!user) return <div className="text-center py-8 text-red-500">User not found.</div>

    return (
        <>
        <Header />
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow border">
            <h2 className="text-2xl font-bold mb-4">{email}</h2>
            <form onSubmit={handleUpdate} className="flex flex-col gap-4">
                <label className="font-medium">
                    Display name
                    <input
                        className="block w-full mt-1 p-2 border rounded"
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Your name"
                    />
                </label>
                <label className="font-medium">
                    Email
                    <input
                        className="block w-full mt-1 p-2 border rounded bg-gray-100"
                        type="email"
                        value={email}
                        disabled
                    />
                </label>
                <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors font-semibold"
                    disabled={loading}
                >
                    {loading ? 'Updating...' : 'Update Profile'}
                </button>
                {message && <p className="text-center text-green-600">{message}</p>}
            </form>
            
        </div>
        </>
    )
}