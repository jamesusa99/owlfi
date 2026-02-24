import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCourseForApp, type Course } from '../lib/publicApi'
import VideoPlayer from '../components/VideoPlayer'

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const courseId = id ? Number(id) : 0
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!courseId) {
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    getCourseForApp(courseId)
      .then((data) => {
        if (!cancelled) setCourse(data ?? null)
      })
      .catch((e) => {
        if (!cancelled) setError(e?.message ?? '加载失败')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [courseId])

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center text-[var(--owl-text-muted)]">
        加载中...
      </div>
    )
  }
  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center text-red-600">
        {error}
      </div>
    )
  }
  if (!course) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center text-[var(--owl-text-muted)]">
        课程不存在
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
        {course.videoBvid ? (
          <VideoPlayer bvid={course.videoBvid} />
        ) : (
          <div className="aspect-video bg-gradient-to-br from-[var(--owl-primary)] to-[var(--owl-secondary)] flex items-center justify-center text-6xl">
            📖
          </div>
        )}
        <div className="p-5">
          <span className="inline-block px-2 py-0.5 bg-[var(--owl-accent)]/20 text-[var(--owl-accent)] text-xs rounded mb-2">
            {course.tag}
          </span>
          <h1 className="text-xl font-bold text-[var(--owl-text)] mb-2">{course.title}</h1>
          <p className="text-sm text-[var(--owl-text-muted)]">{course.type} · {course.duration}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
        <h3 className="font-medium text-[var(--owl-text)] mb-4">课程简介</h3>
        <p className="text-[var(--owl-text-muted)] text-sm leading-relaxed">{course.desc}</p>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="font-medium text-[var(--owl-text)] mb-4">目录</h3>
        <div className="space-y-3">
          {course.lessons.map((item) => (
            <div
              key={item.id}
              onClick={() => id && navigate(`/classroom/course/${id}/learn/${item.id}`)}
              className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-50 rounded-lg -mx-2 px-2"
            >
              <span className="w-6 h-6 rounded-full bg-[var(--owl-primary)]/10 text-[var(--owl-primary)] text-sm flex items-center justify-center flex-shrink-0">
                {item.id}
              </span>
              <span className="text-[var(--owl-text)]">{item.id}. {item.title}</span>
              {item.videoBvid && <span className="text-xs text-[var(--owl-text-muted)]">视频</span>}
              <span className="ml-auto text-[var(--owl-text-muted)]">›</span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => {
          const firstId = course.lessons[0]?.id
          if (firstId) navigate(`/classroom/course/${id}/learn/${firstId}`)
        }}
        className="w-full mt-6 py-4 bg-[var(--owl-primary)] text-white font-medium rounded-xl"
      >
        开始学习
      </button>
    </div>
  )
}
