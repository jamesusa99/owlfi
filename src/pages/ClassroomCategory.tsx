import { useParams, useNavigate } from 'react-router-dom'
import { courses } from '../data/courses'

const categoryMap: Record<string, string[]> = {
  '基金经理精选': ['进阶', '高级'],
  '基金比较研究': ['进阶'],
  'ETF策略研究': ['进阶'],
  '绝对收益策略': ['高级'],
  '基金组合配置': ['进阶'],
}

export default function ClassroomCategory() {
  const { cat } = useParams<{ cat: string }>()
  const navigate = useNavigate()
  const decoded = cat ? decodeURIComponent(cat) : ''
  const tags = decoded ? categoryMap[decoded] || [decoded] : []
  const filtered = tags.length
    ? courses.filter((c) => tags.includes(c.tag))
    : courses

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="font-bold text-[var(--owl-text)] mb-2">{decoded || '课程分类'}</h2>
      <p className="text-sm text-[var(--owl-text-muted)] mb-6">精选课程，系统学习</p>
      <div className="space-y-4">
        {filtered.map((course) => (
          <div
            key={course.id}
            onClick={() => navigate(`/classroom/course/${course.id}`)}
            className="bg-white rounded-2xl p-4 shadow-sm flex gap-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="w-20 h-20 flex-shrink-0 bg-gradient-to-br from-[var(--owl-primary)] to-[var(--owl-secondary)] rounded-xl flex items-center justify-center text-4xl">
              {course.thumbnail}
            </div>
            <div className="flex-1 min-w-0">
              <span className="inline-block px-2 py-0.5 bg-[var(--owl-accent)]/20 text-[var(--owl-accent)] text-xs rounded mb-2">
                {course.tag}
              </span>
              <h4 className="font-medium text-[var(--owl-text)] line-clamp-2">{course.title}</h4>
              <p className="text-xs text-[var(--owl-text-muted)] mt-1">
                {course.type} · {course.duration}
              </p>
            </div>
            <span className="text-[var(--owl-primary)] text-2xl self-center">›</span>
          </div>
        ))}
      </div>
      <button
        onClick={() => navigate('/classroom')}
        className="mt-6 w-full py-2 text-[var(--owl-text-muted)]"
      >
        返回投顾学院
      </button>
    </div>
  )
}
