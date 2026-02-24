import { useNavigate } from 'react-router-dom'

const reports = [
  { id: 1, title: '2026年Q1权益市场展望', type: '策略报告', date: '2026-02-20', summary: '从估值、盈利、流动性三维度展望' },
  { id: 2, title: '债券型基金配置策略研究', type: '深度研究', date: '2026-02-15', summary: '利率环境下的债券配置建议' },
  { id: 3, title: 'ETF赛道投资机会分析', type: '行业研究', date: '2026-02-10', summary: '科技、消费、医药ETF对比' },
  { id: 4, title: '基金经理风格画像方法论', type: '方法论', date: '2026-02-05', summary: '如何科学评估基金经理' },
]

export default function ResearchReports() {
  const navigate = useNavigate()

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="font-bold text-[var(--owl-text)] mb-4">深度调研</h2>
      <div className="space-y-4">
        {reports.map((r) => (
          <div
            key={r.id}
            onClick={() => navigate(`/research/reports/${r.id}`)}
            className="bg-white rounded-2xl p-5 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
          >
            <span className="inline-block px-2 py-0.5 bg-[var(--owl-primary)]/10 text-[var(--owl-primary)] text-xs rounded mb-2">
              {r.type}
            </span>
            <h3 className="font-medium text-[var(--owl-text)] mb-1">{r.title}</h3>
            <p className="text-sm text-[var(--owl-text-muted)] mb-2">{r.summary}</p>
            <p className="text-xs text-[var(--owl-text-muted)]">{r.date}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
