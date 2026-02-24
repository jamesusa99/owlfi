import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function PortfolioFollowConfirm() {
  const navigate = useNavigate()
  const [amount, setAmount] = useState('1000')

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <h3 className="font-medium text-[var(--owl-text)] mb-4">确认跟投</h3>
        <p className="text-sm text-[var(--owl-text-muted)] mb-4">稳健增长组合</p>
        <div>
          <label className="block text-sm text-[var(--owl-text-muted)] mb-2">跟投金额（元）</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl"
          />
        </div>
      </div>
      <div className="flex gap-4">
        <button
          onClick={() => navigate('/portfolio/follow')}
          className="flex-1 py-3 bg-gray-100 text-[var(--owl-text)] rounded-xl"
        >
          返回
        </button>
        <button
          onClick={() => navigate('/portfolio/follow/success')}
          className="flex-1 py-3 bg-[var(--owl-primary)] text-white rounded-xl"
        >
          确认跟投
        </button>
      </div>
    </div>
  )
}
