import { useState, useEffect } from 'react'
import type { AdminOrder, AdminUser } from '../lib/adminDb'
import { fetchOrders, saveOrder, deleteOrder, generateOrderId, fetchUsers } from '../lib/adminDb'
import { getErrorMessage } from './utils'
import { FormLabel } from './AdminFormLabel'
import AdminConfirmModal from './AdminConfirmModal'

function OrderForm({
  order,
  users,
  onSave,
  onCancel,
  onValidationError,
}: {
  order: AdminOrder | null
  users: AdminUser[]
  onSave: (o: AdminOrder) => void
  onCancel: () => void
  onValidationError: (msg: string) => void
}) {
  const isEdit = !!order
  const [form, setForm] = useState<AdminOrder>(
    order ?? {
      id: generateOrderId(),
      user: '',
      type: '申购',
      amount: 0,
      status: '处理中',
      time: new Date().toISOString().slice(0, 16).replace('T', ' '),
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!(form.user || '').trim()) {
      onValidationError('请选择或填写用户（必填）')
      return
    }
    if (Number(form.amount) < 0) {
      onValidationError('金额不能为负数')
      return
    }
    onSave(form)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-bold text-[#1a2b3c]">{isEdit ? '编辑订单' : '添加订单'}</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <FormLabel label="订单号" required hint="格式如 O202602240001，留空则自动生成" />
            <input
              type="text"
              value={form.id}
              onChange={(e) => setForm({ ...form, id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg font-mono"
              placeholder="留空自动生成"
            />
          </div>
          <div>
            <FormLabel label="用户" required hint="从下拉选择已有用户，或选「其他」后手动输入显示名" />
            <select
              value={
                users.some((u) => u.nickname === form.user)
                  ? form.user
                  : form.user
                    ? '_other_'
                    : ''
              }
              onChange={(e) => {
                const v = e.target.value
                setForm({ ...form, user: v === '_other_' ? '' : v })
              }}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            >
              <option value="">请选择用户</option>
              {users.map((u) => (
                <option key={u.id} value={u.nickname}>
                  {u.nickname} ({u.id})
                </option>
              ))}
              <option value="_other_">其他（手动输入）</option>
            </select>
            {!users.some((u) => u.nickname === form.user) && (
              <input
                type="text"
                value={form.user}
                onChange={(e) => setForm({ ...form, user: e.target.value })}
                placeholder="输入用户显示名"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg mt-2"
              />
            )}
          </div>
          <div>
            <FormLabel label="类型" required={false} hint="申购 或 赎回" />
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as AdminOrder['type'] })} className="w-full px-4 py-2 border border-gray-200 rounded-lg">
              <option value="申购">申购</option>
              <option value="赎回">赎回</option>
            </select>
          </div>
          <div>
            <FormLabel label="金额(元)" required={false} hint="数字，不能为负" />
            <input
              type="number"
              min={0}
              value={form.amount || ''}
              onChange={(e) => setForm({ ...form, amount: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              placeholder="0"
            />
          </div>
          <div>
            <FormLabel label="状态" required={false} hint="已完成 / 处理中 / 已取消" />
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as AdminOrder['status'] })} className="w-full px-4 py-2 border border-gray-200 rounded-lg">
              <option value="已完成">已完成</option>
              <option value="处理中">处理中</option>
              <option value="已取消">已取消</option>
            </select>
          </div>
          <div>
            <FormLabel label="时间" required hint="格式：年-月-日 时:分，不填则用当前时间" />
            <input
              type="datetime-local"
              value={(form.time || '').replace(' ', 'T').slice(0, 16)}
              onChange={(e) => setForm({ ...form, time: e.target.value.replace('T', ' ') })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            />
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

export default function AdminOrders() {
  const [list, setList] = useState<AdminOrder[]>([])
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [formItem, setFormItem] = useState<AdminOrder | null | 'add'>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const [ordersData, usersData] = await Promise.all([fetchOrders(), fetchUsers()])
      setList(ordersData)
      setUsers(usersData)
    } catch (e) {
      setError(getErrorMessage(e, '加载失败'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleSave = async (o: AdminOrder) => {
    setSaving(true)
    setError(null)
    try {
      await saveOrder(o)
      setFormItem(null)
      await load()
    } catch (e) {
      setError(getErrorMessage(e, '保存失败'))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteOrder(id)
      setList((prev) => prev.filter((x) => x.id !== id))
      setDeleteId(null)
    } catch (e) {
      setError(getErrorMessage(e, '删除失败'))
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-[#1a2b3c]">订单管理</h1>
        <button onClick={() => setFormItem('add')} className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm font-medium">
          + 添加订单
        </button>
      </div>
      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
      {loading ? (
        <div className="py-12 text-center text-[#6b7c8d]">加载中...</div>
      ) : (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#f5f7fa] border-b border-gray-200">
              <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d]">订单号</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d]">用户</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d]">类型</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d]">金额(元)</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d]">状态</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d]">时间</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d] w-28">操作</th>
            </tr>
          </thead>
          <tbody>
            {list.map((o) => (
              <tr key={o.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-[#1a2b3c] font-mono">{o.id}</td>
                <td className="px-4 py-3 text-sm text-[#1a2b3c]">{o.user}</td>
                <td className="px-4 py-3 text-sm text-[#1a2b3c]">{o.type}</td>
                <td className="px-4 py-3 text-sm text-[#1a2b3c]">{o.amount.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 rounded text-xs ${
                      o.status === '已完成' ? 'bg-green-100 text-green-700' : o.status === '处理中' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {o.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-[#6b7c8d]">{o.time}</td>
                <td className="px-4 py-3">
                  <button onClick={() => setFormItem(o)} className="text-[#1e3a5f] text-sm mr-2 hover:underline">编辑</button>
                  <button onClick={() => setDeleteId(o.id)} className="text-red-600 text-sm hover:underline">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
      {saving && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl px-6 py-4">保存中...</div>
        </div>
      )}
      {formItem && formItem !== 'add' && <OrderForm order={formItem} users={users} onSave={handleSave} onCancel={() => setFormItem(null)} onValidationError={setError} />}
      {formItem === 'add' && <OrderForm order={null} users={users} onSave={handleSave} onCancel={() => setFormItem(null)} onValidationError={setError} />}
      {deleteId && (
        <AdminConfirmModal
          title="确定要删除该订单吗？此操作不可恢复。"
          onConfirm={() => handleDelete(deleteId)}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  )
}
