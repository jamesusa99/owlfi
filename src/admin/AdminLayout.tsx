import { Outlet, NavLink, useNavigate } from 'react-router-dom'

const navItems = [
  { path: '/admin', label: '控制台', icon: '📊' },
  { path: '/admin/users', label: '用户管理', icon: '👥' },
  { path: '/admin/courses', label: '课程管理', icon: '📚' },
  { path: '/admin/news', label: '资讯管理', icon: '📰' },
  { path: '/admin/orders', label: '订单管理', icon: '📄' },
  { path: '/admin/forum', label: '论坛管理', icon: '💬' },
  { path: '/admin/home-config', label: '首页配置', icon: '🏠' },
  { path: '/admin/settings', label: '系统设置', icon: '⚙️' },
]

export default function AdminLayout() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('owlfi_admin')
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen flex bg-[#f5f7fa]">
      {/* 侧边栏 */}
      <aside className="w-56 bg-[#1e3a5f] text-white shrink-0 flex flex-col">
        <div className="p-4 border-b border-white/10">
          <h1 className="font-bold text-lg">猫头鹰运维</h1>
          <p className="text-white/70 text-xs mt-1">基金研究院后台</p>
        </div>
        <nav className="flex-1 p-3 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors ${
                  isActive ? 'bg-white/20' : 'hover:bg-white/10'
                }`
              }
            >
              <span>{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10">
          <a
            href="/"
            className="block w-full px-3 py-2 text-white/80 hover:bg-white/10 rounded-lg text-sm"
          >
            返回前台
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-white/80 hover:bg-white/10 rounded-lg text-sm mt-1"
          >
            退出登录
          </button>
        </div>
      </aside>
      {/* 主内容 */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
