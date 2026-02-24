import { useParams, useNavigate } from 'react-router-dom'

const fundResults: Record<string, { name: string; score: number; summary: string; items: { label: string; value: string; status: string }[] }> = {
  '005827': {
    name: '易方达蓝筹精选',
    score: 85,
    summary: '综合评分良好，长期业绩稳健，适合中长期持有。建议关注规模变化及基金经理持仓风格。',
    items: [
      { label: '历史业绩', value: '优秀', status: 'green' },
      { label: '波动控制', value: '良好', status: 'green' },
      { label: '规模变化', value: '稳定', status: 'blue' },
      { label: '费率水平', value: '适中', status: 'blue' },
    ],
  },
  '002001': {
    name: '华夏回报混合A',
    score: 82,
    summary: '偏稳健型产品，分红策略明确，适合追求稳健收益的投资者。',
    items: [
      { label: '历史业绩', value: '良好', status: 'green' },
      { label: '波动控制', value: '优秀', status: 'green' },
      { label: '分红能力', value: '较强', status: 'green' },
      { label: '费率水平', value: '适中', status: 'blue' },
    ],
  },
  '001938': {
    name: '中欧时代先锋',
    score: 88,
    summary: '成长风格明显，弹性较大，适合能承受波动的投资者。',
    items: [
      { label: '历史业绩', value: '优秀', status: 'green' },
      { label: '波动控制', value: '中等', status: 'orange' },
      { label: '风格稳定性', value: '良好', status: 'green' },
      { label: '费率水平', value: '适中', status: 'blue' },
    ],
  },
}

export default function FundDiagnosisResult() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const result = code ? fundResults[code] : null

  if (!result) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <p className="text-[var(--owl-text-muted)] mb-4">暂无该基金诊断数据</p>
        <button onClick={() => navigate('/research/diagnosis')} className="text-[var(--owl-primary)]">
          返回诊断
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <h2 className="font-bold text-[var(--owl-text)] mb-2">{result.name} 诊断报告</h2>
        <p className="text-sm text-[var(--owl-text-muted)] mb-4">基金代码 {code}</p>
        <div className="text-center py-4">
          <p className="text-4xl font-bold text-[var(--owl-primary)]">{result.score}</p>
          <p className="text-sm text-[var(--owl-text-muted)]">综合评分</p>
        </div>
        <p className="text-sm text-[var(--owl-text)] leading-relaxed mt-4">{result.summary}</p>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <h3 className="font-medium text-[var(--owl-text)] mb-4">细分维度</h3>
        <div className="space-y-3">
          {result.items.map((item) => (
            <div key={item.label} className="flex justify-between items-center py-2">
              <span className="text-[var(--owl-text-muted)]">{item.label}</span>
              <span className={`font-medium ${
                item.status === 'green' ? 'text-green-600' :
                item.status === 'orange' ? 'text-orange-500' : 'text-blue-600'
              }`}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={() => navigate(`/fund/${code}`)}
        className="w-full py-3 bg-[var(--owl-primary)] text-white rounded-xl"
      >
        查看基金详情
      </button>
      <button
        onClick={() => navigate('/research/diagnosis')}
        className="w-full mt-3 py-2 text-[var(--owl-text-muted)]"
      >
        诊断其他基金
      </button>
    </div>
  )
}
