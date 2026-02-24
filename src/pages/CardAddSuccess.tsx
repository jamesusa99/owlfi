import { useNavigate } from 'react-router-dom'

export default function CardAddSuccess() {
  const navigate = useNavigate()

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-4">✓</div>
      <h2 className="text-xl font-bold text-[var(--owl-text)] mb-2">添加成功</h2>
      <p className="text-[var(--owl-text-muted)] mb-8">您的银行卡已成功添加</p>
      <button
        onClick={() => navigate('/profile/cards')}
        className="px-8 py-3 bg-[var(--owl-primary)] text-white rounded-xl"
      >
        返回银行卡管理
      </button>
    </div>
  )
}
