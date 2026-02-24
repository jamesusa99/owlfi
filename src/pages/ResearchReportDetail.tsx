import { useParams } from 'react-router-dom'

const reportContent: Record<string, { title: string; type: string; date: string; content: string }> = {
  '1': {
    title: '2026年Q1权益市场展望',
    type: '策略报告',
    date: '2026-02-20',
    content: '一、估值维度：当前A股整体估值处于历史中位偏下，具备一定安全边际。\n\n二、盈利维度：企业盈利有望在政策支持下边际改善。\n\n三、流动性：货币政策保持宽松取向，有利于风险资产。\n\n结论：建议均衡配置，关注估值修复与业绩确定性两条主线。',
  },
  '2': {
    title: '债券型基金配置策略研究',
    type: '深度研究',
    date: '2026-02-15',
    content: '在当前利率环境下，纯债基金仍是稳健型投资者重要配置选择。建议关注久期适中、信用资质优良的产品。可考虑短债+中长债的组合配置策略。',
  },
  '3': {
    title: 'ETF赛道投资机会分析',
    type: '行业研究',
    date: '2026-02-10',
    content: '科技ETF：关注人工智能、半导体产业链。\n消费ETF：估值回归后可逐步配置。\n医药ETF：创新药、医疗器械具长期价值。\n建议根据风险偏好分散配置。',
  },
  '4': {
    title: '基金经理风格画像方法论',
    type: '方法论',
    date: '2026-02-05',
    content: '通过持仓分析、净值归因、换手率等指标，可系统刻画基金经理的投资风格。建议关注风格稳定性与超额收益的可持续性。',
  },
}

export default function ResearchReportDetail() {
  const { id } = useParams<{ id: string }>()
  const report = id ? reportContent[id] : null

  if (!report) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center text-[var(--owl-text-muted)]">
        报告不存在
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <article className="bg-white rounded-2xl p-6 shadow-sm">
        <span className="inline-block px-2 py-0.5 bg-[var(--owl-primary)]/10 text-[var(--owl-primary)] text-xs rounded mb-2">
          {report.type}
        </span>
        <h1 className="text-xl font-bold text-[var(--owl-text)] mb-2">{report.title}</h1>
        <p className="text-sm text-[var(--owl-text-muted)] mb-6">{report.date}</p>
        <div className="text-[var(--owl-text)] leading-relaxed whitespace-pre-line">
          {report.content}
        </div>
      </article>
    </div>
  )
}
