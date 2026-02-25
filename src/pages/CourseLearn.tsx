import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCourseForApp, type Course, type Lesson } from '../lib/publicApi'
import VideoPlayer from '../components/VideoPlayer'

export default function CourseLearn() {
  const { id, lessonId } = useParams<{ id: string; lessonId: string }>()
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

  const lessonNum = lessonId ? Number(lessonId) : 0
  const lessons = course?.lessons ?? []
  const currentIndex = lessons.findIndex((l) => l.id === lessonNum)
  const safeIndex = currentIndex >= 0 ? currentIndex : 0
  const currentLesson: Lesson | undefined = lessons[safeIndex]

  const goPrev = () => {
    if (safeIndex > 0) {
      const prevLesson = lessons[safeIndex - 1]
      navigate(`/classroom/course/${id}/learn/${prevLesson.id}`)
    }
  }

  const goNext = () => {
    if (safeIndex < lessons.length - 1) {
      const nextLesson = lessons[safeIndex + 1]
      navigate(`/classroom/course/${id}/learn/${nextLesson.id}`)
    } else {
      navigate(`/classroom/course/${id}`)
    }
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 text-center text-[var(--owl-text-muted)]">
        加载中...
      </div>
    )
  }
  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 text-center text-red-600">
        {error}
      </div>
    )
  }
  if (!course) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 text-center text-[var(--owl-text-muted)]">
        课程不存在
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 lg:flex lg:gap-6">
      <div className="flex-1 min-w-0">
        <div className="mb-4 flex items-center justify-between text-sm text-[var(--owl-text-muted)]">
          <span>第 {safeIndex + 1} / {lessons.length} 节</span>
          <span className="text-xs">B站播放器支持 0.5x - 2x 倍速，可在播放器设置中调节</span>
        </div>

        {currentLesson?.videoBvid ? (
          <VideoPlayer bvid={currentLesson.videoBvid} className="mb-4" />
        ) : (
          <div className="aspect-video bg-[var(--owl-primary)] rounded-2xl flex items-center justify-center text-white text-6xl mb-4">
            ▶
          </div>
        )}

        <div className="bg-white rounded-2xl p-6 shadow-sm mb-4">
          <h2 className="font-semibold text-[var(--owl-text)] mb-4">
            第{currentLesson?.id}章：{currentLesson?.title}
          </h2>
          <div className="text-[var(--owl-text-muted)] leading-relaxed whitespace-pre-line">
            {currentLesson?.content || '暂无内容'}
          </div>
        </div>

        {course.pdfUrl && (
          <a
            href={course.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 mb-4 px-4 py-3 bg-amber-50 text-amber-800 rounded-xl border border-amber-200 hover:bg-amber-100 transition-colors"
          >
            <span>📄</span>
            <span className="font-medium">下载讲义</span>
            <span className="text-sm opacity-80">点击同步下载本节配套资料</span>
          </a>
        )}

        <div className="flex gap-4">
          <button
            onClick={goPrev}
            disabled={safeIndex === 0}
            className="flex-1 py-3 bg-gray-100 text-[var(--owl-text)] rounded-xl disabled:opacity-50 font-medium"
          >
            上一节
          </button>
          <button
            onClick={goNext}
            className="flex-1 py-3 bg-[var(--owl-primary)] text-white rounded-xl font-medium hover:bg-[#2d5a87] transition-colors"
          >
            {safeIndex === lessons.length - 1 ? '完成学习' : '下一节'}
          </button>
        </div>
        <button
          onClick={() => navigate(`/classroom/course/${id}`)}
          className="w-full mt-4 py-2 text-[var(--owl-text-muted)] text-sm"
        >
          返回课程目录
        </button>
      </div>

      {/* 笔记侧边栏占位 */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-medium text-[var(--owl-text)] mb-3">学习笔记</h3>
          <p className="text-xs text-[var(--owl-text-muted)]">
            支持实时记录笔记并关联时间戳，点击可跳转对应知识点。（功能开发中）
          </p>
        </div>
      </aside>
    </div>
  )
}
