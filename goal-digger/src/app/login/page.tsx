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
      <h1 className="text-4xl font-bold mb-8">Welcome to Goal Digger</h1>
      <div >
        <button onClick={() => setModalState("login")}>Login</button>
        <button onClick={() => setModalState("signup")}>Signup</button>
      </div>

    {/* Login Modal */}
    {modalState === "login" && (
      <div className="modal">
        <form action={handleLogin} className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
          <label htmlFor="email" className="text-sm font-semibold">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="johndoe@domain.com"
            required
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <label htmlFor="password" className="text-sm font-semibold">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button type="submit" className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
            Log in
          </button>
          {error.login && <p className="text-red-500">{error.login}</p>}
        </form>
        <button onClick={() => setModalState("none")}>Close</button>
      </div>
    )}

    {/* Signup Modal */}
    {modalState === "signup" && (
      <div className="modal">
        <form action={handleSignup} className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
          <label htmlFor="displayName" className="text-sm font-semibold">Display Name</label>
          <input 
            id = "displayName"
            name = "displayName"
            type = "text"
            value = {displayName}
            onChange={e => setDisplayName(e.target.value)}
            placeholder = "John Doe"
            required
          />
          <label htmlFor="email" className="text-sm font-semibold">Email</label>
          <input
            id = "email"
            name = "email"
            type = "email"
            value = {email}
            onChange={e => setEmail(e.target.value)}
            placeholder = "johndoe@domain.com"
            required 
          />
          <label htmlFor="password" className="text-sm font-semibold">Password</label>
          <input
            id = "password"
            name = "password"
            type = "password"
            placeholder = "Chose a strong password 6-32 characters, at least one capital letter and one number or special character"
            required
          />
          <button type="submit" className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
            Sign up
          </button>
          {error.signup && <p className="text-red-500">{error.signup}</p>}
        </form>
        <button onClick={() => setModalState("none")}>Close</button>
      </div>
    )}
    </div>
  )
}