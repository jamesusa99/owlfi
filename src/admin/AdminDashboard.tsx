import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { fetchOrders } from '../lib/adminDb'

const statPaths = [
  { label: '注册用户', key: 'admin_users', path: '/admin/users', color: 'bg-blue-500' },
  { label: '课程总数', key: 'courses', path: '/admin/courses', color: 'bg-green-500' },
  { label: '资讯文章', key: 'news', path: '/admin/news', color: 'bg-amber-500' },
  { label: '订单', key: 'orders', path: '/admin/orders', color: 'bg-purple-500' },
  { label: '论坛帖子', key: 'forum_posts', path: '/admin/forum', color: 'bg-rose-500' },
]

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<Record<string, number>>({})
  const [recentOrders, setRecentOrders] = useState<{ id: string; user: string; amount: number; time: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [dbConnected, setDbConnected] = useState<boolean | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setDbConnected(null)
      try {
        const [usersRes, coursesRes, newsRes, ordersRes, forumRes] = await Promise.all([
          supabase.from('admin_users').select('id', { count: 'exact', head: true }),
          supabase.from('courses').select('id', { count: 'exact', head: true }),
          supabase.from('news').select('id', { count: 'exact', head: true }),
          supabase.from('orders').select('id', { count: 'exact', head: true }),
          supabase.from('forum_posts').select('id', { count: 'exact', head: true }),
        ])
        if (cancelled) return
        setDbConnected(true)
        setStats({
          admin_users: usersRes.count ?? 0,
          courses: coursesRes.count ?? 0,
          news: newsRes.count ?? 0,
          orders: ordersRes.count ?? 0,
          forum_posts: forumRes.count ?? 0,
        })

        const orders = await fetchOrders()
        if (cancelled) return
        setRecentOrders(
          orders.slice(0, 5).map((o) => ({
            id: o.id,
            user: o.user,
            amount: o.amount,
            time: o.time,
          }))
        )
      } catch {
        if (!cancelled) setDbConnected(false)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-[#1a2b3c]">控制台</h1>
        {dbConnected === true && (
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">数据库已连接</span>
        )}
        {dbConnected === false && (
          <span className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full">数据库未连接（请检查 .env）</span>
        )}
      </div>

      {loading ? (
        <div className="py-12 text-center text-[#6b7c8d]">加载中...</div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {statPaths.map((s) => (
              <div
                key={s.path}
                onClick={() => navigate(s.path)}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className={`w-10 h-10 rounded-lg ${s.color} opacity-20 mb-3`} />
                <p className="text-2xl font-bold text-[#1a2b3c]">{stats[s.key] ?? 0}</p>
                <p className="text-sm text-[#6b7c8d]">{s.label}</p>
              </div>
            ))}
          </div>
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
                {recentOrders.length === 0 ? (
                  <p className="text-sm text-[#6b7c8d]">暂无订单</p>
                ) : (
                  recentOrders.map((o) => (
                    <div
                      key={o.id}
                      onClick={() => navigate('/admin/orders')}
                      className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50 -mx-2 px-2 rounded"
                    >
                      <div>
                        <p className="text-sm font-medium text-[#1a2b3c]">{o.id}</p>
                        <p className="text-xs text-[#6b7c8d]">{o.user} · {o.time}</p>
                      </div>
                      <span className="text-sm font-medium text-green-600">¥{o.amount.toLocaleString()}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
