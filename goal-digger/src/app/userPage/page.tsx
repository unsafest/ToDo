'use client'
import { useState, useEffect } from "react"
import { getUser, updateUserProfile, deleteAccount } from "./actions"
import Header from "../components/Header"
import { createClient } from "@/utils/supabase/client"

type UserData = {
  email?: string
  created_at: string
  displayName: string
}

export default function UserPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [snackbar, setSnackbar] = useState<{ visible: boolean, text: string }>({ visible: false, text: '' })
  const supabase = createClient()

  // Show snackbar when loading
  useEffect(() => {
    if (isLoading) {
      setSnackbar({ visible: true, text: "Loading..." })
    } else {
      setSnackbar({ visible: false, text: '' })
    }
  }, [isLoading])

  // Show snackbar for success messages
  useEffect(() => {
    if (message) {
      setSnackbar({ visible: true, text: message })
      // Hide after 5s
      const timer = setTimeout(() => {
        setSnackbar({ visible: false, text: '' })
        setMessage('')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [message])

  useEffect(() => {
    async function fetchUser() {
      try {
        const userData = await getUser();
        setUser(userData);
      } catch (fetchError) {
        // The 'error' variable from the catch block is now used.
        setError("Failed to fetch user data.");
        console.error("Failed to fetch user data:", fetchError);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUser();
  }, [])

  async function handleSubmit(formData: FormData) {
    setMessage('')
    setError('')

    const result = await updateUserProfile(formData)

    if (result?.error) {
      setError(result.error)
    } else if (result?.success) {
      setMessage('Profile updated successfully!')
      const userData = await getUser()
      setUser(userData)

      window.location.reload() // Reload to reflect changes
    }
  }

  async function handleDeleteAccount() {
    const confirmed = confirm('Are you sure you want to delete your account? This action cannot be undone.')
    if (confirmed) {
      setError('')
      setMessage('Deleting account...')

      const result = await deleteAccount()
      if (result?.error) {
        setError(result.error)
        setMessage('')
      } else if (result?.success) {
        setMessage('Account deleted successfully. Redirecting...')
        
        setTimeout(async () => {
          await supabase.auth.signOut()
          window.location.href = '/login'
        }, 3000)
      }
    }
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Header />
      {/* Snackbar for loading and success messages */}
      {snackbar.visible && (
        <div className={`fixed bottom-12 left-1/2 -translate-x-1/2 px-4 py-2 rounded-md text-white shadow-md transition-opacity duration-500 z-50 bg-gray-500`}>
          {snackbar.text}
        </div>
      )}

      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow border">
        <h2 className="text-lg font-bold mb-2">
          {user?.email ?? 'Loading...'}
        </h2>
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
              defaultValue={user?.displayName ?? ''}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              name="password"
              id="password"
              className="w-full p-2 border rounded"
              placeholder="Leave blank to keep current password"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              className="w-full p-2 border rounded"
            />
          </div>

          {/* This line uses the 'error' state, resolving the warning. */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Update Profile
          </button>
          <button
            type="button"
            onClick={handleDeleteAccount}
            className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
          >
            Delete Account
          </button>
        </form>
      </div>
    </div>
  );
}