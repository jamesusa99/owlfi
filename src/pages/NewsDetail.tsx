import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getNewsItemForApp, fetchNewsForApp, type NewsItem } from '../lib/publicApi'

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const newsId = id ? Number(id) : 0
  const [news, setNews] = useState<(NewsItem & { content: string }) | null>(null)
  const [related, setRelated] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!newsId) {
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    Promise.all([getNewsItemForApp(newsId), fetchNewsForApp()])
      .then(([item, list]) => {
        if (cancelled) return
        setNews(item ?? null)
        setRelated(list.filter((n) => n.id !== newsId).slice(0, 3))
      })
      .catch((e) => {
        if (!cancelled) setError(e?.message ?? '加载失败')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [newsId])

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
  if (!news) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center text-[var(--owl-text-muted)]">
        资讯不存在
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <article className="bg-white rounded-2xl p-6 shadow-sm">
        <h1 className="text-xl font-bold text-[var(--owl-text)] mb-2">{news.title}</h1>
        <p className="text-sm text-[var(--owl-text-muted)] mb-6">{news.publishTime}</p>
        <div className="text-[var(--owl-text)] leading-relaxed whitespace-pre-line">
          {news.content}
        </div>
      </article>
      {related.length > 0 && (
        <div className="mt-6">
          <h3 className="font-medium text-[var(--owl-text)] mb-3">相关推荐</h3>
          <div className="space-y-2">
            {related.map((n) => (
              <div
                key={n.id}
                onClick={() => navigate(`/news/${n.id}`)}
                className="bg-white rounded-xl p-3 shadow-sm cursor-pointer hover:shadow-md"
              >
                <p className="text-sm text-[var(--owl-text)]">{n.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
