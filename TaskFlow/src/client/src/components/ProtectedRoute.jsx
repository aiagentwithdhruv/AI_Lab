import { Navigate } from 'react-router-dom'
import useStore from '../store/useStore'

export default function ProtectedRoute({ children }) {
  const token = useStore((s) => s.token)
  const storedToken = localStorage.getItem('token')

  if (!token && !storedToken) {
    return <Navigate to="/login" replace />
  }

  return children
}
