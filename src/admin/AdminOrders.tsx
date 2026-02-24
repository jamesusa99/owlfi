import { useState, useEffect } from 'react'
import type { AdminOrder } from '../lib/adminDb'
import { fetchOrders, saveOrder, deleteOrder, generateOrderId } from '../lib/adminDb'
import AdminConfirmModal from './AdminConfirmModal'

function OrderForm({
  order,
  onSave,
  onCancel,
}: {
  order: AdminOrder | null
  onSave: (o: AdminOrder) => void
  onCancel: () => void
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-bold text-[#1a2b3c]">{isEdit ? '编辑订单' : '添加订单'}</h3>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            onSave(form)
          }}
          className="p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-[#6b7c8d] mb-1">订单号</label>
            <input
              type="text"
              value={form.id}
              onChange={(e) => setForm({ ...form, id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg font-mono"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6b7c8d] mb-1">用户</label>
            <input
              type="text"
              value={form.user}
              onChange={(e) => setForm({ ...form, user: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              placeholder="138****1234"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6b7c8d] mb-1">类型</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as AdminOrder['type'] })} className="w-full px-4 py-2 border border-gray-200 rounded-lg">
              <option value="申购">申购</option>
              <option value="赎回">赎回</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6b7c8d] mb-1">金额(元)</label>
            <input
              type="number"
              min={0}
              value={form.amount || ''}
              onChange={(e) => setForm({ ...form, amount: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6b7c8d] mb-1">状态</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as AdminOrder['status'] })} className="w-full px-4 py-2 border border-gray-200 rounded-lg">
              <option value="已完成">已完成</option>
              <option value="处理中">处理中</option>
              <option value="已取消">已取消</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6b7c8d] mb-1">时间</label>
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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [formItem, setFormItem] = useState<AdminOrder | null | 'add'>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchOrders()
      setList(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : '加载失败')
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
      setError(e instanceof Error ? e.message : '保存失败')
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
      setError(e instanceof Error ? e.message : '删除失败')
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
      {formItem && formItem !== 'add' && <OrderForm order={formItem} onSave={handleSave} onCancel={() => setFormItem(null)} />}
      {formItem === 'add' && <OrderForm order={null} onSave={handleSave} onCancel={() => setFormItem(null)} />}
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
