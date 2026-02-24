import { useNavigate } from 'react-router-dom'

const faqList = [
  { id: 1, q: '如何开户？', path: '/profile/help/faq/1' },
  { id: 2, q: '如何申购/赎回？', path: '/profile/help/faq/2' },
  { id: 3, q: '资金多久到账？', path: '/profile/help/faq/3' },
  { id: 4, q: '如何修改银行卡？', path: '/profile/help/faq/4' },
]

const helpMenus = [
  { icon: '📞', label: '联系客服', path: '/profile/support' },
  { icon: '📋', label: '常见问题', path: '/profile/help/faq' },
  { icon: 'ℹ️', label: '关于我们', path: '/profile/help/about' },
]

export default function ProfileHelp() {
  const navigate = useNavigate()

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="font-medium text-[var(--owl-text)] mb-4">帮助中心</h2>
      <div className="space-y-3 mb-8">
        {helpMenus.map((m) => (
          <div
            key={m.path}
            onClick={() => navigate(m.path)}
            className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3 cursor-pointer"
          >
            <span className="text-2xl">{m.icon}</span>
            <span className="font-medium text-[var(--owl-text)]">{m.label}</span>
            <span className="ml-auto text-[var(--owl-text-muted)]">›</span>
          </div>
        ))}
      </div>

      <h3 className="font-medium text-[var(--owl-text)] mb-3">常见问题</h3>
      <div className="space-y-2">
        {faqList.map((f) => (
          <div
            key={f.id}
            onClick={() => navigate(f.path)}
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
