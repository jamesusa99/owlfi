import { useParams, useNavigate } from 'react-router-dom'

export default function PortfolioDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const portfolio = {
    name: '稳健增长组合',
    value: 65800,
    profit: 3280,
    rate: 5.24,
    holdAmount: 12,
    assetAllocation: [
      { name: '股票型基金', percent: 40, color: '#1e3a5f' },
      { name: '债券型基金', percent: 35, color: '#2d5a87' },
      { name: '货币基金', percent: 15, color: '#d4a84b' },
      { name: '混合型基金', percent: 10, color: '#6b7c8d' },
    ],
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-gradient-to-br from-[var(--owl-primary)] to-[var(--owl-secondary)] rounded-2xl p-6 text-white mb-6 shadow-lg">
        <h2 className="text-lg font-medium mb-2">{portfolio.name}</h2>
        <p className="text-3xl font-bold">¥{portfolio.value.toLocaleString()}</p>
        <p className="text-green-400 mt-1">+¥{portfolio.profit.toLocaleString()} (+{portfolio.rate}%)</p>
        <p className="text-white/70 text-sm mt-2">持仓 {portfolio.holdAmount} 只基金</p>
        <button
          onClick={() => id && navigate(`/portfolio/${id}/rebalance`)}
          className="mt-4 px-4 py-2 bg-white/20 rounded-lg text-sm hover:bg-white/30"
        >
          调仓
        </button>
      </div>

      <section className="bg-white rounded-2xl p-5 shadow-sm mb-6">
        <h3 className="font-medium text-[var(--owl-text)] mb-4">资产配置</h3>
        <div className="space-y-3">
          {portfolio.assetAllocation.map((item) => (
            <div key={item.name}>
              <div className="flex justify-between text-sm mb-1">
                <span>{item.name}</span>
                <span>{item.percent}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl p-5 shadow-sm mb-6">
        <h3 className="font-medium text-[var(--owl-text)] mb-4">持仓明细</h3>
        <div className="space-y-4">
          {[
            { name: '易方达蓝筹精选', code: '005827', percent: 15, value: 9870, rate: 6.2 },
            { name: '华夏回报混合A', code: '002001', percent: 12, value: 7896, rate: 4.8 },
            { name: '中欧时代先锋', code: '001938', percent: 13, value: 8554, rate: 5.1 },
          ].map((fund) => (
            <div
              key={fund.code}
              onClick={() => navigate(`/fund/${fund.code}`)}
              className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50 -mx-2 px-2 rounded"
            >
              <div>
                <p className="font-medium text-[var(--owl-text)]">{fund.name}</p>
                <p className="text-xs text-[var(--owl-text-muted)]">{fund.code} · 占比{fund.percent}%</p>
              </div>
              <div className="text-right">
                <p className="font-medium">¥{fund.value.toLocaleString()}</p>
                <p className={`text-sm ${fund.rate >= 0 ? 'text-green-600' : 'text-red-600'}`}>+{fund.rate}%</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex gap-4">
        <button
          onClick={() => id && navigate(`/portfolio/${id}/subscribe`)}
          className="flex-1 py-3 bg-[var(--owl-primary)] text-white rounded-xl"
        >
          申购
        </button>
        <button
          onClick={() => id && navigate(`/portfolio/${id}/redeem`)}
          className="flex-1 py-3 bg-[var(--owl-accent)] text-white rounded-xl"
        >
          赎回
        </button>
      </div>
    </div>
  )
}
