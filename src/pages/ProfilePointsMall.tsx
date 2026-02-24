import { useNavigate } from 'react-router-dom'

export default function ProfilePointsMall() {
  const navigate = useNavigate()

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h2 className="font-bold text-[var(--owl-text)] mb-2">积分商城</h2>
      <p className="text-[var(--owl-text-muted)] text-sm mb-6">使用积分兑换好礼</p>
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
        <p className="text-4xl font-bold text-[var(--owl-primary)] mb-2">0</p>
        <p className="text-[var(--owl-text-muted)] text-sm mb-4">当前积分</p>
        <button onClick={() => navigate('/profile')} className="text-[var(--owl-primary)] text-sm">
          返回我的
        </button>
      </div>
    </div>
  )
}
