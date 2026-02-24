import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ToolRiskAssessment() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState<Record<number, number>>({})

  const questions = [
    { id: 1, q: '您的投资经验是？', options: ['无经验', '1-3年', '3-5年', '5年以上'] },
    { id: 2, q: '您的投资目标？', options: ['保值', '稳健增值', '较高收益', '追求最大收益'] },
    { id: 3, q: '能接受的最大亏损比例？', options: ['不能接受', '10%以内', '10%-30%', '30%以上'] },
    { id: 4, q: '您的投资期限？', options: ['1年以内', '1-3年', '3-5年', '5年以上'] },
  ]

  const currentQ = questions[step - 1]
  const totalSteps = questions.length

  const handleSelect = (idx: number) => {
    setAnswers((prev) => ({ ...prev, [step]: idx }))
    if (step < totalSteps) setStep(step + 1)
  }

  const score = Object.values(answers).reduce((a, b) => a + b, 0)
  const result = score >= 12 ? '激进型' : score >= 8 ? '积极型' : score >= 4 ? '稳健型' : '保守型'

  if (step > totalSteps) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
          <h2 className="text-xl font-bold text-[var(--owl-primary)] mb-4">测评结果</h2>
          <p className="text-4xl font-bold text-[var(--owl-accent)] mb-2">{result}</p>
          <p className="text-[var(--owl-text-muted)] mb-6">
            根据您的回答，您的风险承受能力为{result}，建议选择与之匹配的投资产品。
          </p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => navigate('/portfolio/follow')}
              className="px-6 py-3 bg-[var(--owl-accent)] text-white rounded-lg font-medium"
            >
              查看匹配组合
            </button>
            <button
              onClick={() => { setStep(1); setAnswers({}) }}
              className="px-6 py-2 text-[var(--owl-text-muted)]"
            >
              重新测评
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex justify-between text-sm text-[var(--owl-text-muted)] mb-2">
          <span>第 {step} / {totalSteps} 题</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--owl-primary)] transition-all"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-medium text-[var(--owl-text)] mb-6">{currentQ?.q}</h3>
        <div className="space-y-3">
          {currentQ?.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`w-full py-4 px-4 rounded-xl border-2 text-left transition-colors ${
                answers[step] === idx
                  ? 'border-[var(--owl-primary)] bg-[var(--owl-primary)]/5'
                  : 'border-gray-200 hover:border-[var(--owl-primary)]/50'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
