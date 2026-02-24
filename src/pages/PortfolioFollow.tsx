import { useNavigate } from 'react-router-dom'

const followPortfolios = [
  { id: 10, name: '稳健增长组合', rate: '+6.8%', risk: '中低', followers: 12580, desc: '股债均衡配置' },
  { id: 11, name: '价值精选组合', rate: '+8.2%', risk: '中', followers: 8920, desc: '优质蓝筹为主' },
  { id: 12, name: '成长进取组合', rate: '+12.5%', risk: '中高', followers: 6540, desc: '科技成长赛道' },
  { id: 13, name: '固收增强组合', rate: '+4.2%', risk: '低', followers: 15890, desc: '债券为主' },
]

export default function PortfolioFollow() {
  const navigate = useNavigate()

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <p className="text-[var(--owl-text-muted)] text-sm mb-6">
        选择专业投顾组合，一键跟投，省心省力
      </p>
      <div className="space-y-4">
        {followPortfolios.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-[var(--owl-text)]">{p.name}</h4>
                <p className="text-xs text-[var(--owl-text-muted)] mt-1">{p.desc} · {p.risk}风险</p>
                <p className="text-xs text-[var(--owl-text-muted)] mt-1">{p.followers.toLocaleString()} 人跟投</p>
              </div>
              <p className="text-lg font-bold text-green-600">{p.rate}</p>
            </div>
            <button
              onClick={() => navigate(`/portfolio/follow/${p.id}/confirm`)}
              className="mt-4 w-full py-2 bg-[var(--owl-accent)] text-white text-sm rounded-lg"
            >
              立即跟投
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
