import { useParams, useNavigate } from 'react-router-dom'

export default function RedeemSuccess() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-4">✓</div>
      <h2 className="text-xl font-bold text-[var(--owl-text)] mb-2">赎回成功</h2>
      <p className="text-[var(--owl-text-muted)] mb-8">您的赎回申请已提交，资金将于1-3个工作日内到账</p>
      <button
        onClick={() => navigate(`/portfolio/${id}`)}
        className="px-8 py-3 bg-[var(--owl-primary)] text-white rounded-xl"
      >
        查看组合
      </button>
      <button
        onClick={() => navigate('/profile/orders')}
        className="block w-full mt-4 text-[var(--owl-text-muted)]"
      >
        查看订单
      </button>
    </div>
  )
}
