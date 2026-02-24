import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ToolAssetConfig() {
  const navigate = useNavigate()
  const [riskType, setRiskType] = useState<string>('steady')

  const configs: Record<string, { stock: number; bond: number; cash: number; other: number }> = {
    conservative: { stock: 20, bond: 50, cash: 25, other: 5 },
    steady: { stock: 40, bond: 40, cash: 15, other: 5 },
    aggressive: { stock: 70, bond: 20, cash: 5, other: 5 },
  }

  const current = configs[riskType] || configs.steady
  const labels = [
    { key: 'stock', label: '权益类', color: '#1e3a5f' },
    { key: 'bond', label: '固收类', color: '#2d5a87' },
    { key: 'cash', label: '现金类', color: '#d4a84b' },
    { key: 'other', label: '其他', color: '#6b7c8d' },
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <h3 className="font-medium text-[var(--owl-text)] mb-4">选择风险偏好</h3>
        <div className="space-y-2">
          {[
            { id: 'conservative', name: '保守型', desc: '追求稳健，可接受较低收益' },
            { id: 'steady', name: '稳健型', desc: '平衡收益与风险' },
            { id: 'aggressive', name: '积极型', desc: '追求较高收益，可承受波动' },
          ].map((item) => (
            <div
              key={item.id}
              onClick={() => setRiskType(item.id)}
              className={`p-4 rounded-xl border-2 cursor-pointer ${
                riskType === item.id ? 'border-[var(--owl-primary)] bg-[var(--owl-primary)]/5' : 'border-gray-200'
              }`}
            >
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-[var(--owl-text-muted)]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="font-medium text-[var(--owl-text)] mb-4">建议配置比例</h3>
        <div className="space-y-3">
          {labels.map((l) => (
            <div key={l.key}>
              <div className="flex justify-between text-sm mb-1">
                <span>{l.label}</span>
                <span>{(current as Record<string, number>)[l.key]}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${(current as Record<string, number>)[l.key]}%`, backgroundColor: l.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={() => navigate('/portfolio/follow')}
        className="mt-6 w-full py-3 bg-[var(--owl-primary)] text-white rounded-xl"
      >
        查看推荐组合
      </button>
    </div>
  )
}
