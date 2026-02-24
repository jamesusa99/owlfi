import { NavLink } from 'react-router-dom'

const navItems = [
  { path: '/', label: '首页', icon: '🏠' },
  { path: '/forum', label: '论坛', icon: '💬' },
  { path: '/classroom', label: '微课堂', icon: '📚' },
  { path: '/portfolio', label: '组合', icon: '📊' },
  { path: '/tools', label: '工具', icon: '🔧' },
  { path: '/profile', label: '我的', icon: '👤' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:relative bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] safe-area-inset-bottom">
      <div className="max-w-7xl mx-auto flex justify-around md:justify-center md:gap-12 py-2">
        {navItems.map(({ path, label, icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-2 px-4 md:px-6 min-w-[64px] rounded-lg transition-colors ${
                isActive
                  ? 'text-[var(--owl-primary)] font-medium'
                  : 'text-[var(--owl-text-muted)] hover:text-[var(--owl-primary)]'
              }`
            }
          >
            <span className="text-xl md:text-2xl mb-0.5">{icon}</span>
            <span className="text-xs md:text-sm">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
