import { useState } from 'react'

export default function ToolSIPCalculator() {
  const [monthly, setMonthly] = useState(1000)
  const [months, setMonths] = useState(36)
  const [rate, setRate] = useState(8)

  const totalInvested = monthly * months
  const r = rate / 100 / 12
  const futureValue = r > 0
    ? monthly * ((Math.pow(1 + r, months) - 1) / r)
    : totalInvested
  const profit = futureValue - totalInvested

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
        <h3 className="font-medium text-[var(--owl-text)] mb-4">定投参数</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[var(--owl-text-muted)] mb-2">
              每月定投金额（元）
            </label>
            <input
              type="number"
              value={monthly}
              onChange={(e) => setMonthly(Number(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--owl-text-muted)] mb-2">
              定投期限（月）
            </label>
            <input
              type="number"
              value={months}
              onChange={(e) => setMonths(Number(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--owl-text-muted)] mb-2">
              预期年化收益率（%）
            </label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            />
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-br from-[var(--owl-primary)] to-[var(--owl-secondary)] rounded-2xl p-6 text-white">
        <h3 className="text-sm opacity-80 mb-4">测算结果</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>累计投入</span>
            <span className="font-medium">¥{totalInvested.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>预计总资产</span>
            <span className="font-bold">¥{futureValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
          </div>
          <div className="flex justify-between text-green-400">
            <span>预计收益</span>
            <span className="font-bold">+¥{profit.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
