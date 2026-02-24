import { useNavigate } from 'react-router-dom'

const orders = [
  { id: 1, type: '申购', name: '稳健增长组合', amount: 1000, time: '2024-02-20 10:30', status: '已确认' },
  { id: 2, type: '赎回', name: '价值精选', amount: 500, time: '2024-02-18 14:20', status: '已到账' },
  { id: 3, type: '定投', name: '成长进取', amount: 500, time: '2024-02-15 09:00', status: '已确认' },
]

export default function ProfileOrders() {
  const navigate = useNavigate()
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="font-medium text-[var(--owl-text)] mb-4">我的订单</h2>
      <div className="space-y-3">
        {orders.map((o) => (
          <div
            key={o.id}
            onClick={() => navigate(`/profile/orders/${o.id}`)}
            className="bg-white rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between">
              <div>
                <p className="font-medium text-[var(--owl-text)]">{o.type} - {o.name}</p>
                <p className="text-xs text-[var(--owl-text-muted)]">{o.time}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{o.type === '赎回' ? '+' : '-'}¥{o.amount}</p>
                <p className="text-xs text-green-600">{o.status}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
