import { useParams } from 'react-router-dom'

const orderDetail: Record<string, { type: string; name: string; amount: number; time: string; status: string; orderNo: string }> = {
  '1': { type: '申购', name: '稳健增长组合', amount: 1000, time: '2024-02-20 10:30:25', status: '已确认', orderNo: 'SO202402200001' },
  '2': { type: '赎回', name: '价值精选', amount: 500, time: '2024-02-18 14:20:18', status: '已到账', orderNo: 'RO202402180002' },
  '3': { type: '定投', name: '成长进取', amount: 500, time: '2024-02-15 09:00:05', status: '已确认', orderNo: 'SIP202402150003' },
}

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>()
  const order = id ? orderDetail[id] : null

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center text-[var(--owl-text-muted)]">
        订单不存在
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="text-center py-4">
          <p className="text-2xl font-bold text-[var(--owl-primary)]">{order.type} ¥{order.amount}</p>
          <p className="text-sm text-green-600 mt-2">{order.status}</p>
        </div>
        <div className="border-t border-gray-100 pt-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-[var(--owl-text-muted)]">产品名称</span>
            <span>{order.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--owl-text-muted)]">订单编号</span>
            <span className="font-mono text-sm">{order.orderNo}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--owl-text-muted)]">交易时间</span>
            <span>{order.time}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--owl-text-muted)]">交易金额</span>
            <span>{order.type === '赎回' ? '+' : '-'}¥{order.amount}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
