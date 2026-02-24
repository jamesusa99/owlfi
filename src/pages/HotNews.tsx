import { useNavigate } from 'react-router-dom'

const hotItems = [
  { id: 'hot1', title: '猫头鹰ETF策略-AI风控持续提高', type: '热点', time: '1小时前' },
  { id: 2, title: '央行维持利率不变', type: '政策', time: '2小时前' },
  { id: 3, title: '北向资金本周净流入超百亿', type: '资金', time: '5小时前' },
]

export default function HotNews() {
  const navigate = useNavigate()

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="font-bold text-[var(--owl-text)] mb-2">热点</h2>
      <p className="text-sm text-[var(--owl-text-muted)] mb-6">市场热点实时追踪</p>
      <div className="space-y-4">
        {hotItems.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(typeof item.id === 'number' ? `/news/${item.id}` : '/news')}
            className="bg-white rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow border-l-4 border-red-500"
          >
            <span className="inline-block px-2 py-0.5 bg-red-500/10 text-red-600 text-xs rounded mb-2">
              {item.type}
            </span>
            <h3 className="font-medium text-[var(--owl-text)]">{item.title}</h3>
            <p className="text-xs text-[var(--owl-text-muted)] mt-1">{item.time}</p>
          </div>
        ))}
      </div>
      <button
        onClick={() => navigate('/news')}
        className="mt-6 w-full py-3 bg-[var(--owl-primary)] text-white rounded-xl"
      >
        查看更多资讯
      </button>
    </div>
  )
}
