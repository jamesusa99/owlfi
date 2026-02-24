import { useNavigate } from 'react-router-dom'

export default function ProfileAssociatedAccount() {
  const navigate = useNavigate()

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h2 className="font-bold text-[var(--owl-text)] mb-2">关联账户</h2>
      <p className="text-[var(--owl-text-muted)] text-sm mb-6">管理您的关联交易账户</p>
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center mb-6">
        <p className="text-[var(--owl-text-muted)] mb-4">暂无已关联账户</p>
        <p className="text-sm text-[var(--owl-text-muted)]">关联后可在多平台同步您的组合与持仓</p>
      </div>
      <button onClick={() => navigate('/profile')} className="w-full py-2 text-[var(--owl-text-muted)] text-sm">
        返回我的
      </button>
    </div>
  )
}
