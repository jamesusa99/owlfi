import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ChangePhone() {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[var(--owl-text-muted)] mb-2">新手机号</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="请输入新手机号"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl"
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--owl-text-muted)] mb-2">验证码</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="请输入验证码"
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl"
              />
              <button className="px-4 py-3 bg-[var(--owl-primary)] text-white rounded-xl whitespace-nowrap">
                获取验证码
              </button>
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={() => navigate('/profile/settings/security')}
        className="mt-6 w-full py-3 bg-[var(--owl-primary)] text-white rounded-xl"
      >
        确认更换
      </button>
    </div>
  )
}
