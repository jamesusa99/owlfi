import { useNavigate } from 'react-router-dom'

const events = [
  { id: 1, title: '猫头鹰策略会-2月专场', date: '2026-02-25', time: '14:00', type: '线上', speaker: '首席策略师' },
  { id: 2, title: 'ETF策略解读会', date: '2026-02-28', time: '15:30', type: '线上', speaker: '量化团队' },
  { id: 3, title: '九点客座谈第十六期', date: '2026-03-05', time: '09:00', type: '直播', speaker: '特邀嘉宾' },
]

export default function RoadshowCalendar() {
  const navigate = useNavigate()

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="font-bold text-[var(--owl-text)] mb-2">路演日历</h2>
      <p className="text-sm text-[var(--owl-text-muted)] mb-6">专业投研活动，与您实时连线</p>
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
                  {e.type}
                </span>
                <h3 className="font-medium text-[var(--owl-text)] mb-1">{e.title}</h3>
                <p className="text-sm text-[var(--owl-text-muted)]">
                  {e.date} {e.time} · {e.speaker}
                </p>
              </div>
              <span className="text-[var(--owl-primary)]">›</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
