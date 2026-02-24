import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchCoursesForApp, type Course } from '../lib/publicApi'

const topicTags: Record<string, string> = {
  '定投': '定投',
  '资产配置': '资产配置',
  '基金选择': '基金选择',
  '风险控制': '风险控制',
  '市场分析': '市场分析',
}

export default function TopicList() {
  const { tag } = useParams<{ tag: string }>()
  const decodedTag = tag ? decodeURIComponent(tag) : ''
  const navigate = useNavigate()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchCoursesForApp()
      .then((data) => {
        if (!cancelled) setCourses(data)
      })
      .catch((e) => {
        if (!cancelled) setError(e?.message ?? '加载失败')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const tagFilter = decodedTag ? topicTags[decodedTag] ?? decodedTag : ''
  const topicCourses = tagFilter
    ? courses.filter((c) => c.tag === tagFilter || c.title.includes(tagFilter))
    : []

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center text-red-600">
        {error}
      </div>
    )
  }
  if (decodedTag && !topicTags[decodedTag] && !tagFilter) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center text-[var(--owl-text-muted)]">
        话题不存在
      </div>
    )
  }

  const displayTag = decodedTag ? `#${decodedTag}` : ''

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="font-medium text-[var(--owl-text)] mb-4">{displayTag} 相关课程</h2>
      {loading ? (
        <p className="text-[var(--owl-text-muted)]">加载中...</p>
      ) : topicCourses.length === 0 ? (
        <p className="text-[var(--owl-text-muted)]">暂无相关课程</p>
      ) : (
        <div className="space-y-4">
          {topicCourses.map((course) => (
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
      )}
    </div>
  )
}
