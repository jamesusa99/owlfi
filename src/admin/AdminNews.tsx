const newsList = [
  { id: 1, title: 'A股市场震荡整理，关注结构性机会', status: '已发布', time: '2026-02-23' },
  { id: 2, title: '央行维持利率不变，流动性充裕', status: '已发布', time: '2026-02-22' },
  { id: 3, title: '基金行业监管新规即将落地', status: '草稿', time: '2026-02-21' },
]

export default function AdminNews() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-[#1a2b3c] mb-6">资讯管理</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f5f7fa] border-b border-gray-200">
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d]">ID</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d]">标题</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d]">状态</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d]">发布时间</th>
              </tr>
            </thead>
            <tbody>
              {newsList.map((n) => (
                <tr key={n.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-[#1a2b3c]">{n.id}</td>
                  <td className="px-4 py-3 text-sm text-[#1a2b3c]">{n.title}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs ${n.status === '已发布' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {n.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#6b7c8d]">{n.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
