import { Navigate } from 'react-router-dom'
import type { ReactElement } from 'react'

type RequireAuthProps = {
  children: ReactElement
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to="/login" replace />
  return children
}
