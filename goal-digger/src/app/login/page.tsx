import { login, signup } from './actions'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-200 to-red-300">
      <form className="flex flex-col gap-4 w-full max-w-md bg-white shadow-lg rounded-xl p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-center mb-4 text-blue-700">Welcome</h2>
        <label htmlFor="email" className="text-sm font-semibold text-gray-700">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <div className="flex gap-2 mt-4">
          <button
            formAction={login}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Log in
          </button>
          <button
            formAction={signup}
            className="flex-1 bg-white border border-blue-600 text-blue-700 py-2 rounded-lg hover:bg-indigo-50 transition-colors font-semibold"
          >
            Sign up
          </button>
        </div>
      </form>
    </div>
  )
}