import { useParams, useNavigate } from 'react-router-dom'

const lessons = [
  { id: 1, title: '什么是基金？', content: '基金，全称证券投资基金，是指通过发售基金份额，将众多投资者的资金集中起来，形成独立财产，由基金托管人托管，基金管理人管理，以投资组合的方式进行证券投资的一种利益共享、风险共担的集合投资方式。\n\n简单来说，基金就是把大家的钱凑在一起，交给专业的基金经理去投资股票、债券等，赚到的钱按出资比例分给大家。' },
  { id: 2, title: '基金的类型与特点', content: '按投资对象可分为股票型、债券型、混合型、货币型等。股票型基金风险较高但潜在收益也高；债券型相对稳健；货币型流动性好、风险低。投资者应根据自身情况选择合适的基金类型。' },
  { id: 3, title: '如何选择适合自己的基金', content: '选择基金时需考虑：1.风险承受能力；2.投资期限；3.基金经理历史业绩；4.基金规模与费率。建议分散投资，不要把所有资金押在一只基金上。' },
  { id: 4, title: '定投策略入门', content: '定期定额投资可以有效平滑市场波动，避免择时困难。定投的核心是"纪律"——坚持长期投入，在市场低位时买入更多份额，从而摊薄成本。' },
  { id: 5, title: '常见投资误区', content: '误区一：追涨杀跌；误区二：频繁交易；误区三：只看短期业绩；误区四：忽视费用。理性投资，长期持有，是获得稳健收益的关键。' },
]

export default function CourseLearn() {
  const { id, lessonId } = useParams<{ id: string; lessonId: string }>()
  const navigate = useNavigate()
  const currentLesson = lessonId ? lessons.find((l) => l.id === Number(lessonId)) : lessons[0]
  const currentIndex = currentLesson ? lessons.findIndex((l) => l.id === currentLesson.id) : 0

  const goPrev = () => {
    if (currentIndex > 0) {
      navigate(`/classroom/course/${id}/learn/${lessons[currentIndex - 1].id}`)
    }
  }

  const goNext = () => {
    if (currentIndex < lessons.length - 1) {
      navigate(`/classroom/course/${id}/learn/${lessons[currentIndex + 1].id}`)
    } else {
      navigate(`/classroom/course/${id}`)
    }
  }

  const lesson = currentLesson || lessons[0]

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="mb-4 flex items-center gap-2 text-sm text-[var(--owl-text-muted)]">
        <span>第 {currentIndex + 1} / {lessons.length} 节</span>
      </div>
      <div className="aspect-video bg-[var(--owl-primary)] rounded-2xl flex items-center justify-center text-white text-6xl mb-6">
        ▶
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="font-medium text-[var(--owl-text)] mb-4">第{lesson.id}章：{lesson.title}</h2>
        <div className="text-[var(--owl-text-muted)] leading-relaxed whitespace-pre-line">
          {lesson.content}
        </div>
      </div>
      <div className="mt-6 flex gap-4">
        <button
          onClick={goPrev}
          disabled={currentIndex === 0}
          className="flex-1 py-3 bg-gray-100 text-[var(--owl-text)] rounded-xl disabled:opacity-50"
        >
          上一节
        </button>
        <button onClick={goNext} className="flex-1 py-3 bg-[var(--owl-primary)] text-white rounded-xl">
          {currentIndex === lessons.length - 1 ? '完成学习' : '下一节'}
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
