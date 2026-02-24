import { useNavigate } from 'react-router-dom'

export default function FeedbackSuccess() {
  const navigate = useNavigate()

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-4">✓</div>
      <h2 className="text-xl font-bold text-[var(--owl-text)] mb-2">提交成功</h2>
      <p className="text-[var(--owl-text-muted)] mb-8">感谢您的反馈，我们会尽快处理</p>
      <button
        onClick={() => navigate('/profile')}
        className="px-8 py-3 bg-[var(--owl-primary)] text-white rounded-xl"
      >
        返回我的
      </button>
    </div>
  )
}
