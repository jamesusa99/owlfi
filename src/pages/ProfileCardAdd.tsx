import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ProfileCardAdd() {
  const navigate = useNavigate()
  const [cardNo, setCardNo] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[var(--owl-text-muted)] mb-2">银行卡号</label>
            <input
              type="text"
              placeholder="请输入卡号"
              value={cardNo}
              onChange={(e) => setCardNo(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl"
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--owl-text-muted)] mb-2">持卡人姓名</label>
            <input
              type="text"
              placeholder="请输入姓名"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl"
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--owl-text-muted)] mb-2">预留手机号</label>
            <input
              type="tel"
              placeholder="请输入手机号"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl"
            />
          </div>
        </div>
      </div>
      <button
        onClick={() => navigate('/profile/cards/add/success')}
        className="mt-6 w-full py-3 bg-[var(--owl-primary)] text-white rounded-xl"
      >
        确认添加
      </button>
    </div>
  )
}
