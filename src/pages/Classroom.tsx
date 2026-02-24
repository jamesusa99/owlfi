import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { courses } from '../data/courses'

export default function Classroom() {
  const navigate = useNavigate()
  const [selectedCat, setSelectedCat] = useState('全部')
  const filteredCourses = selectedCat === '全部'
    ? courses
    : courses.filter((c) => c.tag === selectedCat || c.type === selectedCat)

  const categories = ['全部', '入门', '进阶', '高级', '视频', '图文']

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* 分类标签 */}
      <section className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
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

      {/* 课程列表 */}
      <section className="space-y-4">
        <h3 className="font-medium text-[var(--owl-text)]">精选课程</h3>
        {filteredCourses.map((course) => (
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
            <div className="flex items-center">
              <span className="text-[var(--owl-primary)] text-2xl">›</span>
            </div>
          </div>
        ))}
      </section>

      {/* 热门话题 */}
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
