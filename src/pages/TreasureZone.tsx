import { useNavigate } from 'react-router-dom'

const treasures = [
  { id: 1, name: '稳健红利组合', type: '组合', rate: '+6.2%', tag: '高股息', desc: '精选高股息标的' },
  { id: 2, name: '科技成长精选', type: '组合', rate: '+12.8%', tag: '高弹性', desc: '聚焦科技龙头' },
  { id: 3, name: '易方达蓝筹精选', type: '基金', code: '005827', rate: '+8.5%', tag: '明星基金' },
]

export default function TreasureZone() {
  const navigate = useNavigate()

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="font-bold text-[var(--owl-text)] mb-2">挖宝专区</h2>
      <p className="text-sm text-[var(--owl-text-muted)] mb-6">精选优质产品，发现投资机会</p>
      <div className="space-y-4">
        {treasures.map((t) => (
          <div
            key={t.id}
            onClick={() => t.type === '组合' ? navigate(`/portfolio/${t.id}`) : navigate(`/fund/${t.code}`)}
            className="bg-white rounded-2xl p-5 shadow-sm cursor-pointer hover:shadow-md transition-shadow border-l-4 border-[var(--owl-accent)]"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="inline-block px-2 py-0.5 bg-[var(--owl-accent)]/20 text-[var(--owl-accent)] text-xs rounded mb-2">
                  {t.tag}
                </span>
                <h3 className="font-medium text-[var(--owl-text)]">{t.name}</h3>
                <p className="text-sm text-[var(--owl-text-muted)]">{t.desc}</p>
              </div>
              <p className="text-lg font-bold text-green-600">{t.rate}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => navigate('/portfolio/follow')}
        className="mt-6 w-full py-3 bg-[var(--owl-accent)] text-white rounded-xl font-medium"
      >
        查看更多跟投组合
      </button>
    </div>
  )
}
