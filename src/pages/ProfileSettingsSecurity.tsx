import { useNavigate } from 'react-router-dom'

export default function ProfileSettingsSecurity() {
  const navigate = useNavigate()
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="space-y-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm flex justify-between items-center">
          <div>
            <p className="font-medium text-[var(--owl-text)]">登录密码</p>
            <p className="text-sm text-[var(--owl-text-muted)]">已设置</p>
          </div>
          <button onClick={() => navigate('/profile/settings/security/change-password')} className="text-[var(--owl-primary)] text-sm">修改</button>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm flex justify-between items-center">
          <div>
            <p className="font-medium text-[var(--owl-text)]">支付密码</p>
            <p className="text-sm text-[var(--owl-text-muted)]">已设置</p>
          </div>
          <button onClick={() => navigate('/profile/settings/security/change-password')} className="text-[var(--owl-primary)] text-sm">修改</button>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm flex justify-between items-center">
          <div>
            <p className="font-medium text-[var(--owl-text)]">手机号</p>
            <p className="text-sm text-[var(--owl-text-muted)]">138****8888</p>
          </div>
          <button onClick={() => navigate('/profile/settings/security/change-phone')} className="text-[var(--owl-primary)] text-sm">更换</button>
        </div>
      </div>
    </div>
  )
}
