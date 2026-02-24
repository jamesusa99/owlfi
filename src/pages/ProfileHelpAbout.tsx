import { useNavigate } from 'react-router-dom'

export default function ProfileHelpAbout() {
  const navigate = useNavigate()
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-4">
        <h2 className="font-medium text-[var(--owl-text)] mb-4">关于我们</h2>
        <p className="text-[var(--owl-text-muted)] leading-relaxed mb-4">
          猫头鹰基金研究院致力于为投资者提供专业的智能投顾服务。我们依托专业的投研团队和先进的算法模型，
          为用户提供科学的资产配置建议和便捷的投资管理工具。
        </p>
        <p className="text-[var(--owl-text-muted)] leading-relaxed">
          本平台已获得相关业务资质，所有服务均符合监管要求。投资有风险，入市需谨慎。
        </p>
        <p className="text-sm text-[var(--owl-text-muted)] mt-6">版本 v1.0.0</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div
          onClick={() => navigate('/profile/help/user-agreement')}
          className="flex justify-between px-5 py-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50"
        >
          <span className="text-[var(--owl-text)]">用户协议</span>
          <span className="text-[var(--owl-text-muted)]">›</span>
        </div>
        <div
          onClick={() => navigate('/profile/help/privacy-policy')}
          className="flex justify-between px-5 py-4 cursor-pointer hover:bg-gray-50"
        >
          <span className="text-[var(--owl-text)]">隐私政策</span>
          <span className="text-[var(--owl-text-muted)]">›</span>
        </div>
      </div>
    </div>
  )
}
