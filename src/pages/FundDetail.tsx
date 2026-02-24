import { useParams, useNavigate } from 'react-router-dom'

const fundInfo: Record<string, { name: string; code: string; type: string; manager: string; rate1y: number; rate3y: number; rate5y: number }> = {
  '005827': { name: '易方达蓝筹精选', code: '005827', type: '混合型', manager: '张坤', rate1y: 8.5, rate3y: 45.2, rate5y: 98.3 },
  '002001': { name: '华夏回报混合A', code: '002001', type: '混合型', manager: '蔡向阳', rate1y: 5.2, rate3y: 28.6, rate5y: 62.1 },
  '001938': { name: '中欧时代先锋', code: '001938', type: '股票型', manager: '周蔚文', rate1y: 12.8, rate3y: 55.3, rate5y: 125.6 },
}

export default function FundDetail() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const fund = code ? fundInfo[code] : null

  if (!fund) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center text-[var(--owl-text-muted)]">
        基金不存在
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <h1 className="text-xl font-bold text-[var(--owl-text)]">{fund.name}</h1>
        <p className="text-sm text-[var(--owl-text-muted)] mt-1">{fund.code} · {fund.type}</p>
        <p className="text-sm text-[var(--owl-text-muted)] mt-2">基金经理：{fund.manager}</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <h3 className="font-medium text-[var(--owl-text)] mb-4">历史业绩</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-[var(--owl-bg)] rounded-xl">
            <p className="text-xs text-[var(--owl-text-muted)]">近1年</p>
            <p className={`font-bold ${fund.rate1y >= 0 ? 'text-green-600' : 'text-red-600'}`}>{fund.rate1y >= 0 ? '+' : ''}{fund.rate1y}%</p>
          </div>
          <div className="text-center p-3 bg-[var(--owl-bg)] rounded-xl">
            <p className="text-xs text-[var(--owl-text-muted)]">近3年</p>
            <p className={`font-bold ${fund.rate3y >= 0 ? 'text-green-600' : 'text-red-600'}`}>{fund.rate3y >= 0 ? '+' : ''}{fund.rate3y}%</p>
          </div>
          <div className="text-center p-3 bg-[var(--owl-bg)] rounded-xl">
            <p className="text-xs text-[var(--owl-text-muted)]">近5年</p>
            <p className={`font-bold ${fund.rate5y >= 0 ? 'text-green-600' : 'text-red-600'}`}>{fund.rate5y >= 0 ? '+' : ''}{fund.rate5y}%</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <h3 className="font-medium text-[var(--owl-text)] mb-4">基金概况</h3>
        <p className="text-sm text-[var(--owl-text-muted)] leading-relaxed">
          本基金主要投资于具有竞争优势和持续成长能力的蓝筹公司股票，在严格控制风险的前提下，追求基金资产的长期增值。投资有风险，过往业绩不预示未来表现。
        </p>
      </div>
      <button
        onClick={() => navigate('/portfolio/follow')}
        className="w-full py-3 bg-[var(--owl-primary)] text-white rounded-xl"
      >
        加入组合跟投
      </button>
    </div>
  )
}
