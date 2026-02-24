import { useParams, useNavigate } from 'react-router-dom'

const holdings = [
  { id: 1, name: '易方达蓝筹精选', code: '005827', current: 15, target: 15, diff: 0 },
  { id: 2, name: '华夏回报混合A', code: '002001', current: 14, target: 12, diff: -2 },
  { id: 3, name: '中欧时代先锋', code: '001938', current: 11, target: 13, diff: 2 },
]

export default function PortfolioRebalance() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
        <h3 className="font-medium text-[var(--owl-text)] mb-4">调仓方案</h3>
        <p className="text-sm text-[var(--owl-text-muted)] mb-4">
          根据市场变化，系统已生成调仓建议，使组合回归目标比例。
        </p>
        <div className="space-y-4">
          {holdings.map((h) => (
            <div
              key={h.id}
              onClick={() => navigate(`/fund/${h.code}`)}
              className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50 -mx-2 px-2 rounded"
            >
              <div>
                <p className="font-medium text-[var(--owl-text)]">{h.name}</p>
                <p className="text-xs text-[var(--owl-text-muted)]">{h.code}</p>
              </div>
              <div className="text-right">
                <p className="text-sm">
                  <span className="text-[var(--owl-text-muted)]">当前 {h.current}%</span>
                  <span className="mx-1">→</span>
                  <span>目标 {h.target}%</span>
                </p>
                <p className={`text-sm font-medium ${h.diff > 0 ? 'text-green-600' : h.diff < 0 ? 'text-orange-600' : ''}`}>
                  {h.diff > 0 ? `申购 +${h.diff}%` : h.diff < 0 ? `赎回 ${h.diff}%` : '保持不变'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => navigate(`/portfolio/${id}`)}
          className="flex-1 py-3 bg-gray-100 text-[var(--owl-text)] rounded-xl"
        >
          取消
        </button>
        <button
          onClick={() => id && navigate(`/portfolio/${id}/rebalance/success`)}
          className="flex-1 py-3 bg-[var(--owl-primary)] text-white rounded-xl"
        >
          确认调仓
        </button>
      </div>
    </div>
  )
}
