import { useState } from 'react'

export default function ToolInflation() {
  const [amount, setAmount] = useState(10000)
  const [years, setYears] = useState(10)
  const [inflationRate, setInflationRate] = useState(3)

  const futureValue = amount / Math.pow(1 + inflationRate / 100, years)
  const purchasingPower = (futureValue / amount) * 100

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
        <h3 className="font-medium text-[var(--owl-text)] mb-4">通胀测算</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[var(--owl-text-muted)] mb-2">当前金额（元）</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--owl-text-muted)] mb-2">年通胀率（%）</label>
            <input
              type="number"
              value={inflationRate}
              onChange={(e) => setInflationRate(Number(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--owl-text-muted)] mb-2">N年后</label>
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(Number(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <p className="text-sm text-[var(--owl-text-muted)] mb-2">{years}年后的购买力相当于</p>
        <p className="text-2xl font-bold text-[var(--owl-primary)]">¥{futureValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        <p className="text-sm text-[var(--owl-text-muted)] mt-2">购买力约为当前的 {purchasingPower.toFixed(1)}%</p>
      </div>
    </div>
  )
}
