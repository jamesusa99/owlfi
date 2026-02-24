import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchNewsForApp, type NewsItem } from '../lib/publicApi'

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

export default function NewsList() {
  const navigate = useNavigate()
  const [list, setList] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchNewsForApp()
      .then((data) => {
        if (!cancelled) setList(data)
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
      <h2 className="font-medium text-[var(--owl-text)] mb-4">市场资讯</h2>
      {loading ? (
        <p className="text-[var(--owl-text-muted)]">加载中...</p>
      ) : list.length === 0 ? (
        <div className="text-[var(--owl-text-muted)] space-y-2">
          <p>暂无已发布的资讯</p>
          <p className="text-xs">若已在后台添加资讯，请将状态设为「已发布」后刷新本页</p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((news) => (
            <div
              key={news.id}
              onClick={() => navigate(`/news/${news.id}`)}
              className="bg-white rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            >
              <p className="font-medium text-[var(--owl-text)]">{news.title}</p>
              <p className="text-xs text-[var(--owl-text-muted)] mt-1">{formatTime(news.publishTime)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
