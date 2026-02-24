import { useNavigate } from 'react-router-dom'

const funds = [
  { code: '005827', name: '易方达蓝筹精选', rate1y: 8.5, rate3y: 45.2, rate5y: 98.3, risk: '中高' },
  { code: '002001', name: '华夏回报混合A', rate1y: 5.2, rate3y: 28.6, rate5y: 62.1, risk: '中' },
  { code: '001938', name: '中欧时代先锋', rate1y: 12.8, rate3y: 55.3, rate5y: 125.6, risk: '高' },
]

export default function ToolFundCompare() {
  const navigate = useNavigate()
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--owl-bg)]">
                <th className="px-4 py-3 text-left font-medium text-[var(--owl-text)]">基金</th>
                <th className="px-4 py-3 text-right font-medium text-[var(--owl-text)]">近1年</th>
                <th className="px-4 py-3 text-right font-medium text-[var(--owl-text)]">近3年</th>
                <th className="px-4 py-3 text-right font-medium text-[var(--owl-text)]">近5年</th>
                <th className="px-4 py-3 text-center font-medium text-[var(--owl-text)]">风险</th>
              </tr>
            </thead>
            <tbody>
              {funds.map((f) => (
                <tr
                  key={f.code}
                  onClick={() => navigate(`/fund/${f.code}`)}
                  className="border-t border-gray-100 cursor-pointer hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-[var(--owl-text)]">{f.name}</p>
                    <p className="text-xs text-[var(--owl-text-muted)]">{f.code}</p>
                  </td>
                  <td className={`px-4 py-3 text-right font-medium ${f.rate1y >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {f.rate1y >= 0 ? '+' : ''}{f.rate1y}%
                  </td>
                  <td className={`px-4 py-3 text-right font-medium ${f.rate3y >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {f.rate3y >= 0 ? '+' : ''}{f.rate3y}%
                  </td>
                  <td className={`px-4 py-3 text-right font-medium ${f.rate5y >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {f.rate5y >= 0 ? '+' : ''}{f.rate5y}%
                  </td>
                  <td className="px-4 py-3 text-center text-[var(--owl-text-muted)]">{f.risk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-xs text-[var(--owl-text-muted)] mt-4">数据仅供参考，投资需谨慎</p>
    </div>
  )
}
