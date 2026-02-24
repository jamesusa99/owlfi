import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const quickItems = [
  { icon: '🛍️', label: '行情商城', path: '/profile/market-mall' },
  { icon: '🎁', label: '我的奖励', path: '/profile/rewards' },
  { icon: '🎫', label: '我的卡券', path: '/profile/coupons' },
]

const menuGroups = [
  [
    { icon: '📋', label: '任务中心', path: '/profile/tasks' },
    { icon: '🏠', label: '积分商城', path: '/profile/points-mall' },
    { icon: '🔥', label: '活动中心', path: '/profile/activities' },
  ],
  [
    { icon: '🎧', label: '我的客服', path: '/profile/support' },
    { icon: '❓', label: '帮助中心', path: '/profile/help' },
    { icon: '🛡️', label: '反欺诈专区', path: '/profile/anti-fraud' },
  ],
  [
    { icon: '💬', label: '功能建议', path: '/profile/feedback' },
  ],
  [
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
    <div className="min-h-screen bg-[#1a1d21]">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <svg className="w-full h-64" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="profileWaves" x="0" y="0" width="60" height="30" patternUnits="userSpaceOnUse">
              <path d="M0 15 Q15 10 30 15 T60 15" stroke="#d4a84b" strokeWidth="0.5" fill="none" />
              <path d="M0 20 Q15 15 30 20 T60 20" stroke="#d4a84b" strokeWidth="0.3" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#profileWaves)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 pt-6 pb-8">
        {/* 用户信息头部 */}
        <section className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#2d3748] to-[#1a202c] flex items-center justify-center text-3xl shrink-0 border-2 border-[#d4a84b]/30">
            🦉
          </div>
          <div className="flex-1 min-w-0">
            <span className="inline-block px-3 py-1 bg-[#2d3748] text-[#d4a84b] text-xs rounded-full mb-1 flex items-center gap-1 w-fit">
              <span>★</span> 私享客户
            </span>
            <h3 className="text-white text-lg font-medium truncate">{user?.nickname || '投资用户'}</h3>
            <p className="text-gray-400 text-sm">猫头鹰号: {user?.userId || '—'}</p>
          </div>
        </section>

        {/* 关联账户卡片 */}
        <section
          onClick={() => navigate('/profile/associated-account')}
          className="bg-[#252830] rounded-2xl p-4 mb-4 flex items-center justify-between cursor-pointer hover:bg-[#2d3239] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1a1d21] flex items-center justify-center text-xl">👤</div>
            <span className="text-white font-medium">关联账户</span>
          </div>
          <span className="text-gray-500">›</span>
        </section>

        {/* 快捷入口三格 */}
        <section className="grid grid-cols-3 gap-3 mb-4">
          {quickItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="bg-[#252830] rounded-xl py-4 flex flex-col items-center gap-2 hover:bg-[#2d3239] transition-colors"
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-white text-sm">{item.label}</span>
            </button>
          ))}
        </section>

        {/* 专业投资者认证横幅 */}
        {showCertBanner && (
          <section className="relative bg-[#252830] rounded-2xl p-5 mb-4 overflow-hidden">
            <button
              onClick={() => setShowCertBanner(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-300 text-lg"
            >
              ×
            </button>
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-white font-bold text-base mb-1">专业投资者认证</h4>
                <p className="text-gray-400 text-sm">解锁更多产品,享更多权益</p>
              </div>
              <span className="text-[#d4a84b] text-5xl font-light opacity-60">V</span>
            </div>
          </section>
        )}

        {/* 功能菜单 */}
        <section className="space-y-1 mb-6">
          {menuGroups.map((group, gi) => (
            <div key={gi} className="bg-[#252830] rounded-2xl overflow-hidden">
              {group.map((item) => (
                <div
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center justify-between px-4 py-4 cursor-pointer hover:bg-[#2d3239] transition-colors ${
                    group.indexOf(item) < group.length - 1 ? 'border-b border-[#1a1d21]/50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-white">{item.label}</span>
                  </div>
                  <span className="text-gray-500">›</span>
                </div>
              ))}
            </div>
          ))}
        </section>

        {/* NPS 推荐问卷 */}
        {showNps && (
          <section className="relative bg-[#252830] rounded-2xl p-5 mb-6">
            <button
              onClick={() => setShowNps(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-300 text-lg"
            >
              ×
            </button>
            <p className="text-white font-medium mb-4">你会愿意向亲朋好友推荐猫头鹰基金研究院吗?</p>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-400 text-xs">不推荐</span>
              <div className="flex-1 flex gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <button
                    key={n}
                    onClick={() => setNpsScore(n)}
                    className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                      npsScore === n
                        ? 'bg-[#d4a84b] text-[#1a1d21]'
                        : 'bg-[#1a1d21] text-gray-400 hover:bg-[#2d3239] hover:text-white'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <span className="text-gray-400 text-xs">十分推荐</span>
            </div>
          </section>
        )}

        {/* 退出登录 */}
        <button
          onClick={() => {
            logout()
            navigate('/login')
          }}
          className="w-full py-3 text-gray-400 text-sm hover:text-white transition-colors"
        >
          退出登录
        </button>

        {/* 版本 */}
        <p className="text-center text-xs text-gray-500 mt-6">猫头鹰基金研究院 v1.0.0</p>
      </div>
    </div>
  )
}
