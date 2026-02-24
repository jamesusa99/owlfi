import { useNavigate } from 'react-router-dom'

export default function MarketIndicators() {
  const navigate = useNavigate()

  const indicators = [
    { name: '股债利差', value: '4.40%', status: '较好', desc: '反映股票相对债券的性价比', detail: '当前股债利差处于历史较高分位，股票资产性价比突出。' },
    { name: '市场温度', value: '66.12°C', status: '偏热', sub: '中证全指', desc: '衡量市场情绪热度', detail: '市场温度偏高，建议适度控制仓位，避免追高。' },
    { name: '估值分位', value: '45%', status: '中性', sub: '沪深300', desc: '当前估值在历史区间位置', detail: '估值处于历史中位，可逐步布局优质标的。' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="font-bold text-[var(--owl-text)] mb-2">市场指标</h2>
      <p className="text-sm text-[var(--owl-text-muted)] mb-6">更新于2026-02-23</p>
      <div className="space-y-4 mb-6">
        {indicators.map((ind) => (
          <div
            key={ind.name}
            onClick={() => navigate(`/market/indicators/${encodeURIComponent(ind.name)}`)}
            className="bg-white rounded-2xl p-5 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-[var(--owl-text-muted)]">{ind.name}{ind.sub && ` · ${ind.sub}`}</p>
                <p className="text-2xl font-bold text-[var(--owl-text)] mt-1">{ind.value}</p>
                <p className={`text-sm mt-1 ${
                  ind.status === '较好' ? 'text-green-600' :
                  ind.status === '偏热' ? 'text-orange-500' : 'text-blue-600'
                }`}>
                  {ind.status}
                </p>
              </div>
              <span className="text-[var(--owl-text-muted)]">›</span>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => navigate('/news')}
        className="w-full py-3 bg-[var(--owl-primary)] text-white rounded-xl"
      >
        查看市场资讯
      </button>
    </div>
  )
}
