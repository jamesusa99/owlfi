import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Home() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* 欢迎横幅 */}
      <section className="bg-gradient-to-br from-[var(--owl-primary)] to-[var(--owl-secondary)] rounded-2xl p-6 text-white mb-6 shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-semibold mb-1">智能投顾 · 综合策略管理平台</h2>
            <p className="text-white/90 text-sm">专业资产配置 · 科学投资决策</p>
          </div>
          {!isAuthenticated && (
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-white/20 rounded-lg text-sm hover:bg-white/30 shrink-0"
            >
              登录
            </button>
          )}
        </div>
      </section>

      {/* 资产概览 */}
      <section
        onClick={() => navigate('/portfolio')}
        className="bg-white rounded-2xl p-5 shadow-sm mb-6 cursor-pointer hover:shadow-md transition-shadow"
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
          <div className="bg-[var(--owl-bg)] rounded-xl p-4">
            <p className="text-xs text-[var(--owl-text-muted)] mb-1">今日收益(元)</p>
            <p className="text-xl font-bold text-green-600">+128.50</p>
          </div>
          <div className="bg-[var(--owl-bg)] rounded-xl p-4">
            <p className="text-xs text-[var(--owl-text-muted)] mb-1">持仓收益率</p>
            <p className="text-xl font-bold text-[var(--owl-accent)]">+4.27%</p>
          </div>
        </div>
      </section>

      {/* 推荐组合 */}
      <section className="bg-white rounded-2xl p-5 shadow-sm mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-[var(--owl-text)]">推荐组合</h3>
          <button onClick={() => navigate('/portfolio')} className="text-sm text-[var(--owl-primary)]">查看更多 →</button>
        </div>
        <div className="space-y-4">
          {[
            { id: 1, name: '稳健增长组合', rate: '+6.8%', risk: '中低', desc: '股债均衡配置' },
            { id: 2, name: '价值精选组合', rate: '+8.2%', risk: '中', desc: '优质蓝筹为主' },
            { id: 3, name: '成长进取组合', rate: '+12.5%', risk: '中高', desc: '科技成长赛道' },
          ].map((item) => (
            <div
              key={item.name}
              onClick={() => navigate(`/portfolio/${item.id}`)}
              className="flex items-center justify-between p-4 bg-[var(--owl-bg)] rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div>
                <p className="font-medium text-[var(--owl-text)]">{item.name}</p>
                <p className="text-xs text-[var(--owl-text-muted)]">{item.desc} · {item.risk}风险</p>
              </div>
              <p className="text-lg font-bold text-green-600">{item.rate}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 市场资讯 */}
      <section className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-[var(--owl-text)]">市场资讯</h3>
          <button onClick={() => navigate('/news')} className="text-sm text-[var(--owl-primary)]">更多 →</button>
        </div>
        <div className="space-y-3">
          {[
            { id: 1, title: 'A股市场震荡整理，关注结构性机会', time: '2小时前' },
            { id: 2, title: '央行维持利率不变，流动性充裕', time: '5小时前' },
            { id: 3, title: '基金行业监管新规即将落地', time: '1天前' },
          ].map((news) => (
            <div
              key={news.id}
              onClick={() => navigate(`/news/${news.id}`)}
              className="py-3 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50 rounded-lg px-2 -mx-2"
            >
              <p className="text-sm text-[var(--owl-text)]">{news.title}</p>
              <p className="text-xs text-[var(--owl-text-muted)] mt-1">{news.time}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
