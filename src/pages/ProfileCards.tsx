import { useNavigate } from 'react-router-dom'

const cards = [
  { id: 1, bank: '中国工商银行', tail: '8888', type: '储蓄卡', isDefault: true },
  { id: 2, bank: '中国建设银行', tail: '6666', type: '储蓄卡', isDefault: false },
]

export default function ProfileCards() {
  const navigate = useNavigate()

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="font-medium text-[var(--owl-text)] mb-4">银行卡管理</h2>
      <div className="space-y-4">
        {cards.map((c) => (
          <div key={c.id} className="bg-gradient-to-r from-[var(--owl-primary)] to-[var(--owl-secondary)] rounded-2xl p-5 text-white">
            <p className="text-white/80 text-sm">{c.bank}</p>
            <p className="text-xl font-mono mt-2">**** **** **** {c.tail}</p>
            <div className="flex justify-between mt-4">
              <span className="text-sm">{c.type}</span>
              {c.isDefault && <span className="text-xs bg-white/20 px-2 py-0.5 rounded">默认</span>}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => navigate('/profile/cards/add')}
        className="mt-6 w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-[var(--owl-text-muted)]"
      >
        + 添加银行卡
      </button>
    </div>
  )
}
