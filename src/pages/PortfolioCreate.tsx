import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const templates = [
  { id: 'steady', name: '稳健增长', desc: '股债均衡，适合稳健型投资者' },
  { id: 'value', name: '价值精选', desc: '优质蓝筹，长期持有' },
  { id: 'growth', name: '成长进取', desc: '科技成长，弹性较大' },
]

export default function PortfolioCreate() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [template, setTemplate] = useState<string | null>(null)
  const [amount, setAmount] = useState('')
  const [name, setName] = useState('')

  const handleSubmit = () => {
    if (step === 1) setStep(2)
    else if (step === 2) setStep(3)
    else navigate('/portfolio')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <div className="flex gap-2 mb-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded ${s <= step ? 'bg-[var(--owl-primary)]' : 'bg-gray-200'}`}
            />
          ))}
        </div>
        <p className="text-sm text-[var(--owl-text-muted)]">步骤 {step} / 3</p>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <h3 className="font-medium text-[var(--owl-text)]">选择组合模板</h3>
          {templates.map((t) => (
            <div
              key={t.id}
              onClick={() => setTemplate(t.id)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                template === t.id ? 'border-[var(--owl-primary)] bg-[var(--owl-primary)]/5' : 'border-gray-200'
              }`}
            >
              <p className="font-medium">{t.name}</p>
              <p className="text-sm text-[var(--owl-text-muted)]">{t.desc}</p>
            </div>
          ))}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h3 className="font-medium text-[var(--owl-text)]">设置初始投入金额</h3>
          <input
            type="number"
            placeholder="请输入金额（元）"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl"
          />
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h3 className="font-medium text-[var(--owl-text)]">为组合命名</h3>
          <input
            type="text"
            placeholder="我的组合"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl"
          />
        </div>
      )}

      <div className="mt-8 flex gap-4">
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="flex-1 py-3 bg-gray-100 text-[var(--owl-text)] rounded-xl"
          >
            上一步
          </button>
        )}
        <button
          onClick={handleSubmit}
          disabled={step === 1 && !template}
          className={`flex-1 py-3 bg-[var(--owl-primary)] text-white rounded-xl disabled:opacity-50 ${step === 1 ? '' : ''}`}
        >
          {step === 3 ? '完成创建' : '下一步'}
        </button>
      </div>
    </div>
  )
}
