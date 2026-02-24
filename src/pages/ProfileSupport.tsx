import { useNavigate } from 'react-router-dom'

export default function ProfileSupport() {
  const navigate = useNavigate()
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-6">
        <div>
          <h3 className="font-medium text-[var(--owl-text)] mb-2">客服热线</h3>
          <a href="tel:4008888888" className="text-[var(--owl-primary)] font-mono text-lg hover:underline">
            400-888-8888
          </a>
          <p className="text-sm text-[var(--owl-text-muted)]">工作时间 9:00-18:00</p>
        </div>
        <div>
          <h3 className="font-medium text-[var(--owl-text)] mb-2">在线客服</h3>
          <p className="text-sm text-[var(--owl-text-muted)]">点击下方按钮即可发起对话</p>
          <button
            onClick={() => navigate('/profile/support/chat')}
            className="mt-2 w-full py-3 bg-[var(--owl-primary)] text-white rounded-xl"
          >
            立即咨询
          </button>
        </div>
      </div>
    </div>
  )
}
