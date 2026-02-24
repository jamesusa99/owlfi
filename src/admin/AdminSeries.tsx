import { useState, useEffect } from 'react'
import type { AdminCourseSeries } from '../lib/adminDb'
import { fetchCourseSeries, saveCourseSeries, deleteCourseSeries } from '../lib/adminDb'
import { getErrorMessage } from './utils'
import { FormLabel } from './AdminFormLabel'
import AdminConfirmModal from './AdminConfirmModal'

const emptySeries = (): AdminCourseSeries => ({
  id: 0,
  title: '',
  desc: '',
  sortOrder: 0,
})

export default function AdminSeries() {
  const [list, setList] = useState<AdminCourseSeries[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<AdminCourseSeries>(emptySeries())
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchCourseSeries()
      setList(data)
    } catch (e) {
      setError(getErrorMessage(e, '加载失败'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const openNew = () => {
    setForm(emptySeries())
    setShowForm(true)
  }
  const openEdit = (s: AdminCourseSeries) => {
    setForm({ ...s })
    setShowForm(true)
  }
  const handleSave = async () => {
    if (!(form.title || '').trim()) {
      setError('请填写系列名称')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await saveCourseSeries(form)
      setShowForm(false)
      await load()
    } catch (e) {
      setError(getErrorMessage(e, '保存失败'))
    } finally {
      setSaving(false)
    }
  }
  const handleDelete = async (id: number) => {
    try {
      await deleteCourseSeries(id)
      setList((prev) => prev.filter((x) => x.id !== id))
      setDeleteId(null)
    } catch (e) {
      setError(getErrorMessage(e, '删除失败'))
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-[#1a2b3c]">系列课</h1>
        <button onClick={openNew} className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm font-medium">
          + 添加系列
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
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d]">系列名称</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d]">排序</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d] w-28">操作</th>
              </tr>
            </thead>
            <tbody>
              {list.map((s) => (
                <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-[#1a2b3c]">{s.title}</td>
                  <td className="px-4 py-3 text-sm text-[#6b7c8d]">{s.sortOrder}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => openEdit(s)} className="text-[#1e3a5f] text-sm mr-2">编辑</button>
                    <button onClick={() => setDeleteId(s.id)} className="text-red-600 text-sm">删除</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="font-bold text-[#1a2b3c] mb-4">{form.id ? '编辑系列' : '添加系列'}</h3>
            <div className="space-y-3">
              <div>
                <FormLabel label="系列名称" required />
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <FormLabel label="封面链接" required={false} hint="16:9 图片" />
                <input
                  type="url"
                  value={form.coverUrl ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, coverUrl: e.target.value.trim() || null }))}
                  className="w-full px-4 py-2 border rounded-lg font-mono text-sm"
                />
              </div>
              <div>
                <FormLabel label="简介" required={false} />
                <textarea
                  value={form.desc}
                  onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg min-h-[60px]"
                />
              </div>
              <div>
                <FormLabel label="排序" required={false} />
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) || 0 }))}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm">保存</button>
              <button onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg text-sm">取消</button>
            </div>
          </div>
        </div>
      )}

      {deleteId !== null && (
        <AdminConfirmModal
          title="确定删除该系列？其下课程将保留，系列归属会清空。"
          onConfirm={() => handleDelete(deleteId)}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  )
}
