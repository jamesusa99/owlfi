const users = [
  { id: 'U1A2B3C4', phone: '138****1234', regTime: '2026-02-20', orders: 3 },
  { id: 'U5D6E7F8', phone: '139****5678', regTime: '2026-02-19', orders: 8 },
  { id: 'U9G0H1I2', phone: '137****9012', regTime: '2026-02-18', orders: 1 },
]

export default function AdminUsers() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-[#1a2b3c] mb-6">用户管理</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f5f7fa] border-b border-gray-200">
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d]">用户ID</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d]">手机号</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d]">注册时间</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d]">订单数</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-[#1a2b3c]">{u.id}</td>
                  <td className="px-4 py-3 text-sm text-[#1a2b3c]">{u.phone}</td>
                  <td className="px-4 py-3 text-sm text-[#6b7c8d]">{u.regTime}</td>
                  <td className="px-4 py-3 text-sm text-[#1a2b3c]">{u.orders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
