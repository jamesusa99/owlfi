import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getForumPostForApp, type ForumPostItem } from '../lib/publicApi'

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

export default function ForumPost() {
  const { id } = useParams<{ id: string }>()
  const postId = id ? Number(id) : 0
  const [post, setPost] = useState<ForumPostItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!postId) {
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    getForumPostForApp(postId)
      .then((data) => {
        if (!cancelled) setPost(data ?? null)
      })
      .catch((e) => {
        if (!cancelled) setError(e?.message ?? '加载失败')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [postId])

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center text-[var(--owl-text-muted)]">
        加载中...
      </div>
    )
  }
  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center text-red-600">
        {error}
      </div>
    )
  }
  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center text-[var(--owl-text-muted)]">
        帖子不存在
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <article className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <h1 className="text-lg font-bold text-[var(--owl-text)] mb-4">{post.title}</h1>
        <div className="flex items-center gap-3 text-sm text-[var(--owl-text-muted)] mb-4">
          <span>{post.author}</span>
          <span>{formatTime(post.publishTime)}</span>
        </div>
        <div className="text-[var(--owl-text)] leading-relaxed whitespace-pre-line mb-4">
          {post.content}
        </div>
        <div className="flex gap-6 text-sm text-[var(--owl-text-muted)]">
          <span>💬 {post.replies}</span>
        </div>
      </article>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="font-medium text-[var(--owl-text)] mb-4">评论</h3>
        <p className="text-sm text-[var(--owl-text-muted)]">暂无评论</p>
      </div>
    </div>
  )
}
