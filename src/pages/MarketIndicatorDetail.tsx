import { useParams } from 'react-router-dom'

const indicatorDetail: Record<string, { name: string; value: string; status: string; desc: string; content: string }> = {
  '股债利差': {
    name: '股债利差',
    value: '4.40%',
    status: '较好',
    desc: '股票收益与债券收益的差值',
    content: '股债利差=1/沪深300PE-10年期国债收益率。利差越高，说明股票相对债券越便宜，权益资产性价比越高。当前4.40%处于历史较高分位，股票资产具备配置价值。',
  },
  '市场温度': {
    name: '市场温度',
    value: '66.12°C',
    status: '偏热',
    desc: '衡量市场情绪与估值热度',
    content: '市场温度综合估值、交易量、换手率等指标计算。0-30°C为偏冷，30-70°C为中性，70°C以上为偏热。当前66.12°C接近偏热区间，建议控制仓位，避免追涨。',
  },
  '估值分位': {
    name: '估值分位',
    value: '45%',
    status: '中性',
    desc: '当前估值在历史区间的相对位置',
    content: '估值分位表示当前PE/PB在历史数据中的百分位。低于30%为低估，30%-70%为中性，高于70%为高估。45%处于中性区间，可采取定投或分批建仓策略。',
  },
}

export default function MarketIndicatorDetail() {
  const { name } = useParams<{ name: string }>()
  const decoded = name ? decodeURIComponent(name) : ''
  const detail = decoded ? indicatorDetail[decoded] : null

  if (!detail) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center text-[var(--owl-text-muted)]">
        指标不存在
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h1 className="text-xl font-bold text-[var(--owl-text)] mb-2">{detail.name}</h1>
        <p className="text-3xl font-bold text-[var(--owl-primary)] mb-2">{detail.value}</p>
        <p className="text-sm text-[var(--owl-text-muted)] mb-4">{detail.desc}</p>
        <p className="text-[var(--owl-text)] leading-relaxed">{detail.content}</p>
      </div>
    </div>
  )
}
