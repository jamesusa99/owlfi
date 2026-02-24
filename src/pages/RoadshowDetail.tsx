import { useParams, useNavigate } from 'react-router-dom'

const eventDetail: Record<string, { title: string; date: string; time: string; type: string; speaker: string; desc: string }> = {
  '1': {
    title: '猫头鹰策略会-2月专场',
    date: '2026-02-25',
    time: '14:00',
    type: '线上',
    speaker: '首席策略师',
    desc: '本期策略会将围绕当前市场热点，从宏观、策略、行业多维度解读投资机会，为投资者提供专业导航。',
  },
  '2': {
    title: 'ETF策略解读会',
    date: '2026-02-28',
    time: '15:30',
    type: '线上',
    speaker: '量化团队',
    desc: '深度解析ETF投资策略，包括行业轮动、Smart Beta等主题，助力投资者把握指数化投资机会。',
  },
  '3': {
    title: '九点客座谈第十六期',
    date: '2026-03-05',
    time: '09:00',
    type: '直播',
    speaker: '特邀嘉宾',
    desc: '邀请业内专家，围绕行为金融、量化投资等主题进行深度交流。',
  },
}

export default function RoadshowDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const event = id ? eventDetail[id] : null

  if (!event) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center text-[var(--owl-text-muted)]">
        活动不存在
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <span className="inline-block px-2 py-0.5 bg-[var(--owl-primary)]/10 text-[var(--owl-primary)] text-xs rounded mb-4">
          {event.type}
        </span>
        <h1 className="text-xl font-bold text-[var(--owl-text)] mb-4">{event.title}</h1>
        <div className="space-y-2 text-sm text-[var(--owl-text-muted)] mb-4">
          <p>时间：{event.date} {event.time}</p>
          <p>主讲：{event.speaker}</p>
        </div>
        <p className="text-[var(--owl-text)] leading-relaxed">{event.desc}</p>
      </div>
      <button
        onClick={() => navigate('/forum')}
        className="w-full py-3 bg-[var(--owl-primary)] text-white rounded-xl"
      >
        进入直播/回看
      </button>
      <button
        onClick={() => navigate('/roadshow')}
        className="w-full mt-3 py-2 text-[var(--owl-text-muted)]"
      >
        返回路演日历
      </button>
    </div>
  )
}
