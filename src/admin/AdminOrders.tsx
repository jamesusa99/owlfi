const orders = [
  { id: 'O202602230001', user: '138****1234', type: '申购', amount: 5000, status: '已完成', time: '2026-02-23 10:30' },
  { id: 'O202602230002', user: '139****5678', type: '赎回', amount: 3000, status: '处理中', time: '2026-02-23 11:15' },
  { id: 'O202602220003', user: '137****9012', type: '申购', amount: 10000, status: '已完成', time: '2026-02-22 14:20' },
]

export default function AdminOrders() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-[#1a2b3c] mb-6">订单管理</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f5f7fa] border-b border-gray-200">
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d]">订单号</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d]">用户</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d]">类型</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d]">金额(元)</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d]">状态</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d]">时间</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-[#1a2b3c] font-mono">{o.id}</td>
                  <td className="px-4 py-3 text-sm text-[#1a2b3c]">{o.user}</td>
                  <td className="px-4 py-3 text-sm text-[#1a2b3c]">{o.type}</td>
                  <td className="px-4 py-3 text-sm text-[#1a2b3c]">{o.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs ${o.status === '已完成' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#6b7c8d]">{o.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
