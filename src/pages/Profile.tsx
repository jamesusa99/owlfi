import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// 猫头鹰基金研究院 - 基金投研平台核心功能
const quickItems = [
  { icon: '📊', label: '我的组合', path: '/portfolio', desc: '组合管理' },
  { icon: '📋', label: '风险测评', path: '/tools/risk', desc: '了解风险承受能力' },
  { icon: '📚', label: '投顾学院', path: '/classroom', desc: '学习记录' },
]

const menuGroups = [
  [
    { icon: '📄', label: '我的订单', path: '/profile/orders' },
    { icon: '💳', label: '银行卡管理', path: '/profile/cards' },
    { icon: '🔔', label: '消息通知', path: '/profile/notifications' },
  ],
  [
    { icon: '❓', label: '帮助中心', path: '/profile/help' },
    { icon: '🛡️', label: '反欺诈专区', path: '/profile/anti-fraud' },
    { icon: '💬', label: '功能建议', path: '/profile/feedback' },
    { icon: '⚙️', label: '设置', path: '/profile/settings' },
  ],
]

export default function Profile() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [showCertBanner, setShowCertBanner] = useState(true)
  const [showNps, setShowNps] = useState(true)
  const [npsScore, setNpsScore] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-[var(--owl-bg)]">
      <div className="max-w-7xl mx-auto px-4 py-6 pb-8">
        {/* 用户信息头部 - 与首页横幅风格一致 */}
        <section className="relative bg-gradient-to-r from-[#e8f4fd] via-[#d4e8f7] to-[#e0eef7] rounded-2xl p-6 mb-6 overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="profileChartLines" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  {[0, 10, 20, 30].map((i) => (
                    <path key={i} d={`M${i} 40 L${i + 5} 30 L${i + 10} 35 L${i + 15} 25`} stroke="#1e3a5f" strokeWidth="0.5" fill="none" opacity="0.3" />
                  ))}
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#profileChartLines)" />
            </svg>
          </div>
          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white/60 flex items-center justify-center text-3xl shrink-0 border-2 border-[var(--owl-primary)]/20">
                🦉
              </div>
              {user ? (
                <div className="flex-1 min-w-0">
                  <span className="inline-block px-3 py-1 bg-[var(--owl-primary)]/10 text-[var(--owl-primary)] text-xs rounded-full mb-1 flex items-center gap-1 w-fit">
                    <span>★</span> 私享客户
                  </span>
                  <h3 className="text-[#1a365d] text-lg font-bold truncate">{user.nickname}</h3>
                  <p className="text-[#2c5282] text-sm">猫头鹰号: {user.userId}</p>
                </div>
              ) : (
                <div className="flex-1 min-w-0 flex flex-col gap-2">
                  <p className="text-[#2c5282] text-sm">登录后享受更多投研服务</p>
                  <button
                    onClick={() => navigate('/login')}
                    className="px-4 py-2 bg-[var(--owl-primary)] text-white rounded-lg text-sm font-medium w-fit hover:opacity-90"
                  >
                    登录 / 注册
                  </button>
                </div>
              )}
            </div>
            {user ? (
              <button
                onClick={() => navigate('/profile/associated-account')}
                className="shrink-0 flex items-center gap-2 px-3 py-2 bg-white/50 rounded-xl text-[var(--owl-primary)] text-sm"
              >
                关联账户
                <span>›</span>
              </button>
            ) : null}
          </div>
        </section>

        {/* 资产概览 - 登录用户显示 */}
        {user && (
          <section
            onClick={() => navigate('/portfolio')}
            className="bg-white rounded-2xl p-5 shadow-sm mb-6 cursor-pointer hover:shadow-md transition-shadow border border-gray-100"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-[var(--owl-text)]">资产概览</h3>
              <span className="text-sm text-[var(--owl-primary)]">查看详情 ›</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[var(--owl-bg)] rounded-xl p-4">
                <p className="text-xs text-[var(--owl-text-muted)] mb-1">总资产(元)</p>
                <p className="text-xl font-bold text-[var(--owl-primary)]">128,560.00</p>
              </div>
              <div className="bg-[var(--owl-bg)] rounded-xl p-4">
                <p className="text-xs text-[var(--owl-text-muted)] mb-1">累计收益(元)</p>
                <p className="text-xl font-bold text-green-600">+5,260.80</p>
              </div>
            </div>
          </section>
        )}

        {/* 快捷入口 - 核心投研功能 */}
        <section className="bg-white rounded-2xl p-5 shadow-sm mb-6">
          <h3 className="font-medium text-[var(--owl-text)] mb-4">常用服务</h3>
          <div className="grid grid-cols-3 gap-4">
            {quickItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-2 py-4 hover:bg-[var(--owl-bg)] rounded-xl transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--owl-bg)] flex items-center justify-center text-2xl">
                  {item.icon}
                </div>
                <span className="text-sm font-medium text-[var(--owl-text)]">{item.label}</span>
                <span className="text-xs text-[var(--owl-text-muted)]">{item.desc}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 专业投资者认证 */}
        {showCertBanner && (
          <section className="relative bg-white rounded-2xl p-5 shadow-sm mb-6 border border-gray-100 overflow-hidden">
            <button
              onClick={() => setShowCertBanner(false)}
              className="absolute top-3 right-3 text-[var(--owl-text-muted)] hover:text-[var(--owl-text)] text-lg"
            >
              ×
            </button>
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-[var(--owl-text)] text-base mb-1">专业投资者认证</h4>
                <p className="text-[var(--owl-text-muted)] text-sm">解锁更多产品,享更多权益</p>
              </div>
              <span className="text-[var(--owl-accent)] text-5xl font-light opacity-60">V</span>
            </div>
          </section>
        )}

        {/* 功能菜单 */}
        <section className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          {menuGroups.flat().map((item) => (
            <div
              key={item.path}
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

        {/* NPS 推荐问卷 */}
        {showNps && (
          <section className="relative bg-white rounded-2xl p-5 shadow-sm mb-6 border border-gray-100">
            <button
              onClick={() => setShowNps(false)}
              className="absolute top-3 right-3 text-[var(--owl-text-muted)] hover:text-[var(--owl-text)] text-lg"
            >
              ×
            </button>
            <p className="text-[var(--owl-text)] font-medium mb-4">你会愿意向亲朋好友推荐猫头鹰基金研究院吗?</p>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[var(--owl-text-muted)] text-xs">不推荐</span>
              <div className="flex-1 flex gap-1 flex-wrap">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <button
                    key={n}
                    onClick={() => setNpsScore(n)}
                    className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                      npsScore === n
                        ? 'bg-[var(--owl-primary)] text-white'
                        : 'bg-[var(--owl-bg)] text-[var(--owl-text-muted)] hover:bg-gray-200'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <span className="text-[var(--owl-text-muted)] text-xs">十分推荐</span>
            </div>
          </section>
        )}

        {/* 退出登录 */}
        {user ? (
          <button
            onClick={() => {
              logout()
              navigate('/login')
            }}
            className="w-full py-3 text-[var(--owl-text-muted)] text-sm hover:text-[var(--owl-text)] transition-colors"
          >
            退出登录
          </button>
        ) : null}

        {/* 版本 */}
        <p className="text-center text-xs text-[var(--owl-text-muted)] mt-6">猫头鹰基金研究院 v1.0.0 · 基金投研之芯，提升持基体验</p>
      </div>
    </div>
  )
}
