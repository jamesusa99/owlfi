import { useNavigate } from 'react-router-dom'

const notifications = [
  { id: 1, title: '组合调仓提醒', content: '您的稳健增长组合已执行调仓', time: '2小时前', read: false },
  { id: 2, title: '收益周报', content: '本周收益 +128.50 元', time: '1天前', read: true },
  { id: 3, title: '系统通知', content: '平台将于今晚22:00进行维护', time: '2天前', read: true },
]

export default function ProfileNotifications() {
  const navigate = useNavigate()
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="font-medium text-[var(--owl-text)] mb-4">消息通知</h2>
      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => navigate(`/profile/notifications/${n.id}`)}
            className={`rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow ${n.read ? 'bg-white' : 'bg-[var(--owl-primary)]/5'}`}
          >
            <div className="flex justify-between">
              <p className="font-medium text-[var(--owl-text)]">{n.title}</p>
              {!n.read && <span className="w-2 h-2 rounded-full bg-[var(--owl-primary)]" />}
            </div>
            <p className="text-sm text-[var(--owl-text-muted)] mt-1">{n.content}</p>
            <p className="text-xs text-[var(--owl-text-muted)] mt-2">{n.time}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
