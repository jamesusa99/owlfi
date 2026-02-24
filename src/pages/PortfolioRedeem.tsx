import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function PortfolioRedeem() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [amount, setAmount] = useState('1000')
  const [redeemAll, setRedeemAll] = useState(false)

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <h3 className="font-medium text-[var(--owl-text)] mb-4">赎回</h3>
        <p className="text-sm text-[var(--owl-text-muted)] mb-4">稳健增长组合 · 可赎金额 ¥65,800</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[var(--owl-text-muted)] mb-2">赎回金额（元）</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={redeemAll}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl disabled:bg-gray-100"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={redeemAll} onChange={(e) => setRedeemAll(e.target.checked)} />
            <span className="text-sm">全部赎回</span>
          </label>
        </div>
      </div>
      <div className="flex gap-4">
        <button
          onClick={() => id && navigate(`/portfolio/${id}`)}
          className="flex-1 py-3 bg-gray-100 text-[var(--owl-text)] rounded-xl"
        >
          取消
        </button>
        <button
          onClick={() => id && navigate(`/portfolio/${id}/redeem/success`)}
          className="flex-1 py-3 bg-[var(--owl-primary)] text-white rounded-xl"
        >
          确认赎回
        </button>
      </div>
    </div>
  )
}
