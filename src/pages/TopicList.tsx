import { useParams, useNavigate } from 'react-router-dom'

const topicCourses: Record<string, { tag: string; courses: { id: number; title: string; type: string; duration: string }[] }> = {
  '定投': {
    tag: '#定投',
    courses: [
      { id: 4, title: '定投策略：微笑曲线的秘密', type: '图文', duration: '6分钟' },
      { id: 1, title: '基金投资入门：从零开始学理财', type: '视频', duration: '15分钟' },
    ],
  },
  '资产配置': {
    tag: '#资产配置',
    courses: [
      { id: 2, title: '资产配置的核心逻辑与实战', type: '图文', duration: '8分钟' },
      { id: 6, title: 'ETF投资完全指南', type: '图文', duration: '12分钟' },
    ],
  },
  '基金选择': {
    tag: '#基金选择',
    courses: [
      { id: 3, title: '如何评估基金的风险与收益', type: '视频', duration: '22分钟' },
      { id: 6, title: 'ETF投资完全指南', type: '图文', duration: '12分钟' },
    ],
  },
  '风险控制': {
    tag: '#风险控制',
    courses: [
      { id: 3, title: '如何评估基金的风险与收益', type: '视频', duration: '22分钟' },
      { id: 2, title: '资产配置的核心逻辑与实战', type: '图文', duration: '8分钟' },
    ],
  },
  '市场分析': {
    tag: '#市场分析',
    courses: [
      { id: 5, title: '行业轮动与景气度投资', type: '视频', duration: '30分钟' },
      { id: 2, title: '资产配置的核心逻辑与实战', type: '图文', duration: '8分钟' },
    ],
  },
}

export default function TopicList() {
  const { tag } = useParams<{ tag: string }>()
  const decodedTag = tag ? decodeURIComponent(tag) : ''
  const navigate = useNavigate()
  const topic = decodedTag ? topicCourses[decodedTag] : null

  if (!topic) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center text-[var(--owl-text-muted)]">
        话题不存在
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="font-medium text-[var(--owl-text)] mb-4">{topic.tag} 相关课程</h2>
      <div className="space-y-4">
        {topic.courses.map((course) => (
          <div
            key={course.id}
            onClick={() => navigate(`/classroom/course/${course.id}`)}
            className="bg-white rounded-2xl p-4 shadow-sm flex justify-between items-center cursor-pointer hover:shadow-md transition-shadow"
          >
            <div>
              <p className="font-medium text-[var(--owl-text)]">{course.title}</p>
              <p className="text-xs text-[var(--owl-text-muted)]">{course.type} · {course.duration}</p>
            </div>
            <span className="text-[var(--owl-primary)] text-xl">›</span>
          </div>
        ))}
      </div>
    </div>
  )
}
