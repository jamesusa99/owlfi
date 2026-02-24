import { useState, useEffect } from 'react'
import type { AdminForumPost, AdminUser } from '../lib/adminDb'
import { fetchForumPosts, saveForumPost, deleteForumPost, fetchUsers } from '../lib/adminDb'
import { getErrorMessage } from './utils'
import { FormLabel } from './AdminFormLabel'
import AdminConfirmModal from './AdminConfirmModal'

function ForumForm({
  post,
  users,
  onSave,
  onCancel,
  onValidationError,
}: {
  post: AdminForumPost | null
  users: AdminUser[]
  onSave: (p: AdminForumPost) => void
  onCancel: () => void
  onValidationError: (msg: string) => void
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!(form.title || '').trim()) {
      onValidationError('请填写标题（必填）')
      return
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(form.publishTime || '')) {
      onValidationError('请选择正确的发布时间，格式：年-月-日')
      return
    }
    onSave(form)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-bold text-[#1a2b3c]">{isEdit ? '编辑帖子' : '添加帖子'}</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <FormLabel label="ID" required={false} hint="添加时留空由系统生成；编辑时不可改" />
            <input
              type="number"
              value={form.id || ''}
              onChange={(e) => setForm({ ...form, id: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              placeholder="新增可不填"
            />
          </div>
          <div>
            <FormLabel label="标题" required hint="任意文字，不能为空" />
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              placeholder="请输入帖子标题"
            />
          </div>
          <div>
            <FormLabel label="作者" required={false} hint="从下拉选择用户，或选「其他」后手动输入" />
            <select
              value={users.some((u) => u.nickname === form.author) ? form.author : form.author ? '_other_' : ''}
              onChange={(e) => setForm({ ...form, author: e.target.value === '_other_' ? '' : e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            >
              <option value="">请选择作者</option>
              {users.map((u) => (
                <option key={u.id} value={u.nickname}>
                  {u.nickname} ({u.id})
                </option>
              ))}
              <option value="_other_">其他（手动输入）</option>
            </select>
            {!users.some((u) => u.nickname === form.author) && (
              <input
                type="text"
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                placeholder="输入作者显示名"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg mt-2"
              />
            )}
          </div>
          <div>
            <FormLabel label="内容" required={false} hint="选填，支持多行" />
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg min-h-[100px]"
              placeholder="选填"
            />
          </div>
          <div>
            <FormLabel label="回复数" required={false} hint="数字，选填" />
            <input
              type="number"
              min={0}
              value={form.replies}
              onChange={(e) => setForm({ ...form, replies: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            />
          </div>
          <div>
            <FormLabel label="状态" required={false} hint="正常 / 置顶 / 已删除" />
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
            <FormLabel label="发布时间" required hint="格式：年-月-日（YYYY-MM-DD）" />
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
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [formItem, setFormItem] = useState<AdminForumPost | null | 'add'>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const [postsData, usersData] = await Promise.all([fetchForumPosts(), fetchUsers()])
      setList(postsData)
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

  const handleSave = async (p: AdminForumPost) => {
    setSaving(true)
    setError(null)
    try {
      await saveForumPost(p)
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
      await deleteForumPost(id)
      setList((prev) => prev.filter((x) => x.id !== id))
      setDeleteId(null)
    } catch (e) {
      setError(getErrorMessage(e, '删除失败'))
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-[#1a2b3c]">论坛管理</h1>
        <button onClick={() => setFormItem('add')} className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm font-medium">
          + 添加帖子
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
      )}
      {saving && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl px-6 py-4">保存中...</div>
        </div>
      )}
      {formItem && formItem !== 'add' && <ForumForm post={formItem} users={users} onSave={handleSave} onCancel={() => setFormItem(null)} onValidationError={setError} />}
      {formItem === 'add' && <ForumForm post={null} users={users} onSave={handleSave} onCancel={() => setFormItem(null)} onValidationError={setError} />}
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
