export interface AdminUser {
  id: string
  phone: string
  nickname: string
  regTime: string
  orders: number
  status: '正常' | '禁用'
}

const STORAGE_KEY = 'owlfi_admin_users'

const defaultUsers: AdminUser[] = [
  { id: 'U1A2B3C4', phone: '138****1234', nickname: '用户1234', regTime: '2026-02-20', orders: 3, status: '正常' },
  { id: 'U5D6E7F8', phone: '139****5678', nickname: '用户5678', regTime: '2026-02-19', orders: 8, status: '正常' },
  { id: 'U9G0H1I2', phone: '137****9012', nickname: '用户9012', regTime: '2026-02-18', orders: 1, status: '正常' },
]

export function getAdminUsers(): AdminUser[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored) as AdminUser[]
    }
  } catch {}
  return defaultUsers
}

export function saveAdminUsers(users: AdminUser[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
}

export function generateUserId(): string {
  return 'U' + Date.now().toString(36).toUpperCase()
}
