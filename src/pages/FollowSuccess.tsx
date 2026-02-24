import { useNavigate } from 'react-router-dom'

export default function FollowSuccess() {
  const navigate = useNavigate()

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-4">✓</div>
      <h2 className="text-xl font-bold text-[var(--owl-text)] mb-2">跟投成功</h2>
      <p className="text-[var(--owl-text-muted)] mb-8">您的跟投申请已提交，资金将在确认后扣款</p>
      <button
        onClick={() => navigate('/portfolio')}
        className="px-8 py-3 bg-[var(--owl-primary)] text-white rounded-xl"
      >
        查看我的组合
      </button>
      <button
        onClick={() => navigate('/portfolio/follow')}
        className="block w-full mt-4 text-[var(--owl-text-muted)]"
      >
        继续跟投
      </button>
    </div>
  )
}
