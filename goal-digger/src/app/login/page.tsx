'use client'
import { login, signup } from './actions'
import { useState } from 'react'

export default function LoginPage() {
  // state to manage modal visibility
  const [modalState, setModalState] = useState<'none' | 'login' | 'signup'>('none')
  // state to manage errors from server actions
  const [error, setError] = useState<{ login?: string; signup?: string; }>({})
  // state to manage form inputs
  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState('')

  
  const handleLogin = async (formData: FormData) => {
    const result = await login(formData)
    if (result?.error) {
      setError((prev) => ({
        ...prev,
        login: result.error
      }))
    } else {
      setError((prev) => ({
        ...prev,
        login: undefined
      }))
      setEmail('')
      setModalState('none')
    }
  }

  const handleSignup = async (formData: FormData) => {
    const result = await signup(formData)
    if (result?.error) {
      setError((prev) => ({
        ...prev,
        signup: result.error
      }))
    } else {
      setError((prev) => ({
        ...prev,
        signup: undefined
      }))
      setEmail('')
      setDisplayName('')
      setModalState('none')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-200 to-red-300">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Welcome to Goal Digger</h1>
        <h2 className="text-xl text-gray-600 mb-8 font-medium">your personal task manager</h2>
        <div className="flex gap-4 justify-center">
          <button 
            onClick={() => setModalState("login")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-lg"
          >
            Login
          </button>
          <button 
            onClick={() => setModalState("signup")}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-lg"
          >
            Sign Up
          </button>
        </div>
      </div>

    {/* Login Modal */}
    {modalState === "login" && (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-200 to-red-300 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
          <form method="POST" action={handleLogin} className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">Login</h2>
            <label htmlFor="email" className="text-sm font-semibold text-gray-700">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="johndoe@domain.com"
              required
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-600 text-gray-800"
            />
            <label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-600 text-gray-800"
            />
            <button type="submit" className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold mt-2">
              Log in
            </button>
            {error.login && <p className="text-red-500 text-sm text-center">{error.login}</p>}
          </form>
          <button 
            onClick={() => setModalState("none")}
            className="mt-4 w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    )}

    {/* Signup Modal */}
    {modalState === "signup" && (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-200 to-red-300 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
          <form method="POST" action={handleSignup} className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">Sign Up</h2>
            <label htmlFor="displayName" className="text-sm font-semibold text-gray-700">Display Name</label>
            <input 
              id="displayName"
              name="displayName"
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="John Doe"
              required
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-600 text-gray-800"
            />
            <label htmlFor="email" className="text-sm font-semibold text-gray-700">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="johndoe@domain.com"
              required 
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-600 text-gray-800"
            />
            <label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Choose a strong password (6-32 characters)"
              required
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-600 text-gray-800"
            />
            <button type="submit" className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold mt-2">
              Sign up
            </button>
            {error.signup && <p className="text-red-500 text-sm text-center">{error.signup}</p>}
          </form>
          <button 
            onClick={() => setModalState("none")}
            className="mt-4 w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    )}
    </div>
  )
}