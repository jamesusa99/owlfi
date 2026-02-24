import { useState, useEffect } from 'react'
import type { AdminForumPost } from './adminData'
import { getAdminForum, saveAdminForum } from './adminData'
import AdminConfirmModal from './AdminConfirmModal'

function ForumForm({
  post,
  onSave,
  onCancel,
}: {
  post: AdminForumPost | null
  onSave: (p: AdminForumPost) => void
  onCancel: () => void
}) {
  const isEdit = !!post
  const [form, setForm] = useState<AdminForumPost>(
    post ?? {
      id: 0,
      title: '',
      author: '',
      content: '',
      replies: 0,
      status: '正常',
      publishTime: new Date().toISOString().slice(0, 10),
    }
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-bold text-[#1a2b3c]">{isEdit ? '编辑帖子' : '添加帖子'}</h3>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            onSave(form)
          }}
          className="p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-[#6b7c8d] mb-1">ID</label>
            <input
              type="number"
              value={form.id || ''}
              onChange={(e) => setForm({ ...form, id: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6b7c8d] mb-1">标题</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6b7c8d] mb-1">作者</label>
            <input
              type="text"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              placeholder="用户****1234"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6b7c8d] mb-1">内容</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg min-h-[100px]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6b7c8d] mb-1">回复数</label>
            <input
              type="number"
              min={0}
              value={form.replies}
              onChange={(e) => setForm({ ...form, replies: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6b7c8d] mb-1">状态</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as AdminForumPost['status'] })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            >
              <option value="正常">正常</option>
              <option value="置顶">置顶</option>
              <option value="已删除">已删除</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6b7c8d] mb-1">发布时间</label>
            <input
              type="date"
              value={form.publishTime}
              onChange={(e) => setForm({ ...form, publishTime: e.target.value })}
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

export default function AdminForum() {
  const [list, setList] = useState<AdminForumPost[]>([])
  const [formItem, setFormItem] = useState<AdminForumPost | null | 'add'>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  useEffect(() => {
    setList(getAdminForum())
  }, [])

  const handleSave = (p: AdminForumPost) => {
    if (formItem === 'add') {
      const id = p.id || Math.max(0, ...list.map((x) => x.id)) + 1
      const next = [...list, { ...p, id }]
      setList(next)
      saveAdminForum(next)
    } else if (formItem) {
      const next = list.map((x) => (x.id === p.id ? p : x))
      setList(next)
      saveAdminForum(next)
    }
    setFormItem(null)
  }

  const handleDelete = (id: number) => {
    const next = list.filter((x) => x.id !== id)
    setList(next)
    saveAdminForum(next)
    setDeleteId(null)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-[#1a2b3c]">论坛管理</h1>
        <button onClick={() => setFormItem('add')} className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm font-medium">
          + 添加帖子
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#f5f7fa] border-b border-gray-200">
              <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d]">ID</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d]">标题</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d]">作者</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d]">回复</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d]">状态</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d]">发布时间</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d] w-28">操作</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-[#1a2b3c]">{p.id}</td>
                <td className="px-4 py-3 text-sm text-[#1a2b3c]">{p.title}</td>
                <td className="px-4 py-3 text-sm text-[#6b7c8d]">{p.author}</td>
                <td className="px-4 py-3 text-sm text-[#1a2b3c]">{p.replies}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 rounded text-xs ${
                      p.status === '置顶' ? 'bg-blue-100 text-blue-700' : p.status === '已删除' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-[#6b7c8d]">{p.publishTime}</td>
                <td className="px-4 py-3">
                  <button onClick={() => setFormItem(p)} className="text-[#1e3a5f] text-sm mr-2 hover:underline">编辑</button>
                  <button onClick={() => setDeleteId(p.id)} className="text-red-600 text-sm hover:underline">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {formItem && formItem !== 'add' && <ForumForm post={formItem} onSave={handleSave} onCancel={() => setFormItem(null)} />}
      {formItem === 'add' && <ForumForm post={null} onSave={handleSave} onCancel={() => setFormItem(null)} />}
      {deleteId !== null && (
        <AdminConfirmModal
          title="确定要删除该帖子吗？此操作不可恢复。"
          onConfirm={() => handleDelete(deleteId)}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  )
}
