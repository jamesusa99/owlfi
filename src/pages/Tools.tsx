import { useNavigate } from 'react-router-dom'

export default function Tools() {
  const navigate = useNavigate()
  const tools: { id: number; name: string; desc: string; icon: string; color: string; path: string }[] = [
    { id: 1, name: '风险测评', desc: '评估您的投资风险承受能力', icon: '📋', color: 'from-blue-500 to-blue-600', path: '/tools/risk' },
    { id: 2, name: '定投计算器', desc: '模拟定投收益与回测', icon: '📈', color: 'from-green-500 to-green-600', path: '/tools/sip' },
    { id: 3, name: '复利计算器', desc: '计算复利增长效果', icon: '💰', color: 'from-amber-500 to-amber-600', path: '/tools/compound' },
    { id: 4, name: '基金比较', desc: '多只基金对比分析', icon: '⚖️', color: 'from-purple-500 to-purple-600', path: '/tools/fund-compare' },
    { id: 5, name: '资产配置建议', desc: 'AI智能配置方案', icon: '🤖', color: 'from-rose-500 to-rose-600', path: '/tools/asset-config' },
    { id: 6, name: '通胀计算器', desc: '测算实际购买力变化', icon: '📉', color: 'from-teal-500 to-teal-600', path: '/tools/inflation' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <p className="text-[var(--owl-text-muted)] text-sm mb-6">
        实用投资工具，助您做出更明智的决策
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <div
            key={tool.id}
            onClick={() => navigate(tool.path)}
            className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all cursor-pointer group border border-gray-100"
          >
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform`}
            >
              {tool.icon}
            </div>
            <h4 className="font-medium text-[var(--owl-text)] mb-1">{tool.name}</h4>
            <p className="text-xs text-[var(--owl-text-muted)] line-clamp-2">{tool.desc}</p>
          </div>
        ))}
      </div>

      {/* 最近使用 */}
      <section className="mt-8">
        <h3 className="font-medium text-[var(--owl-text)] mb-4">最近使用</h3>
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-sm text-[var(--owl-text-muted)] text-center py-8">
            暂无最近使用的工具
          </p>
        </div>
      </section>
    </div>
  )
}
