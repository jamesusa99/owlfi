import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

interface User {
  phone: string
  userId: string
  nickname?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (phone: string, code: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const STORAGE_KEY = 'owlfi_user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as User
        setUser(parsed)
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = async (phone: string, code: string): Promise<boolean> => {
    // 模拟验证：任意6位验证码通过
    if (phone.length !== 11 || !/^1\d{10}$/.test(phone)) {
      return false
    }
    if (code.length < 4) {
      return false
    }

    const newUser: User = {
      phone: phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
      userId: `U${Date.now().toString(36).toUpperCase()}`,
      nickname: `用户${phone.slice(-4)}`,
    }
    setUser(newUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
