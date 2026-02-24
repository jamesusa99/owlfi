import { useState } from 'react'

export default function ProfileSettingsNotification() {
  const [orderNotify, setOrderNotify] = useState(true)
  const [profitNotify, setProfitNotify] = useState(true)
  const [marketNotify, setMarketNotify] = useState(false)

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {[
          { label: '交易通知', desc: '申购、赎回等交易提醒', value: orderNotify, set: setOrderNotify },
          { label: '收益提醒', desc: '每日/每周收益报告', value: profitNotify, set: setProfitNotify },
          { label: '市场资讯', desc: '重要市场动态推送', value: marketNotify, set: setMarketNotify },
        ].map((item) => (
          <div key={item.label} className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
            <div>
              <p className="font-medium text-[var(--owl-text)]">{item.label}</p>
              <p className="text-sm text-[var(--owl-text-muted)]">{item.desc}</p>
            </div>
            <button
              onClick={() => item.set(!item.value)}
              className={`w-12 h-7 rounded-full transition-colors ${item.value ? 'bg-[var(--owl-primary)]' : 'bg-gray-200'}`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white shadow m-1 transition-transform ${item.value ? 'translate-x-5' : 'translate-x-0'}`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
