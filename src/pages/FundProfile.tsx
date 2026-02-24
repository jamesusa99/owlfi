import { useNavigate } from 'react-router-dom'

const funds = [
  { code: '005827', name: '易方达蓝筹精选', style: '价值成长', risk: '中高', scale: '较大' },
  { code: '002001', name: '华夏回报混合A', style: '稳健价值', risk: '中', scale: '大' },
  { code: '001938', name: '中欧时代先锋', style: '成长', risk: '高', scale: '中' },
]

export default function FundProfile() {
  const navigate = useNavigate()

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="font-bold text-[var(--owl-text)] mb-2">基金画像</h2>
      <p className="text-sm text-[var(--owl-text-muted)] mb-6">多维度刻画基金特征，辅助投资决策</p>
      <div className="space-y-4">
        {funds.map((f) => (
          <div
            key={f.code}
            onClick={() => navigate(`/fund/${f.code}`)}
            className="bg-white rounded-2xl p-5 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
          >
            <h3 className="font-medium text-[var(--owl-text)] mb-2">{f.name}</h3>
            <p className="text-xs text-[var(--owl-text-muted)] mb-3">{f.code}</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">风格：{f.style}</span>
              <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded">风险：{f.risk}</span>
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">规模：{f.scale}</span>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => navigate('/tools/fund-compare')}
        className="mt-6 w-full py-3 bg-[var(--owl-primary)] text-white rounded-xl"
      >
        基金对比
      </button>
    </div>
  )
}
