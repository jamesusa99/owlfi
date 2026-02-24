import { useParams, useNavigate } from 'react-router-dom'

const notiDetail: Record<string, { title: string; content: string; time: string; fullContent: string }> = {
  '1': {
    title: '组合调仓提醒',
    content: '您的稳健增长组合已执行调仓',
    time: '2小时前',
    fullContent: '您的稳健增长组合已根据最新市场情况进行调仓，具体调整包括：华夏回报混合A减持2%，中欧时代先锋增持2%。调仓已于今日完成，您可在组合详情中查看最新持仓。',
  },
  '2': {
    title: '收益周报',
    content: '本周收益 +128.50 元',
    time: '1天前',
    fullContent: '尊敬的投资者，您的账户本周收益为 +128.50 元，周收益率 +0.12%。主要收益来自稳健增长组合的持仓增长。感谢您的信任与支持。',
  },
  '3': {
    title: '系统通知',
    content: '平台将于今晚22:00进行维护',
    time: '2天前',
    fullContent: '为提升服务质量，平台将于今晚22:00-24:00进行系统维护升级。维护期间部分功能可能暂时不可用，请您提前做好安排。感谢您的理解与支持。',
  },
}

export default function NotificationDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const noti = id ? notiDetail[id] : null

  if (!noti) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center text-[var(--owl-text-muted)]">
        通知不存在
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h1 className="text-lg font-bold text-[var(--owl-text)]">{noti.title}</h1>
        <p className="text-sm text-[var(--owl-text-muted)] mt-2">{noti.time}</p>
        <div className="mt-6 text-[var(--owl-text)] leading-relaxed whitespace-pre-line">
          {noti.fullContent}
        </div>
        {id === '1' && (
          <button
            onClick={() => navigate('/portfolio/1')}
            className="mt-4 w-full py-2 border border-[var(--owl-primary)] text-[var(--owl-primary)] rounded-xl text-sm"
          >
            查看组合详情
          </button>
        )}
      </div>
    </div>
  )
}
