import { useParams, useNavigate } from 'react-router-dom'

const newsContent: Record<string, { title: string; time: string; content: string }> = {
  '1': {
    title: 'A股市场震荡整理，关注结构性机会',
    time: '2小时前',
    content: '近期市场波动加大，A股三大指数震荡整理。机构普遍认为，当前市场处于估值合理区间，结构性机会值得关注。建议投资者保持理性，关注业绩确定性较高的行业龙头，同时注意控制仓位和风险。\n\n从行业配置角度看，科技、消费、医药等板块仍具有长期投资价值。投资者可根据自身风险承受能力，适度参与定投或分批建仓。',
  },
  '2': {
    title: '央行维持利率不变，流动性充裕',
    time: '5小时前',
    content: '央行今日开展公开市场操作，维持政策利率不变。市场人士认为，当前流动性保持合理充裕，有利于资本市场平稳运行。\n\n分析师指出，稳健的货币政策取向未变，预计未来一段时间资金面将保持平稳。对债券型基金和货币基金投资者而言，可关注收益率变化，做好资产配置调整。',
  },
  '3': {
    title: '基金行业监管新规即将落地',
    time: '1天前',
    content: '证监会相关负责人表示，基金行业监管新规已完成征求意见，即将正式发布。新规将进一步规范基金销售行为，保护投资者合法权益。\n\n业内人士认为，新规实施后，基金行业将更加规范透明，有利于行业长期健康发展。投资者应选择合规持牌机构进行投资。',
  },
  '4': {
    title: '权益基金发行回暖，多只爆款再现',
    time: '2天前',
    content: '近期权益类基金发行市场出现回暖迹象，多只新产品募集规模超预期。市场情绪改善背景下，投资者信心有所恢复。\n\n专家建议，投资者参与新基金申购时，应充分了解产品特点和基金经理历史业绩，理性做出投资决策。',
  },
  '5': {
    title: '北向资金本周净流入超百亿',
    time: '3天前',
    content: '数据显示，北向资金本周净流入超百亿元，连续多日呈现净买入态势。外资持续看好A股中长期投资价值。\n\n从流入板块看，消费、医药、科技等板块获北向资金青睐。投资者可关注北向资金动向，作为投资参考之一。',
  },
}

const relatedNews = [
  { id: 2, title: '央行维持利率不变，流动性充裕' },
  { id: 4, title: '权益基金发行回暖，多只爆款再现' },
]

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const news = id ? newsContent[id] : null

  if (!news) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center text-[var(--owl-text-muted)]">
        资讯不存在
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <article className="bg-white rounded-2xl p-6 shadow-sm">
        <h1 className="text-xl font-bold text-[var(--owl-text)] mb-2">{news.title}</h1>
        <p className="text-sm text-[var(--owl-text-muted)] mb-6">{news.time}</p>
        <div className="text-[var(--owl-text)] leading-relaxed whitespace-pre-line">
          {news.content}
        </div>
      </article>
      <div className="mt-6">
        <h3 className="font-medium text-[var(--owl-text)] mb-3">相关推荐</h3>
        <div className="space-y-2">
          {relatedNews.filter((n) => n.id !== Number(id)).slice(0, 2).map((n) => (
            <div
              key={n.id}
              onClick={() => navigate(`/news/${n.id}`)}
              className="bg-white rounded-xl p-3 shadow-sm cursor-pointer hover:shadow-md"
            >
              <p className="text-sm text-[var(--owl-text)]">{n.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
