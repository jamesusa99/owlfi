import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchForumPostsForApp, type ForumPostItem } from '../lib/publicApi'

const categories = [
  { id: 'all', name: '全部' },
  { id: 'market', name: '市场热议' },
  { id: 'strategy', name: '投资策略' },
  { id: 'qa', name: '答疑解惑' },
]

function formatTime(publishTime: string): string {
  const d = new Date(publishTime)
  if (isNaN(d.getTime())) return publishTime
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)
  if (days > 0) return `${days}天前`
  if (hours > 0) return `${hours}小时前`
  return '刚刚'
}

export default function Forum() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState<ForumPostItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchForumPostsForApp()
      .then((data) => {
        if (!cancelled) setPosts(data)
      })
      .catch((e) => {
        if (!cancelled) setError(e?.message ?? '加载失败')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center text-red-600">
        {error}
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className="px-4 py-2 rounded-full text-sm font-medium bg-white shadow-sm text-[var(--owl-text-muted)] hover:bg-[var(--owl-primary)] hover:text-white transition-colors"
          >
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-[var(--owl-text-muted)]">加载中...</p>
      ) : posts.length === 0 ? (
        <p className="text-[var(--owl-text-muted)]">暂无帖子</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              onClick={() => navigate(`/forum/post/${post.id}`)}
              className="bg-white rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            >
              <h3 className="font-medium text-[var(--owl-text)] line-clamp-2 mb-2">{post.title}</h3>
              <div className="flex items-center justify-between text-sm text-[var(--owl-text-muted)]">
                <span>{post.author}</span>
                <div className="flex gap-4">
                  <span>💬 {post.replies}</span>
                  <span>{formatTime(post.publishTime)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => navigate('/forum/create')}
        className="fixed bottom-24 right-6 w-14 h-14 bg-[var(--owl-primary)] text-white rounded-full shadow-lg flex items-center justify-center text-2xl hover:scale-110 transition-transform md:bottom-6 z-30"
      >
        +
      </button>
    </div>
  )
}
