import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  fetchCoursesForApp,
  getClassroomConfigForApp,
  getInstructorsForApp,
  type Course,
} from '../lib/publicApi'

export default function Classroom() {
  const navigate = useNavigate()
  const [config, setConfig] = useState<{ title: string; categoryTabs: string[] } | null>(null)
  const [selectedCat, setSelectedCat] = useState('全部')
  const [courses, setCourses] = useState<Course[]>([])
  const [instructors, setInstructors] = useState<{ id: number; name: string; title: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    Promise.all([fetchCoursesForApp(), getClassroomConfigForApp(), getInstructorsForApp()])
      .then(([coursesData, cfg, inst]) => {
        if (!cancelled) {
          setCourses(coursesData)
          setConfig(cfg)
          setInstructors(inst)
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e?.message ?? '加载失败')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const categoryTabs = config?.categoryTabs?.length ? ['全部', ...config.categoryTabs] : ['全部', '入门', '进阶', '高级', '视频', '图文']
  const filteredCourses =
    selectedCat === '全部'
      ? courses
      : courses.filter(
          (c) =>
            c.tag === selectedCat ||
            c.type === selectedCat ||
            c.knowledgeDomain === selectedCat ||
            c.certificationDimension === selectedCat
        )

  const getInstructorName = (instructorId: number | null | undefined) => {
    if (instructorId == null) return ''
    const i = instructors.find((x) => x.id === instructorId)
    return i ? i.name : ''
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center text-red-600">
        {error}
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {config?.title && (
        <h2 className="font-bold text-[var(--owl-text)] mb-4">{config.title}</h2>
      )}
      <section className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categoryTabs.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCat === cat
                  ? 'bg-[var(--owl-primary)] text-white'
                  : 'bg-white text-[var(--owl-text-muted)] hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="font-medium text-[var(--owl-text)]">精选课程</h3>
        {loading ? (
          <p className="text-[var(--owl-text-muted)]">加载中...</p>
        ) : filteredCourses.length === 0 ? (
          <p className="text-[var(--owl-text-muted)]">暂无课程</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                onClick={() => navigate(`/classroom/course/${course.id}`)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="aspect-video bg-[var(--owl-primary)]/5 flex items-center justify-center overflow-hidden">
                  {course.coverUrl ? (
                    <img src={course.coverUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-5xl">{course.thumbnail || '📖'}</span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {course.difficulty && (
                      <span className="inline-block px-2 py-0.5 bg-[var(--owl-primary)]/10 text-[var(--owl-primary)] text-xs rounded">
                        {course.difficulty}
                      </span>
                    )}
                    {course.knowledgeDomain && (
                      <span className="inline-block px-2 py-0.5 bg-gray-100 text-[var(--owl-text-muted)] text-xs rounded">
                        {course.knowledgeDomain}
                      </span>
                    )}
                    {course.certificationDimension && (
                      <span className="inline-block px-2 py-0.5 bg-[var(--owl-accent)]/20 text-[var(--owl-accent)] text-xs rounded">
                        {course.certificationDimension}
                      </span>
                    )}
                    {!course.difficulty && !course.knowledgeDomain && !course.certificationDimension && course.tag && (
                      <span className="inline-block px-2 py-0.5 bg-[var(--owl-accent)]/20 text-[var(--owl-accent)] text-xs rounded">
                        {course.tag}
                      </span>
                    )}
                  </div>
                  <h4 className="font-medium text-[var(--owl-text)] line-clamp-2 mb-1">{course.title}</h4>
                  <p className="text-xs text-[var(--owl-text-muted)]">
                    {getInstructorName(course.instructorId) && `${getInstructorName(course.instructorId)} · `}
                    {course.type} · {course.duration}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8">
        <h3 className="font-medium text-[var(--owl-text)] mb-4">热门话题</h3>
        <div className="flex flex-wrap gap-2">
          {['定投', '资产配置', '基金选择', '风险控制', '市场分析'].map((tag) => (
            <span
              key={tag}
              onClick={() => navigate(`/classroom/topic/${encodeURIComponent(tag)}`)}
              className="px-4 py-2 bg-white rounded-full text-sm text-[var(--owl-text-muted)] shadow-sm cursor-pointer hover:bg-[var(--owl-primary)] hover:text-white transition-colors"
            >
              #{tag}
            </span>
          ))}
        </div>
      </section>
    </div>
  )
}
