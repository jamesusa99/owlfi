import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ProfileFeedback() {
  const navigate = useNavigate()
  const [type, setType] = useState('')
  const [content, setContent] = useState('')

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="mb-4">
          <label className="block text-sm text-[var(--owl-text-muted)] mb-2">反馈类型</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl"
          >
            <option value="">请选择</option>
            <option value="complaint">投诉</option>
            <option value="suggestion">建议</option>
            <option value="other">其他</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-[var(--owl-text-muted)] mb-2">详细描述</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="请详细描述您的问题或建议"
            rows={5}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none"
          />
        </div>
      </div>
      <button
        onClick={() => navigate('/profile/feedback/success')}
        className="mt-6 w-full py-3 bg-[var(--owl-primary)] text-white rounded-xl"
      >
        提交
      </button>
    </div>
  )
}
