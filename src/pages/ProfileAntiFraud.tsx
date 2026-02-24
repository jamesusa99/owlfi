import { useNavigate } from 'react-router-dom'

export default function ProfileAntiFraud() {
  const navigate = useNavigate()

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h2 className="font-bold text-[var(--owl-text)] mb-2">反欺诈专区</h2>
      <p className="text-[var(--owl-text-muted)] text-sm mb-6">防范诈骗，保护您的财产安全</p>
      <div className="space-y-4 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h4 className="font-medium text-[var(--owl-text)] mb-2">常见诈骗手段</h4>
          <p className="text-[var(--owl-text-muted)] text-sm leading-relaxed">谨防冒充客服、虚假投资、钓鱼链接等诈骗行为。猫头鹰基金研究院不会以任何理由索要您的验证码或密码。</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h4 className="font-medium text-[var(--owl-text)] mb-2">举报渠道</h4>
          <p className="text-[var(--owl-text-muted)] text-sm leading-relaxed">如遇可疑情况，请及时联系官方客服或前往帮助中心反馈。</p>
        </div>
      </div>
      <button
        onClick={() => navigate('/profile/support')}
        className="w-full py-3 bg-[var(--owl-primary)] text-white rounded-xl font-medium"
      >
        联系客服
      </button>
    </div>
  )
}
