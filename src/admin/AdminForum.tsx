const posts = [
  { id: 1, title: '关于定投策略的讨论', author: '用户****1234', replies: 12, status: '正常', time: '2026-02-23' },
  { id: 2, title: '基金选择心得分享', author: '用户****5678', replies: 8, status: '正常', time: '2026-02-22' },
  { id: 3, title: '市场波动下的应对策略', author: '用户****9012', replies: 25, status: '置顶', time: '2026-02-21' },
]

export default function AdminForum() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-[#1a2b3c] mb-6">论坛管理</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f5f7fa] border-b border-gray-200">
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d]">ID</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d]">标题</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d]">作者</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d]">回复</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d]">状态</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d]">发布时间</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-[#1a2b3c]">{p.id}</td>
                  <td className="px-4 py-3 text-sm text-[#1a2b3c]">{p.title}</td>
                  <td className="px-4 py-3 text-sm text-[#6b7c8d]">{p.author}</td>
                  <td className="px-4 py-3 text-sm text-[#1a2b3c]">{p.replies}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs ${p.status === '置顶' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#6b7c8d]">{p.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
