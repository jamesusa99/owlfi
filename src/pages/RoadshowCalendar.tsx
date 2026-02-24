import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRoadshowEventsForApp, type RoadshowEventForApp } from '../lib/publicApi'

export default function RoadshowCalendar() {
  const navigate = useNavigate()
  const [events, setEvents] = useState<RoadshowEventForApp[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getRoadshowEventsForApp()
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="font-bold text-[var(--owl-text)] mb-2">路演日历</h2>
      <p className="text-sm text-[var(--owl-text-muted)] mb-6">专业投研活动，与您实时连线</p>
      {loading ? (
        <p className="text-sm text-[var(--owl-text-muted)]">加载中...</p>
      ) : events.length === 0 ? (
        <p className="text-sm text-[var(--owl-text-muted)]">暂无路演场次</p>
      ) : (
        <div className="space-y-4">
          {events.map((e) => (
            <div
              key={e.id}
              onClick={() => navigate(`/roadshow/${e.id}`)}
              className="bg-white rounded-2xl p-5 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="inline-block px-2 py-0.5 bg-[var(--owl-primary)]/10 text-[var(--owl-primary)] text-xs rounded mb-2">
                    {e.status}
                  </span>
                  <h3 className="font-medium text-[var(--owl-text)] mb-1">{e.title}</h3>
                  <p className="text-sm text-[var(--owl-text-muted)]">
                    {e.date} {e.time}
                    {e.durationMinutes > 0 && ` · ${e.durationMinutes}分钟`}
                  </p>
                </div>
                <span className="text-[var(--owl-primary)]">›</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
