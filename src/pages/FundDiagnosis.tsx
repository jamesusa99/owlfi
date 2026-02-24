import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function FundDiagnosis() {
  const navigate = useNavigate()
  const [fundCode, setFundCode] = useState('')

  const handleDiagnose = () => {
    if (fundCode.trim()) {
      navigate(`/research/diagnosis/result/${fundCode}`)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <h2 className="font-bold text-[var(--owl-text)] mb-2">基金诊断</h2>
        <p className="text-sm text-[var(--owl-text-muted)] mb-4">输入基金代码，获取专业诊断报告</p>
        <input
          type="text"
          value={fundCode}
          onChange={(e) => setFundCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="请输入6位基金代码"
          className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-4"
        />
        <button
          onClick={handleDiagnose}
          disabled={fundCode.length < 6}
          className="w-full py-3 bg-[var(--owl-primary)] text-white rounded-xl disabled:opacity-50"
        >
          开始诊断
        </button>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="font-medium text-[var(--owl-text)] mb-4">快速诊断</h3>
        {[
          { code: '005827', name: '易方达蓝筹精选' },
          { code: '002001', name: '华夏回报混合A' },
          { code: '001938', name: '中欧时代先锋' },
        ].map((f) => (
          <div
            key={f.code}
            onClick={() => navigate(`/research/diagnosis/result/${f.code}`)}
            className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50"
          >
            <span className="font-medium">{f.name}</span>
            <span className="text-[var(--owl-text-muted)] text-sm">{f.code}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
