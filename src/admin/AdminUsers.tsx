import { useState, useEffect } from 'react'
import type { AdminUser } from './adminUsersData'
import { getAdminUsers, saveAdminUsers, generateUserId } from './adminUsersData'

interface UserFormProps {
  user: AdminUser | null
  onSave: (u: AdminUser) => void
  onCancel: () => void
}

function UserForm({ user, onSave, onCancel }: UserFormProps) {
  const isEdit = !!user
  const [form, setForm] = useState<AdminUser>(
    user ?? {
      id: generateUserId(),
      phone: '',
      nickname: '',
      regTime: new Date().toISOString().slice(0, 10),
      orders: 0,
      status: '正常',
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(form)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-bold text-[#1a2b3c]">{isEdit ? '编辑用户' : '添加用户'}</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#6b7c8d] mb-1">用户ID</label>
            <input
              type="text"
              value={form.id}
              onChange={(e) => setForm({ ...form, id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              placeholder="如 U1A2B3C4"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6b7c8d] mb-1">手机号</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              placeholder="138****1234"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6b7c8d] mb-1">昵称</label>
            <input
              type="text"
              value={form.nickname}
              onChange={(e) => setForm({ ...form, nickname: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              placeholder="用户昵称"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6b7c8d] mb-1">注册时间</label>
            <input
              type="date"
              value={form.regTime}
              onChange={(e) => setForm({ ...form, regTime: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6b7c8d] mb-1">订单数</label>
            <input
              type="number"
              min={0}
              value={form.orders}
              onChange={(e) => setForm({ ...form, orders: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6b7c8d] mb-1">状态</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as AdminUser['status'] })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            >
              <option value="正常">正常</option>
              <option value="禁用">禁用</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="submit" className="flex-1 py-2 bg-[#1e3a5f] text-white rounded-lg font-medium">
              保存
            </button>
            <button type="button" onClick={onCancel} className="flex-1 py-2 border border-gray-200 rounded-lg text-[#6b7c8d]">
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [formUser, setFormUser] = useState<AdminUser | null | 'add'>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    setUsers(getAdminUsers())
  }, [])

  const handleSave = (u: AdminUser) => {
    if (formUser === 'add') {
      const next = [...users, u]
      setUsers(next)
      saveAdminUsers(next)
    } else if (formUser) {
      const next = users.map((x) => (x.id === u.id ? u : x))
      setUsers(next)
      saveAdminUsers(next)
    }
    setFormUser(null)
  }

  const handleDelete = (id: string) => {
    const next = users.filter((x) => x.id !== id)
    setUsers(next)
    saveAdminUsers(next)
    setDeleteId(null)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-[#1a2b3c]">用户管理</h1>
        <button
          onClick={() => setFormUser('add')}
          className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm font-medium"
        >
          + 添加用户
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f5f7fa] border-b border-gray-200">
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d]">用户ID</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d]">手机号</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d]">昵称</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d]">注册时间</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d]">订单数</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d]">状态</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d] w-24">操作</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-[#1a2b3c] font-mono">{u.id}</td>
                  <td className="px-4 py-3 text-sm text-[#1a2b3c]">{u.phone}</td>
                  <td className="px-4 py-3 text-sm text-[#1a2b3c]">{u.nickname}</td>
                  <td className="px-4 py-3 text-sm text-[#6b7c8d]">{u.regTime}</td>
                  <td className="px-4 py-3 text-sm text-[#1a2b3c]">{u.orders}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${
                        u.status === '正常' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setFormUser(u)}
                        className="text-[#1e3a5f] text-sm hover:underline"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => setDeleteId(u.id)}
                        className="text-red-600 text-sm hover:underline"
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 添加/编辑弹窗 */}
      {formUser && formUser !== 'add' && (
        <UserForm user={formUser} onSave={handleSave} onCancel={() => setFormUser(null)} />
      )}
      {formUser === 'add' && (
        <UserForm user={null} onSave={handleSave} onCancel={() => setFormUser(null)} />
      )}

      {/* 删除确认弹窗 */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
            <p className="text-[#1a2b3c] font-medium mb-4">确定要删除该用户吗？此操作不可恢复。</p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg"
              >
                确认删除
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2 border border-gray-200 rounded-lg text-[#6b7c8d]"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
