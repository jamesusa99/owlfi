import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const navigate = useNavigate()

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* 用户信息卡片 */}
      <section className="bg-gradient-to-br from-[var(--owl-primary)] to-[var(--owl-secondary)] rounded-2xl p-6 text-white mb-6 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl">
            👤
          </div>
          <div>
            <h3 className="text-lg font-medium">投资用户</h3>
            <p className="text-white/80 text-sm">ID: 10086</p>
          </div>
        </div>
      </section>

      {/* 风险等级 */}
      <section
        onClick={() => navigate('/tools/risk')}
        className="bg-white rounded-2xl p-5 shadow-sm mb-6 cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-medium text-[var(--owl-text)]">风险测评</h4>
            <p className="text-sm text-[var(--owl-text-muted)]">稳健型 · 上次测评 2024-01-15</p>
          </div>
          <span className="text-[var(--owl-primary)] text-sm font-medium">去测评 ›</span>
        </div>
      </section>

      {/* 功能菜单 */}
      <section className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {[
          { icon: '📄', label: '我的订单', path: '/profile/orders' },
          { icon: '💳', label: '银行卡管理', path: '/profile/cards' },
          { icon: '🔔', label: '消息通知', path: '/profile/notifications' },
          { icon: '❓', label: '帮助中心', path: '/profile/help' },
          { icon: '⚙️', label: '设置', path: '/profile/settings' },
        ].map((item) => (
          <div
            key={item.label}
            onClick={() => navigate(item.path)}
            className="flex items-center justify-between px-5 py-4 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{item.icon}</span>
              <span className="text-[var(--owl-text)]">{item.label}</span>
            </div>
            <span className="text-[var(--owl-text-muted)]">›</span>
          </div>
        ))}
      </section>

      {/* 客服 */}
      <section className="mt-6 flex gap-4">
        <button
          onClick={() => navigate('/profile/support')}
          className="flex-1 py-3 bg-white rounded-xl shadow-sm text-[var(--owl-text)] font-medium"
        >
          在线客服
        </button>
        <button
          onClick={() => navigate('/profile/feedback')}
          className="flex-1 py-3 bg-white rounded-xl shadow-sm text-[var(--owl-text)] font-medium"
        >
          投诉建议
        </button>
      </section>

      {/* 版本信息 */}
      <p className="text-center text-xs text-[var(--owl-text-muted)] mt-8 pb-4">
        猫头鹰基金研究院 v1.0.0
      </p>
    </div>
  )
}
