import { useState, useEffect } from 'react'
import type { AdminUser } from '../lib/adminDb'
import { fetchUsers, saveUser, deleteUser, generateUserId } from '../lib/adminDb'
import { getErrorMessage } from './utils'
import { FormLabel } from './AdminFormLabel'

interface UserFormProps {
  user: AdminUser | null
  users: AdminUser[]
  onSave: (u: AdminUser) => void
  onCancel: () => void
  onSelectExistingUser?: (u: AdminUser) => void
  onValidationError?: (msg: string) => void
}

function UserForm({ user, users, onSave, onCancel, onSelectExistingUser, onValidationError }: UserFormProps) {
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
    if (!(form.id || '').trim()) {
      onValidationError?.('请填写或选择用户ID（必填）')
      return
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(form.regTime || '')) {
      onValidationError?.('请选择正确的注册时间，格式：年-月-日')
      return
    }
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
            <FormLabel label="用户ID" required hint="格式如 U1A2B3C4，不可与已有用户重复" />
            {isEdit ? (
              <input
                type="text"
                value={form.id}
                onChange={(e) => setForm({ ...form, id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                placeholder="如 U1A2B3C4"
              />
            ) : (
              <>
                <select
                  value={users.some((u) => u.id === form.id) ? form.id : '_new_'}
                  onChange={(e) => {
                    const v = e.target.value
                    if (v === '_new_') {
                      setForm((f) => ({ ...f, id: f.id || generateUserId() }))
                    } else {
                      const existing = users.find((u) => u.id === v)
                      if (existing && onSelectExistingUser) onSelectExistingUser(existing)
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                >
                  <option value="_new_">新建用户（手动输入 ID）</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.id} - {u.nickname}
                    </option>
                  ))}
                </select>
                {!users.some((u) => u.id === form.id) && (
                  <input
                    type="text"
                    value={form.id}
                    onChange={(e) => setForm({ ...form, id: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg mt-2"
                    placeholder="输入新用户 ID，如 U1A2B3C4"
                  />
                )}
              </>
            )}
          </div>
          <div>
            <FormLabel label="手机号" required={false} hint="选填，如 138****1234" />
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              placeholder="138****1234"
            />
          </div>
          <div>
            <FormLabel label="昵称" required={false} hint="选填，前端显示用" />
            <input
              type="text"
              value={form.nickname}
              onChange={(e) => setForm({ ...form, nickname: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              placeholder="用户昵称"
            />
          </div>
          <div>
            <FormLabel label="注册时间" required hint="格式：年-月-日（YYYY-MM-DD）" />
            <input
              type="date"
              value={form.regTime}
              onChange={(e) => setForm({ ...form, regTime: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            />
          </div>
          <div>
            <FormLabel label="订单数" required={false} hint="数字，选填" />
            <input
              type="number"
              min={0}
              value={form.orders}
              onChange={(e) => setForm({ ...form, orders: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            />
          </div>
          <div>
            <FormLabel label="状态" required={false} hint="正常 或 禁用" />
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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [formUser, setFormUser] = useState<AdminUser | null | 'add'>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchUsers()
      setUsers(data)
    } catch (e) {
      setError(getErrorMessage(e, '加载失败'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleSave = async (u: AdminUser) => {
    setSaving(true)
    setError(null)
    try {
      await saveUser(u)
      setFormUser(null)
      await load()
    } catch (e) {
      setError(getErrorMessage(e, '保存失败'))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id)
      setUsers((prev) => prev.filter((x) => x.id !== id))
      setDeleteId(null)
    } catch (e) {
      setError(getErrorMessage(e, '删除失败'))
    }
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
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}
      {loading ? (
        <div className="py-12 text-center text-[#6b7c8d]">加载中...</div>
      ) : (
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
      )}

      {formUser && formUser !== 'add' && (
        <UserForm user={formUser} users={users} onSave={handleSave} onCancel={() => setFormUser(null)} onValidationError={setError} />
      )}
      {formUser === 'add' && (
        <UserForm user={null} users={users} onSave={handleSave} onCancel={() => setFormUser(null)} onSelectExistingUser={(u) => setFormUser(u)} onValidationError={setError} />
      )}
      {saving && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl px-6 py-4">保存中...</div>
        </div>
      )}

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
