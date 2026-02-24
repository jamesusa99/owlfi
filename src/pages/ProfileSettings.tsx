import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const settingsMenus = [
  { label: '我的订单', path: '/profile/orders', needLogin: true },
  { label: '银行卡管理', path: '/profile/cards', needLogin: true },
  { label: '消息通知', path: '/profile/notifications', needLogin: true },
  { label: '账号安全', path: '/profile/settings/security', needLogin: true },
  { label: '通知设置', path: '/profile/settings/notification', needLogin: true },
  { label: '隐私设置', path: '/profile/settings/privacy', needLogin: false },
]

export default function ProfileSettings() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const handleMenuClick = (m: (typeof settingsMenus)[0]) => {
    if (m.needLogin && !isAuthenticated) {
      navigate('/login', { state: { from: m.path } })
    } else {
      navigate(m.path)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="font-medium text-[var(--owl-text)] mb-4">设置</h2>
      {!isAuthenticated && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4">
          <p className="text-amber-800 text-sm">账号相关功能需登录后使用</p>
          <button
            onClick={() => navigate('/login', { state: { from: '/profile/settings' } })}
            className="mt-2 px-4 py-2 bg-[var(--owl-primary)] text-white rounded-lg text-sm"
          >
            去登录
          </button>
        </div>
      )}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {settingsMenus.map((m) => (
          <div
            key={m.path}
            onClick={() => handleMenuClick(m)}
            className="flex justify-between items-center px-5 py-4 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50"
          >
            <span className="text-[var(--owl-text)]">{m.label}</span>
            <span className="text-[var(--owl-text-muted)]">›</span>
          </div>
        ))}
      </div>
    </div>
  )
}
