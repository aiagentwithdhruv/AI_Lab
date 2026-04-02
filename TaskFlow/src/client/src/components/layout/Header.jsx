import { useNavigate } from 'react-router-dom'
import useStore from '../../store/useStore'

export default function Header() {
  const user = useStore((s) => s.user)
  const logout = useStore((s) => s.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-40">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate('/dashboard')}
      >
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">TF</span>
        </div>
        <span className="text-xl font-bold text-gray-900">TaskFlow</span>
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <span className="text-sm text-gray-600">
            {user.name || user.email}
          </span>
        )}
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-gray-800 px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  )
}
