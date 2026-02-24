import { useState } from 'react'

export default function ToolCompound() {
  const [principal, setPrincipal] = useState(10000)
  const [rate, setRate] = useState(8)
  const [years, setYears] = useState(10)

  const amount = principal * Math.pow(1 + rate / 100, years)
  const profit = amount - principal

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
        <h3 className="font-medium text-[var(--owl-text)] mb-4">复利计算</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[var(--owl-text-muted)] mb-2">本金（元）</label>
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--owl-text-muted)] mb-2">年化收益率（%）</label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--owl-text-muted)] mb-2">投资年限</label>
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(Number(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            />
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-br from-[var(--owl-primary)] to-[var(--owl-secondary)] rounded-2xl p-6 text-white">
        <p className="text-sm opacity-80 mb-2">到期本息合计</p>
        <p className="text-2xl font-bold">¥{amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        <p className="text-green-400 mt-2">收益 +¥{profit.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
      </div>
    </div>
  )
}
