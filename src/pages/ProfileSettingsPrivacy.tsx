import { useNavigate } from 'react-router-dom'

export default function ProfileSettingsPrivacy() {
  const navigate = useNavigate()
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="font-medium text-[var(--owl-text)] mb-4">隐私设置</h3>
        <p className="text-sm text-[var(--owl-text-muted)] leading-relaxed">
          我们重视您的隐私。您的个人信息将仅用于提供服务所需，不会向第三方泄露。
          详细内容请参阅
          <button
            onClick={() => navigate('/profile/help/privacy-policy')}
            className="text-[var(--owl-primary)] hover:underline mx-1"
          >
            《隐私政策》
          </button>
        </p>
      </div>
    </div>
  )
}
