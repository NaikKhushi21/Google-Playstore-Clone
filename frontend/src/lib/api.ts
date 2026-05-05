const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export const getToken = () => localStorage.getItem('token')
export const setToken = (token: string | null) => {
  if (token) localStorage.setItem('token', token)
  else localStorage.removeItem('token')
}

type ApiError = { status: number; message: string }

const handleAuthFailure = () => {
  setToken(null)
  if (window.location.pathname !== '/login') {
    window.location.href = '/login'
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  { withAuth = true }: { withAuth?: boolean } = {},
): Promise<T> {
  const headers = new Headers(options.headers || {})
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json')
  }
  if (withAuth) {
    const token = getToken()
    if (token) headers.set('Authorization', `Bearer ${token}`)
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  if (res.status === 401) {
    handleAuthFailure()
  }
  if (!res.ok) {
    const message = await res.text().catch(() => 'Request failed')
    throw { status: res.status, message } as ApiError
  }
  if (res.status === 204) return undefined as T
  return res.json()
}
