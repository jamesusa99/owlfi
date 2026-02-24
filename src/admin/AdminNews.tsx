import { useState, useEffect } from 'react'
import type { AdminNews } from '../lib/adminDb'
import { fetchNews, saveNewsItem, deleteNews } from '../lib/adminDb'
import { getErrorMessage } from './utils'
import { FormLabel } from './AdminFormLabel'
import AdminConfirmModal from './AdminConfirmModal'

function NewsForm({
  news,
  onSave,
  onCancel,
  onValidationError,
}: {
  news: AdminNews | null
  onSave: (n: AdminNews) => void
  onCancel: () => void
  onValidationError: (msg: string) => void
}) {
  const isEdit = !!news
  const [form, setForm] = useState<AdminNews>(
    news ?? { id: 0, title: '', summary: '', status: '草稿', publishTime: new Date().toISOString().slice(0, 10) }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const t = (form.title || '').trim()
    if (!t) {
      onValidationError('请填写标题（必填）')
      return
    }
    if (!form.publishTime || !/^\d{4}-\d{2}-\d{2}$/.test(form.publishTime)) {
      onValidationError('请选择正确的发布时间，格式：年-月-日')
      return
    }
    onSave(form)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-bold text-[#1a2b3c]">{isEdit ? '编辑资讯' : '添加资讯'}</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <FormLabel label="ID" required={false} hint="添加时留空由系统生成；编辑时不可改" />
            <input type="number" value={form.id || ''} onChange={(e) => setForm({ ...form, id: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" placeholder="新增可不填" />
          </div>
          <div>
            <FormLabel label="标题" required hint="任意文字，不能为空" />
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" placeholder="请输入资讯标题" />
          </div>
          <div>
            <FormLabel label="摘要" required={false} hint="选填，用于列表或详情摘要" />
            <textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg min-h-[80px]" placeholder="选填" />
          </div>
          <div>
            <FormLabel label="状态" required={false} hint="已发布：前端可见；草稿：仅后台可见" />
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as AdminNews['status'] })} className="w-full px-4 py-2 border border-gray-200 rounded-lg">
              <option value="已发布">已发布</option>
              <option value="草稿">草稿</option>
            </select>
          </div>
          <div>
            <FormLabel label="发布时间" required hint="格式：年-月-日（YYYY-MM-DD）" />
            <input type="date" value={form.publishTime} onChange={(e) => setForm({ ...form, publishTime: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="submit" className="flex-1 py-2 bg-[#1e3a5f] text-white rounded-lg font-medium">保存</button>
            <button type="button" onClick={onCancel} className="flex-1 py-2 border border-gray-200 rounded-lg text-[#6b7c8d]">取消</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminNews() {
  const [list, setList] = useState<AdminNews[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [formItem, setFormItem] = useState<AdminNews | null | 'add'>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchNews()
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

  const handleSave = async (n: AdminNews) => {
    setSaving(true)
    setError(null)
    try {
      await saveNewsItem(n)
      setFormItem(null)
      await load()
    } catch (e) {
      setError(getErrorMessage(e, '保存失败'))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteNews(id)
      setList((prev) => prev.filter((x) => x.id !== id))
      setDeleteId(null)
    } catch (e) {
      setError(getErrorMessage(e, '删除失败'))
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-[#1a2b3c]">资讯管理</h1>
        <button onClick={() => setFormItem('add')} className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm font-medium">
          + 添加资讯
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
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d]">ID</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d]">标题</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d]">状态</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d]">发布时间</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d] w-28">操作</th>
              </tr>
            </thead>
            <tbody>
              {list.map((n) => (
                <tr key={n.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-[#1a2b3c]">{n.id}</td>
                  <td className="px-4 py-3 text-sm text-[#1a2b3c]">{n.title}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs ${n.status === '已发布' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{n.status}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#6b7c8d]">{n.publishTime}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => setFormItem(n)} className="text-[#1e3a5f] text-sm mr-2 hover:underline">编辑</button>
                    <button onClick={() => setDeleteId(n.id)} className="text-red-600 text-sm hover:underline">删除</button>
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
      {formItem && formItem !== 'add' && <NewsForm news={formItem} onSave={handleSave} onCancel={() => setFormItem(null)} onValidationError={setError} />}
      {formItem === 'add' && <NewsForm news={null} onSave={handleSave} onCancel={() => setFormItem(null)} onValidationError={setError} />}
      {deleteId !== null && (
        <AdminConfirmModal title="确定要删除该资讯吗？此操作不可恢复。" onConfirm={() => handleDelete(deleteId)} onCancel={() => setDeleteId(null)} />
      )}
    </div>
  )
}
