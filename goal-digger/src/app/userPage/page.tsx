'use client'
import { useState, useEffect } from "react"
import { getUser, updateUserProfile } from "./actions"
import Header from "../components/Header"

type UserData = {
    email?: string
    created_at: string
    displayName: string
}

export default function UserPage() {
    const [user, setUser] = useState<UserData | null>(null)
    const [message, setMessage] = useState('')
    const [isError, setIsError] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [snackbar, setSnackbar] = useState<{ visible: boolean, text: string, isError: boolean }>({ visible: false, text: '', isError: false })

    // Show snackbar when loading
    useEffect(() => {
        if (isLoading) {
            setSnackbar({ visible: true, text: "Loading...", isError: false })
        } else {
            setSnackbar({ visible: false, text: '', isError: false })
        }
    }, [isLoading])

    // Show snackbar for success or error messages
    useEffect(() => {
        if (message) {
            setSnackbar({ visible: true, text: message, isError })
            // Hide after 10s
            const timer = setTimeout(() => setSnackbar({ visible: false, text: '', isError: false }), 10000)
            return () => clearTimeout(timer)
        }
    }, [message, isError])

    useEffect(() => {
        async function fetchUser() {
            try {
                const userData = await getUser()
                setUser(userData)
            } catch (error) {
                setMessage("Failed to fetch user data")
                setIsError(true)
                console.error("Failed to fetch user data:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchUser()
    }, [])

    async function handleSubmit(formData: FormData) {
        setMessage('')
        setIsError(false)

        const result = await updateUserProfile(formData)

        if (result?.error) {
            setMessage(result.error)
            setIsError(true)
        } else if (result?.success) {
            setMessage('Profile updated successfully!')
            setIsError(false) // Clear errors on success
            const userData = await getUser()
            setUser(userData)
        }
    }

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <Header />

            {/* Snackbar */}
            {snackbar.visible && (
                <div className={`fixed bottom-4 right-4 px-4 py-2 rounded-md text-white shadow-md transition-opacity duration-500 z-50
                    ${snackbar.isError ? 'bg-red-500' : 'bg-green-600'}`}>
                    {snackbar.text}
                </div>
            )}

            <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow border">
                <h2 className="text-2xl font-bold mb-4">{user?.email}</h2>
                <h3 className="text-lg mb-2">Display Name: {user?.displayName || 'Not set'}</h3>
                <h4 className="text-lg mb-2">
                    Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString() : '...'}
                </h4>
                
                <form action={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label htmlFor="displayName" className="block mb-1">Display Name</label>
                        <input 
                            type="text" 
                            name="displayName"
                            id="displayName"
                            defaultValue={user?.displayName}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="password" className="block mb-1">New Password</label>
                        <input 
                            type="password" 
                            name="password"
                            id="password"
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="confirmPassword" className="block mb-1">Confirm Password</label>
                        <input 
                            type="password" 
                            name="confirmPassword"
                            id="confirmPassword"
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    
                    <button 
                        type="submit"
                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                        Update Profile
                    </button>
                </form>
            </div>
        </div>
    )
}