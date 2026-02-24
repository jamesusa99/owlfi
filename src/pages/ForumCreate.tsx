import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const categories = [
  { id: 'market', name: '市场热议' },
  { id: 'strategy', name: '投资策略' },
  { id: 'qa', name: '答疑解惑' },
]

export default function ForumCreate() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('market')

  const handleSubmit = () => {
    if (!title.trim()) return
    navigate('/forum')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-[var(--owl-text)] mb-2">选择板块</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`px-4 py-2 rounded-full text-sm ${
                  category === c.id ? 'bg-[var(--owl-primary)] text-white' : 'bg-gray-100 text-[var(--owl-text-muted)]'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-[var(--owl-text)] mb-2">标题</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="请输入标题"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--owl-text)] mb-2">内容</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="分享你的观点..."
            rows={8}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none"
          />
        </div>
      </div>
      <button
        onClick={handleSubmit}
        disabled={!title.trim()}
        className="w-full py-3 bg-[var(--owl-primary)] text-white font-medium rounded-xl disabled:opacity-50"
      >
        发布
      </button>
    </div>
  )
}
