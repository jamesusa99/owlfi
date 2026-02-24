import { useNavigate } from 'react-router-dom'

const stats = [
  { label: '注册用户', value: '12,580', path: '/admin/users', color: 'bg-blue-500' },
  { label: '课程总数', value: '6', path: '/admin/courses', color: 'bg-green-500' },
  { label: '资讯文章', value: '128', path: '/admin/news', color: 'bg-amber-500' },
  { label: '今日订单', value: '36', path: '/admin/orders', color: 'bg-purple-500' },
  { label: '论坛帖子', value: '892', path: '/admin/forum', color: 'bg-rose-500' },
]

const recentOrders = [
  { id: 'O202602230001', user: '用户****1234', amount: '5,000', time: '10分钟前' },
  { id: 'O202602230002', user: '用户****5678', amount: '10,000', time: '25分钟前' },
  { id: 'O202602230003', user: '用户****9012', amount: '3,000', time: '1小时前' },
]

export default function AdminDashboard() {
  const navigate = useNavigate()

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-[#1a2b3c] mb-6">控制台</h1>
      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {stats.map((s) => (
          <div
            key={s.path}
            onClick={() => navigate(s.path)}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className={`w-10 h-10 rounded-lg ${s.color} opacity-20 mb-3`} />
            <p className="text-2xl font-bold text-[#1a2b3c]">{s.value}</p>
            <p className="text-sm text-[#6b7c8d]">{s.label}</p>
          </div>
        ))}
      </div>
      {/* 快捷操作 */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-medium text-[#1a2b3c] mb-4">快捷操作</h3>
          <div className="space-y-2">
            {[
              { label: '发布新资讯', path: '/admin/news' },
              { label: '添加课程', path: '/admin/courses' },
              { label: '系统公告', path: '/admin/settings' },
            ].map((a) => (
              <button
                key={a.path}
                onClick={() => navigate(a.path)}
                className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 text-[#1a2b3c] text-sm"
              >
                {a.label} ›
              </button>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-medium text-[#1a2b3c] mb-4">最近订单</h3>
          <div className="space-y-3">
            {recentOrders.map((o) => (
              <div
                key={o.id}
                onClick={() => navigate('/admin/orders')}
                className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50 -mx-2 px-2 rounded"
              >
                <div>
                  <p className="text-sm font-medium text-[#1a2b3c]">{o.id}</p>
                  <p className="text-xs text-[#6b7c8d]">{o.user} · {o.time}</p>
                </div>
                <span className="text-sm font-medium text-green-600">¥{o.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
