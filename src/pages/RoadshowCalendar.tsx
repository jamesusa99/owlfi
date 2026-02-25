import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRoadshowEventsForApp, type RoadshowEventForApp } from '../lib/publicApi'

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

function getDaysInMonth(year: number, month: number) {
  const first = new Date(year, month - 1, 1)
  const last = new Date(year, month, 0)
  const firstDay = first.getDay()
  const daysCount = last.getDate()
  return { firstDay, daysCount }
}

function getEventDatesInMonth(events: RoadshowEventForApp[], year: number, month: number): Set<string> {
  const prefix = `${year}-${String(month).padStart(2, '0')}-`
  const set = new Set<string>()
  events.forEach((e) => {
    if (e.date && e.date.startsWith(prefix)) set.add(e.date)
  })
  return set
}

export default function RoadshowCalendar() {
  const navigate = useNavigate()
  const now = new Date()
  const [viewYear, setViewYear] = useState(now.getFullYear())
  const [viewMonth, setViewMonth] = useState(now.getMonth() + 1)
  const [events, setEvents] = useState<RoadshowEventForApp[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'calendar' | 'past'>('calendar')

  useEffect(() => {
    getRoadshowEventsForApp()
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setLoading(false))
  }, [])

  const { firstDay, daysCount } = useMemo(
    () => getDaysInMonth(viewYear, viewMonth),
    [viewYear, viewMonth]
  )
  const eventDatesInMonth = useMemo(
    () => getEventDatesInMonth(events, viewYear, viewMonth),
    [events, viewYear, viewMonth]
  )
  const eventsForMonth = useMemo(() => {
    const prefix = `${viewYear}-${String(viewMonth).padStart(2, '0')}-`
    return events
      .filter((e) => e.date && e.date.startsWith(prefix))
      .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''))
  }, [events, viewYear, viewMonth])

  const pastEvents = useMemo(() => {
    const nowMs = now.getTime()
    return events
      .filter((e) => {
        const [datePart, timePart] = (e.startTime || '').split(' ')
        if (!datePart) return false
        const start = new Date(datePart + 'T' + (timePart || '00:00').slice(0, 5) + ':00')
        if (isNaN(start.getTime())) return false
        const end = start.getTime() + (e.durationMinutes || 0) * 60 * 1000
        return end < nowMs
      })
      .sort((a, b) => (b.startTime || '').localeCompare(a.startTime || ''))
  }, [events])

  const goPrevMonth = () => {
    if (viewMonth === 1) {
      setViewMonth(12)
      setViewYear((y) => y - 1)
    } else {
      setViewMonth((m) => m - 1)
    }
  }
  const goNextMonth = () => {
    if (viewMonth === 12) {
      setViewMonth(1)
      setViewYear((y) => y + 1)
    } else {
      setViewMonth((m) => m + 1)
    }
  }
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

  const calendarCells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) calendarCells.push(null)
  for (let d = 1; d <= daysCount; d++) calendarCells.push(d)

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="font-bold text-[var(--owl-text)] mb-2">路演日历</h2>
      <p className="text-sm text-[var(--owl-text-muted)] mb-6">专业投研活动，与您实时连线</p>

      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setTab('calendar')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === 'calendar' ? 'bg-[var(--owl-primary)] text-white' : 'bg-white text-[var(--owl-text-muted)] border'}`}
        >
          日历
        </button>
        <button
          type="button"
          onClick={() => setTab('past')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === 'past' ? 'bg-[var(--owl-primary)] text-white' : 'bg-white text-[var(--owl-text-muted)] border'}`}
        >
          往期路演
        </button>
      </div>

      {tab === 'past' && (
        <section className="mb-6">
          <h3 className="font-medium text-[var(--owl-text)] mb-3">往期路演</h3>
          {loading ? (
            <p className="text-sm text-[var(--owl-text-muted)]">加载中...</p>
          ) : pastEvents.length === 0 ? (
            <p className="text-sm text-[var(--owl-text-muted)]">暂无往期路演</p>
          ) : (
            <div className="space-y-4">
              {pastEvents.map((e) => (
                <div
                  key={e.id}
                  onClick={() => navigate(`/roadshow/${e.id}`)}
                  className="bg-white rounded-2xl shadow-sm cursor-pointer hover:shadow-md transition-shadow overflow-hidden flex"
                >
                  {e.posterUrl && (
                    <img
                      src={e.posterUrl}
                      alt={e.title}
                      className="w-24 min-h-[100px] object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 flex justify-between items-start p-5 min-w-0">
                    <div>
                      <span className="inline-block px-2 py-0.5 bg-[var(--owl-primary)]/10 text-[var(--owl-primary)] text-xs rounded mb-2">
                        {e.status}
                      </span>
                      <h3 className="font-medium text-[var(--owl-text)] mb-1">{e.title}</h3>
                      {e.speaker && (
                        <p className="text-xs text-[var(--owl-text-muted)] mb-1">主讲：{e.speaker}</p>
                      )}
                      <p className="text-sm text-[var(--owl-text-muted)]">
                        {e.date} {e.time}
                        {e.durationMinutes > 0 && ` · ${e.durationMinutes}分钟`}
                      </p>
                      {e.topic && (
                        <p className="text-sm text-[var(--owl-text)] mt-1 truncate">{e.topic}</p>
                      )}
                    </div>
                    <span className="text-[var(--owl-primary)] flex-shrink-0 ml-2">›</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {tab === 'calendar' && (
      <>
      {/* 当月日历 + 切换月份 */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={goPrevMonth}
            className="p-2 rounded-lg text-[var(--owl-text-muted)] hover:bg-gray-100"
          >
            上一月
          </button>
          <span className="font-semibold text-[var(--owl-text)]">
            {viewYear}年{viewMonth}月
          </span>
          <button
            type="button"
            onClick={goNextMonth}
            className="p-2 rounded-lg text-[var(--owl-text-muted)] hover:bg-gray-100"
          >
            下一月
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {WEEKDAYS.map((w) => (
            <div key={w} className="py-1 text-xs font-medium text-[var(--owl-text-muted)]">
              {w}
            </div>
          ))}
          {calendarCells.map((day, idx) => {
            if (day === null) return <div key={`empty-${idx}`} />
            const dateStr = `${viewYear}-${String(viewMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const hasEvent = eventDatesInMonth.has(dateStr)
            const isToday = dateStr === todayStr
            return (
              <div
                key={dateStr}
                className={`py-2 text-sm rounded-lg ${
                  isToday ? 'bg-[var(--owl-primary)] text-white font-medium' : hasEvent ? 'bg-[var(--owl-primary)]/10 text-[var(--owl-primary)]' : 'text-[var(--owl-text)]'
                }`}
              >
                {day}
              </div>
            )
          })}
        </div>
      </section>

      {/* 当月路演列表，按时间排序 */}
      <section>
        <h3 className="font-medium text-[var(--owl-text)] mb-3">
          {viewYear}年{viewMonth}月 路演列表
        </h3>
        {loading ? (
          <p className="text-sm text-[var(--owl-text-muted)]">加载中...</p>
        ) : eventsForMonth.length === 0 ? (
          <p className="text-sm text-[var(--owl-text-muted)]">该月暂无路演场次</p>
        ) : (
          <div className="space-y-4">
            {eventsForMonth.map((e) => (
              <div
                key={e.id}
                onClick={() => navigate(`/roadshow/${e.id}`)}
                className="bg-white rounded-2xl shadow-sm cursor-pointer hover:shadow-md transition-shadow overflow-hidden flex"
              >
                {e.posterUrl && (
                  <img
                    src={e.posterUrl}
                    alt={e.title}
                    className="w-24 min-h-[100px] object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 flex justify-between items-start p-5 min-w-0">
                  <div>
                    <span className="inline-block px-2 py-0.5 bg-[var(--owl-primary)]/10 text-[var(--owl-primary)] text-xs rounded mb-2">
                      {e.status}
                    </span>
                    <h3 className="font-medium text-[var(--owl-text)] mb-1">{e.title}</h3>
                    {e.speaker && (
                      <p className="text-xs text-[var(--owl-text-muted)] mb-1">主讲：{e.speaker}</p>
                    )}
                    <p className="text-sm text-[var(--owl-text-muted)]">
                      {e.date} {e.time}
                      {e.durationMinutes > 0 && ` · ${e.durationMinutes}分钟`}
                    </p>
                    {e.topic && (
                      <p className="text-sm text-[var(--owl-text)] mt-1 truncate">{e.topic}</p>
                    )}
                  </div>
                  <span className="text-[var(--owl-primary)] flex-shrink-0 ml-2">›</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      </>
      )}
    </div>
  )
}
