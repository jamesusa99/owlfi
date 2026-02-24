import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ChangePassword() {
  const navigate = useNavigate()
  const [oldPwd, setOldPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')

  const handleSubmit = () => {
    navigate('/profile/settings/security')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[var(--owl-text-muted)] mb-2">原密码</label>
            <input
              type="password"
              value={oldPwd}
              onChange={(e) => setOldPwd(e.target.value)}
              placeholder="请输入原密码"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl"
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--owl-text-muted)] mb-2">新密码</label>
            <input
              type="password"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              placeholder="请输入新密码"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl"
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--owl-text-muted)] mb-2">确认新密码</label>
            <input
              type="password"
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              placeholder="请再次输入新密码"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl"
            />
          </div>
        </div>
      </div>
      <button
        onClick={handleSubmit}
        className="mt-6 w-full py-3 bg-[var(--owl-primary)] text-white rounded-xl"
      >
        确认修改
      </button>
    </div>
  )
}
