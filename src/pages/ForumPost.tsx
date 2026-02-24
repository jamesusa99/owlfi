import { useParams } from 'react-router-dom'

const postData: Record<string, { title: string; author: string; content: string; time: string; likes: number; replies: number }> = {
  '1': {
    title: '如何看待当前市场震荡？我的几点思考',
    author: '稳健投资',
    time: '2小时前',
    likes: 256,
    replies: 128,
    content: '近期市场波动加大，很多朋友在问如何看待。我个人有几点思考分享：\n\n1. 短期波动是常态，不必过度焦虑\n2. 优质资产长期来看总会回归价值\n3. 保持定投节奏，越跌越买\n4. 控制仓位，留有余地\n\n以上仅为个人观点，不构成投资建议。欢迎大家在评论区交流。',
  },
  '2': {
    title: '定投三年收益分享，附实盘记录',
    author: '长期主义者',
    time: '5小时前',
    likes: 312,
    replies: 89,
    content: '从2021年开始定投至今，累计收益约18%。虽然过程中有过回撤，但坚持下来效果不错。\n\n我的策略：每月定投2000元，选择3只不同风格的基金分散配置。市场下跌时适当加大投入。\n\n定投的核心是纪律，不因短期波动而放弃。',
  },
  '3': {
    title: '新手如何选择第一只基金？',
    author: '小白理财',
    time: '1天前',
    likes: 98,
    replies: 45,
    content: '作为刚入市的新手，建议从以下几点考虑：\n\n1. 先做风险测评，了解自己的风险承受能力\n2. 首选宽基指数基金，如沪深300、中证500\n3. 选择规模较大、历史业绩稳定的产品\n4. 用闲钱投资，不要影响生活\n\n欢迎前辈们补充建议！',
  },
  '4': {
    title: '行业轮动策略实操经验谈',
    author: '量化老王',
    time: '2天前',
    likes: 189,
    replies: 67,
    content: '行业轮动需要关注宏观经济周期和行业景气度。我的经验是：\n\n1. 关注PMI、社融等领先指标\n2. 跟踪各行业盈利增速变化\n3. 结合估值水平做决策\n4. 控制单行业仓位不超过30%\n\n轮动策略适合有一定经验的投资者，新手建议先打好基础。',
  },
}

const comments = [
  { id: 1, author: '路过的投资人', content: '说得很有道理，点赞', time: '1小时前', likes: 12 },
  { id: 2, author: '基金小白', content: '感谢分享，学习了', time: '50分钟前', likes: 8 },
]

export default function ForumPost() {
  const { id } = useParams<{ id: string }>()
  const post = id ? postData[id] : null

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center text-[var(--owl-text-muted)]">
        帖子不存在
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <article className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <h1 className="text-lg font-bold text-[var(--owl-text)] mb-4">{post.title}</h1>
        <div className="flex items-center gap-3 text-sm text-[var(--owl-text-muted)] mb-4">
          <span>{post.author}</span>
          <span>{post.time}</span>
        </div>
        <div className="text-[var(--owl-text)] leading-relaxed whitespace-pre-line mb-4">
          {post.content}
        </div>
        <div className="flex gap-6 text-sm text-[var(--owl-text-muted)]">
          <span>❤️ {post.likes}</span>
          <span>💬 {post.replies}</span>
        </div>
      </article>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="font-medium text-[var(--owl-text)] mb-4">评论</h3>
        <div className="space-y-4">
          {comments.map((c) => (
            <div key={c.id} className="py-3 border-b border-gray-100 last:border-0">
              <div className="flex justify-between">
                <span className="font-medium text-sm">{c.author}</span>
                <span className="text-xs text-[var(--owl-text-muted)]">{c.time}</span>
              </div>
              <p className="text-sm text-[var(--owl-text)] mt-1">{c.content}</p>
              <span className="text-xs text-[var(--owl-text-muted)] mt-1">❤️ {c.likes}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
