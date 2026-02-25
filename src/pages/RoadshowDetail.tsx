import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getRoadshowEventForApp } from '../lib/publicApi'
import type { RoadshowEventForApp } from '../lib/publicApi'

export default function RoadshowDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [event, setEvent] = useState<RoadshowEventForApp | null | undefined>(undefined)

  useEffect(() => {
    if (!id) {
      setEvent(null)
      return
    }
    getRoadshowEventForApp(Number(id))
      .then(setEvent)
      .catch(() => setEvent(null))
  }, [id])

  if (event === undefined) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center text-[var(--owl-text-muted)]">
        加载中...
      </div>
    )
  }

  if (!event) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center text-[var(--owl-text-muted)]">
        活动不存在
      </div>
    )
  }

  const hasLink = event.replayUrl || event.externalUrl
  const linkUrl = event.replayUrl || event.externalUrl || '#'

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <span className="inline-block px-2 py-0.5 bg-[var(--owl-primary)]/10 text-[var(--owl-primary)] text-xs rounded mb-4">
          {event.status}
        </span>
        {event.posterUrl && (
          <img
            src={event.posterUrl}
            alt={event.title}
            className="w-full rounded-xl mb-4 aspect-video object-cover"
          />
        )}
        <h1 className="text-xl font-bold text-[var(--owl-text)] mb-2">{event.title}</h1>
        {event.topic && (
          <p className="text-base text-[var(--owl-text)] font-medium mb-4">{event.topic}</p>
        )}
        <div className="space-y-2 text-sm text-[var(--owl-text-muted)] mb-4">
          {event.speaker && <p>主讲人：{event.speaker}</p>}
          <p>时间：{event.date} {event.time}</p>
          {event.durationMinutes > 0 && <p>时长：{event.durationMinutes} 分钟</p>}
          {event.location && <p>地点：{event.location}</p>}
          {event.reservationEnabled && (
            <p>预约人数：{event.reservationBaseCount + event.reservationRealCount}</p>
          )}
        </div>
        {event.summary && (
          <div className="border-t border-gray-100 pt-4 mt-4">
            <p className="text-sm text-[var(--owl-text)] leading-relaxed whitespace-pre-wrap">{event.summary}</p>
          </div>
        )}
        {event.content && (
          <div className="border-t border-gray-100 pt-4 mt-4">
            <h3 className="font-medium text-[var(--owl-text)] mb-2">路演内容</h3>
            <div className="text-sm text-[var(--owl-text)] leading-relaxed whitespace-pre-wrap prose prose-sm max-w-none">
              {event.content}
            </div>
          </div>
        )}
      </div>
      {hasLink && (
        <a
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-3 bg-[var(--owl-primary)] text-white rounded-xl text-center mb-4"
        >
          {event.replayUrl ? '观看回放' : '进入直播/回看'}
        </a>
      )}
      {event.materials && event.materials.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
          <h3 className="font-medium text-[var(--owl-text)] mb-3">路演资料</h3>
          <ul className="space-y-2">
            {event.materials.map((m, i) => (
              <li key={i}>
                {m.url ? (
                  <a href={m.url} target="_blank" rel="noopener noreferrer" className="text-[var(--owl-primary)] text-sm">
                    {m.type === 'fund' ? '基金' : '研报'}：{m.name}{m.code ? `（${m.code}）` : ''}
                  </a>
                ) : (
                  <span className="text-sm text-[var(--owl-text-muted)]">{m.type === 'fund' ? '基金' : '研报'}：{m.name}{m.code ? `（${m.code}）` : ''}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      <button
        onClick={() => navigate('/roadshow')}
        className="w-full mt-3 py-2 text-[var(--owl-text-muted)]"
      >
        返回路演日历
      </button>
    </div>
  )
}
