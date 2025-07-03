'use client'
import { login, signup } from './actions'
import { useState } from 'react'

export default function LoginPage() {
  // state to manage modal visibility
  const [modalState, setModalState] = useState<'none' | 'login' | 'signup'>('none')
  // state to manage errors from server actions
  const [error, setErrors] = useState<{ login?: string; signup?: string}>({})

  const handleLogin = async (formData: FormData) => {
    const result = await login(formData)
    if (result?.error) {
      setErrors((prev) => ({
        ...prev,
        login: result.error.message
      }))
    } else {
      setErrors((prev) => ({
        ...prev,
        login: undefined
      }))
      setModalState('none')
    }
  }

  const handleSignup = async (formData: FormData) => {
    const result = await signup(formData)
    if (result?.error) {
      setErrors((prev) => ({
        ...prev,
        signup: result.error.message
      }))
    } else {
      setErrors((prev) => ({
        ...prev,
        signup: undefined
      }))
      setModalState('none')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-200 to-red-300">
      <button onClick={() => setModalState("login")}>Login</button>
      <button onClick={() => setModalState("signup")}>Signup</button>
    
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
              placeholder = "John Doe"
              required
            />
            <label htmlFor="email" className="text-sm font-semibold">Email</label>
            <input
              id = "email"
              name = "email"
              type = "email"
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

// return (
//   <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-200 to-red-300">
//     <form className="flex flex-col gap-4 w-full max-w-md bg-white shadow-lg rounded-xl p-8 border border-gray-200">
//       <h2 className="text-2xl font-bold text-center mb-4 text-blue-700">Welcome</h2>
//       <label htmlFor="email" className="text-sm font-semibold text-gray-700">Email</label>
//       <input
//         id="email"
//         name="email"
//         type="email"
//         required
//         className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
//       />
//       <label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</label>
//       <input
//         id="password"
//         name="password"
//         type="password"
//         required
//         className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
//       />
//       <div className="flex gap-2 mt-4">
//         <button
//           formAction={login}
//           className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
//         >
//           Log in
//         </button>
//         <button
//           formAction={signup}
//           className="flex-1 bg-white border border-blue-600 text-blue-700 py-2 rounded-lg hover:bg-indigo-50 transition-colors font-semibold"
//         >
//           Sign up
//         </button>
//       </div>
//     </form>
//   </div>
// )