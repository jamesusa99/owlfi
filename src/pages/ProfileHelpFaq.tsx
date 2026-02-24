import { useParams } from 'react-router-dom'

const faqContent: Record<string, { q: string; a: string }> = {
  '1': { q: '如何开户？', a: '下载APP后，点击"立即开户"，按提示完成身份验证和银行卡绑定即可。开户过程约需5分钟。' },
  '2': { q: '如何申购/赎回？', a: '在"组合"页面选择您的组合，点击"申购"或"赎回"按钮，输入金额并确认即可。交易一般在T+1日确认。' },
  '3': { q: '资金多久到账？', a: '赎回资金一般在T+1日确认后，1-3个工作日到达您的银行卡。具体以银行为准。' },
  '4': { q: '如何修改银行卡？', a: '进入"我的"-"银行卡管理"，可添加或删除银行卡。如需修改默认卡，请先添加新卡后再删除旧卡。' },
}

export default function ProfileHelpFaq() {
  const { id } = useParams<{ id: string }>()
  const faq = id ? faqContent[id] : null

  if (!faq) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center text-[var(--owl-text-muted)]">
        内容不存在
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="font-medium text-[var(--owl-text)] mb-4">{faq.q}</h3>
        <p className="text-[var(--owl-text-muted)] leading-relaxed">{faq.a}</p>
      </div>
    </div>
  )
}
