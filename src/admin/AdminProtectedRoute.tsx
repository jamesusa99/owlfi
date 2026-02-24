import { Navigate, useLocation } from 'react-router-dom'

const ADMIN_KEY = 'owlfi_admin'

export function isAdminLoggedIn(): boolean {
  return !!localStorage.getItem(ADMIN_KEY)
}

export function setAdminLoggedIn() {
  localStorage.setItem(ADMIN_KEY, '1')
}

export default function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation()

  if (!isAdminLoggedIn()) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />
  }

  return <>{children}</>
}
