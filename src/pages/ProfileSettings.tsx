import { useNavigate } from 'react-router-dom'

const settingsMenus = [
  { label: '账号安全', path: '/profile/settings/security' },
  { label: '通知设置', path: '/profile/settings/notification' },
  { label: '隐私设置', path: '/profile/settings/privacy' },
]

export default function ProfileSettings() {
  const navigate = useNavigate()

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="font-medium text-[var(--owl-text)] mb-4">设置</h2>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {settingsMenus.map((m) => (
          <div
            key={m.path}
            onClick={() => navigate(m.path)}
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
