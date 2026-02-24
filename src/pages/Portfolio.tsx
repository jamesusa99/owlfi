import { useNavigate } from 'react-router-dom'

export default function Portfolio() {
  const navigate = useNavigate()
  const portfolios = [
    { id: 1, name: '稳健增长', value: 65800, profit: 3280, rate: 5.24, status: '运行中' },
    { id: 2, name: '价值精选', value: 42760, profit: 1980.8, rate: 4.87, status: '运行中' },
    { id: 3, name: '货币增强', value: 20000, profit: 0, rate: 0, status: '已暂停' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* 组合总览 */}
      <section className="bg-gradient-to-br from-[var(--owl-primary)] to-[var(--owl-secondary)] rounded-2xl p-6 text-white mb-6 shadow-lg">
        <p className="text-white/80 text-sm mb-1">组合总资产</p>
        <p className="text-3xl font-bold">¥128,560.00</p>
        <div className="flex gap-6 mt-4">
          <div>
            <p className="text-white/70 text-xs">累计收益</p>
            <p className="text-green-400 font-medium">+¥5,260.80</p>
          </div>
          <div>
            <p className="text-white/70 text-xs">总收益率</p>
            <p className="text-[var(--owl-accent)] font-medium">+4.27%</p>
          </div>
        </div>
      </section>

      {/* 我的组合 */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-[var(--owl-text)]">我的组合</h3>
          <button onClick={() => navigate('/portfolio/create')} className="text-sm text-[var(--owl-primary)] font-medium">+ 新建组合</button>
        </div>
        <div className="space-y-4">
          {portfolios.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
            >
              <div
                onClick={() => navigate(`/portfolio/${p.id}`)}
                className="cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-[var(--owl-text)]">{p.name}</h4>
                    <span
                      className={`inline-block mt-2 px-2 py-0.5 text-xs rounded ${
                        p.status === '运行中' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-[var(--owl-text)]">¥{p.value.toLocaleString()}</p>
                    <p className={`text-sm ${p.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {p.profit >= 0 ? '+' : ''}¥{p.profit.toLocaleString()} ({p.rate >= 0 ? '+' : ''}{p.rate}%)
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => navigate(`/portfolio/${p.id}`)}
                  className="flex-1 py-2 bg-[var(--owl-primary)] text-white text-sm rounded-lg"
                >
                  查看详情
                </button>
                <button
                  onClick={() => navigate(`/portfolio/${p.id}/rebalance`)}
                  className="flex-1 py-2 bg-gray-100 text-[var(--owl-text)] text-sm rounded-lg"
                >
                  调仓
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 一键跟投 */}
      <section className="mt-8 bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="font-medium text-[var(--owl-text)] mb-4">一键跟投</h3>
        <p className="text-sm text-[var(--owl-text-muted)] mb-4">
          跟随专业投顾组合，省心省力获取稳健收益
        </p>
        <button
          onClick={() => navigate('/portfolio/follow')}
          className="w-full py-3 bg-[var(--owl-accent)] text-white font-medium rounded-xl"
        >
          选择跟投组合
        </button>
      </section>
    </div>
  )
}
