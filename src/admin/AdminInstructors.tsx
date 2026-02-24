import { useState, useEffect } from 'react'
import type { AdminInstructor } from '../lib/adminDb'
import { fetchInstructors, saveInstructor, deleteInstructor } from '../lib/adminDb'
import { getErrorMessage } from './utils'
import { FormLabel } from './AdminFormLabel'
import AdminConfirmModal from './AdminConfirmModal'

const emptyInstructor = (): AdminInstructor => ({
  id: 0,
  name: '',
  title: '',
  bio: '',
  sortOrder: 0,
})

export default function AdminInstructors() {
  const [list, setList] = useState<AdminInstructor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<AdminInstructor>(emptyInstructor())
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchInstructors()
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
    setForm(emptyInstructor())
    setShowForm(true)
  }
  const openEdit = (inst: AdminInstructor) => {
    setForm({ ...inst })
    setShowForm(true)
  }
  const handleSave = async () => {
    if (!(form.name || '').trim()) {
      setError('请填写讲师姓名')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await saveInstructor(form)
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
      await deleteInstructor(id)
      setList((prev) => prev.filter((x) => x.id !== id))
      setDeleteId(null)
    } catch (e) {
      setError(getErrorMessage(e, '删除失败'))
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-[#1a2b3c]">讲师库</h1>
        <button onClick={openNew} className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm font-medium">
          + 添加讲师
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
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d]">姓名</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d]">头衔</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d]">排序</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d] w-28">操作</th>
              </tr>
            </thead>
            <tbody>
              {list.map((i) => (
                <tr key={i.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-[#1a2b3c]">{i.name}</td>
                  <td className="px-4 py-3 text-sm text-[#6b7c8d]">{i.title}</td>
                  <td className="px-4 py-3 text-sm text-[#6b7c8d]">{i.sortOrder}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => openEdit(i)} className="text-[#1e3a5f] text-sm mr-2">编辑</button>
                    <button onClick={() => setDeleteId(i.id)} className="text-red-600 text-sm">删除</button>
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
            <h3 className="font-bold text-[#1a2b3c] mb-4">{form.id ? '编辑讲师' : '添加讲师'}</h3>
            <div className="space-y-3">
              <div>
                <FormLabel label="姓名" required />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <FormLabel label="头衔" required={false} hint="如：首席策略师" />
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <FormLabel label="头像链接" required={false} />
                <input
                  type="url"
                  value={form.avatarUrl ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, avatarUrl: e.target.value.trim() || null }))}
                  className="w-full px-4 py-2 border rounded-lg font-mono text-sm"
                />
              </div>
              <div>
                <FormLabel label="简介" required={false} />
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg min-h-[80px]"
                />
              </div>
              <div>
                <FormLabel label="排序" required={false} hint="数字越小越靠前" />
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
          title="确定删除该讲师？关联课程将保留，讲师显示为空。"
          onConfirm={() => handleDelete(deleteId)}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  )
}
