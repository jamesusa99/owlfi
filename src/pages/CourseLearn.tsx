import { useParams, useNavigate } from 'react-router-dom'
import { getCourse, getLesson } from '../data/courses'
import VideoPlayer from '../components/VideoPlayer'

export default function CourseLearn() {
  const { id, lessonId } = useParams<{ id: string; lessonId: string }>()
  const navigate = useNavigate()
  const courseId = id ? Number(id) : 0
  const course = getCourse(courseId)
  const lessonNum = lessonId ? Number(lessonId) : 1
  const lesson = course ? getLesson(courseId, lessonNum) : null
  const lessons = course?.lessons || []
  const currentIndex = lessons.findIndex((l) => l.id === lessonNum)
  const safeIndex = currentIndex >= 0 ? currentIndex : 0

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

  const currentLesson = lesson || lessons[0]

  if (!course) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center text-[var(--owl-text-muted)]">
        课程不存在
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="mb-4 flex items-center gap-2 text-sm text-[var(--owl-text-muted)]">
        <span>第 {safeIndex + 1} / {lessons.length} 节</span>
      </div>

      {/* 视频播放器 - 有 videoBvid 时显示 B 站嵌入 */}
      {currentLesson?.videoBvid ? (
        <VideoPlayer bvid={currentLesson.videoBvid} className="mb-6" />
      ) : (
        <div className="aspect-video bg-[var(--owl-primary)] rounded-2xl flex items-center justify-center text-white text-6xl mb-6">
          ▶
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="font-medium text-[var(--owl-text)] mb-4">
          第{currentLesson?.id}章：{currentLesson?.title}
        </h2>
        <div className="text-[var(--owl-text-muted)] leading-relaxed whitespace-pre-line">
          {currentLesson?.content}
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={goPrev}
          disabled={safeIndex === 0}
          className="flex-1 py-3 bg-gray-100 text-[var(--owl-text)] rounded-xl disabled:opacity-50"
        >
          上一节
        </button>
        <button onClick={goNext} className="flex-1 py-3 bg-[var(--owl-primary)] text-white rounded-xl">
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
  )
}
