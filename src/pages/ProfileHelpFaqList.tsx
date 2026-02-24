import { useNavigate } from 'react-router-dom'

const faqList = [
  { id: 1, q: '如何开户？' },
  { id: 2, q: '如何申购/赎回？' },
  { id: 3, q: '资金多久到账？' },
  { id: 4, q: '如何修改银行卡？' },
]

export default function ProfileHelpFaqList() {
  const navigate = useNavigate()

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="font-medium text-[var(--owl-text)] mb-4">常见问题</h2>
      <div className="space-y-2">
        {faqList.map((f) => (
          <div
            key={f.id}
            onClick={() => navigate(`/profile/help/faq/${f.id}`)}
            className="bg-white rounded-xl p-4 shadow-sm cursor-pointer flex justify-between items-center"
          >
            <span className="text-[var(--owl-text)]">{f.q}</span>
            <span className="text-[var(--owl-text-muted)]">›</span>
          </div>
        ))}
      </div>
    </div>
  )
}
