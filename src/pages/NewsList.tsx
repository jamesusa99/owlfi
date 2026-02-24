import { useNavigate } from 'react-router-dom'

const newsList = [
  { id: 1, title: 'A股市场震荡整理，关注结构性机会', time: '2小时前', summary: '近期市场波动加大...' },
  { id: 2, title: '央行维持利率不变，流动性充裕', time: '5小时前', summary: '央行发布最新货币政策...' },
  { id: 3, title: '基金行业监管新规即将落地', time: '1天前', summary: '证监会相关负责人表示...' },
  { id: 4, title: '权益基金发行回暖，多只爆款再现', time: '2天前', summary: '近期多只权益类基金...' },
  { id: 5, title: '北向资金本周净流入超百亿', time: '3天前', summary: '数据显示北向资金...' },
]

export default function NewsList() {
  const navigate = useNavigate()

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="font-medium text-[var(--owl-text)] mb-4">市场资讯</h2>
      <div className="space-y-3">
        {newsList.map((news) => (
          <div
            key={news.id}
            onClick={() => navigate(`/news/${news.id}`)}
            className="bg-white rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
          >
            <p className="font-medium text-[var(--owl-text)]">{news.title}</p>
            <p className="text-xs text-[var(--owl-text-muted)] mt-1">{news.time}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
