import { useParams, useNavigate } from 'react-router-dom'

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
        <div className="aspect-video bg-gradient-to-br from-[var(--owl-primary)] to-[var(--owl-secondary)] flex items-center justify-center text-6xl">
          📖
        </div>
        <div className="p-5">
          <span className="inline-block px-2 py-0.5 bg-[var(--owl-accent)]/20 text-[var(--owl-accent)] text-xs rounded mb-2">
            入门
          </span>
          <h1 className="text-xl font-bold text-[var(--owl-text)] mb-2">
            基金投资入门：从零开始学理财
          </h1>
          <p className="text-sm text-[var(--owl-text-muted)]">视频 · 15分钟</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
        <h3 className="font-medium text-[var(--owl-text)] mb-4">课程简介</h3>
        <p className="text-[var(--owl-text-muted)] text-sm leading-relaxed">
          本课程面向零基础投资者，系统讲解基金投资的基本概念、类型划分、选购方法以及常见误区。
          通过通俗易懂的案例，帮助您建立正确的投资理念，迈出理财第一步。
        </p>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="font-medium text-[var(--owl-text)] mb-4">目录</h3>
        <div className="space-y-3">
          {[
            { idx: 1, title: '什么是基金？' },
            { idx: 2, title: '基金的类型与特点' },
            { idx: 3, title: '如何选择适合自己的基金' },
            { idx: 4, title: '定投策略入门' },
            { idx: 5, title: '常见投资误区' },
          ].map((item) => (
            <div
              key={item.idx}
              onClick={() => id && navigate(`/classroom/course/${id}/learn/${item.idx}`)}
              className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-50 rounded-lg -mx-2 px-2"
            >
              <span className="w-6 h-6 rounded-full bg-[var(--owl-primary)]/10 text-[var(--owl-primary)] text-sm flex items-center justify-center flex-shrink-0">
                {item.idx}
              </span>
              <span className="text-[var(--owl-text)]">{item.idx}. {item.title}</span>
              <span className="ml-auto text-[var(--owl-text-muted)]">›</span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => id && navigate(`/classroom/course/${id}/learn/1`)}
        className="w-full mt-6 py-4 bg-[var(--owl-primary)] text-white font-medium rounded-xl"
      >
        开始学习
      </button>
    </div>
  )
}
