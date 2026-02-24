import { useState, useEffect } from 'react'
import type { AdminCourse, AdminLesson } from '../lib/adminDb'
import { fetchCourses, saveCourse, deleteCourse, nextLessonId } from '../lib/adminDb'
import AdminConfirmModal from './AdminConfirmModal'

function CourseForm({
  course,
  onSave,
  onCancel,
}: {
  course: AdminCourse | null
  onSave: (c: AdminCourse) => void
  onCancel: () => void
}) {
  const isEdit = !!course
  const [form, setForm] = useState<AdminCourse>(
    course ?? {
      id: 0,
      title: '',
      type: '视频',
      duration: '',
      tag: '入门',
      thumbnail: '📖',
      desc: '',
      lessons: [{ id: 1, title: '', content: '' }],
    }
  )

  const addLesson = () => {
    setForm({
      ...form,
      lessons: [...form.lessons, { id: nextLessonId(form.lessons), title: '', content: '' }],
    })
  }

  const removeLesson = (idx: number) => {
    if (form.lessons.length <= 1) return
    setForm({ ...form, lessons: form.lessons.filter((_, i) => i !== idx) })
  }

  const updateLesson = (idx: number, field: keyof AdminLesson, value: string) => {
    const next = [...form.lessons]
    next[idx] = { ...next[idx], [field]: value }
    setForm({ ...form, lessons: next })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl my-8 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-bold text-[#1a2b3c]">{isEdit ? '编辑课程' : '添加课程'}</h3>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            onSave(form)
          }}
          className="p-6 space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
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
              <label className="block text-sm font-medium text-[#6b7c8d] mb-1">类型</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as AdminCourse['type'] })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              >
                <option value="视频">视频</option>
                <option value="图文">图文</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6b7c8d] mb-1">课程名称</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#6b7c8d] mb-1">时长</label>
              <input
                type="text"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                placeholder="如 15分钟"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6b7c8d] mb-1">标签</label>
              <select
                value={form.tag}
                onChange={(e) => setForm({ ...form, tag: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              >
                <option value="入门">入门</option>
                <option value="进阶">进阶</option>
                <option value="高级">高级</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6b7c8d] mb-1">缩略图(emoji)</label>
            <input
              type="text"
              value={form.thumbnail}
              onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              placeholder="📖"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6b7c8d] mb-1">B站BV号</label>
            <input
              type="text"
              value={form.videoBvid || ''}
              onChange={(e) => setForm({ ...form, videoBvid: e.target.value || undefined })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              placeholder="BV16s4y1p7vh"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6b7c8d] mb-1">简介</label>
            <textarea
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg min-h-[80px]"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-[#6b7c8d]">课时</label>
              <button type="button" onClick={addLesson} className="text-[#1e3a5f] text-sm">
                + 添加课时
              </button>
            </div>
            {form.lessons.map((l, idx) => (
              <div key={l.id} className="border border-gray-200 rounded-lg p-3 mb-2">
                <div className="flex justify-between mb-2">
                  <span className="text-xs text-[#6b7c8d]">课时 {idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeLesson(idx)}
                    disabled={form.lessons.length <= 1}
                    className="text-red-600 text-xs disabled:opacity-50"
                  >
                    删除
                  </button>
                </div>
                <input
                  value={l.title}
                  onChange={(e) => updateLesson(idx, 'title', e.target.value)}
                  className="w-full px-3 py-1.5 border rounded text-sm mb-2"
                  placeholder="课时标题"
                />
                <textarea
                  value={l.content}
                  onChange={(e) => updateLesson(idx, 'content', e.target.value)}
                  className="w-full px-3 py-1.5 border rounded text-sm min-h-[60px]"
                  placeholder="课时内容"
                />
              </div>
            ))}
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

export default function AdminCourses() {
  const [courses, setCourses] = useState<AdminCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [formCourse, setFormCourse] = useState<AdminCourse | null | 'add'>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchCourses()
      setCourses(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : '加载失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleSave = async (c: AdminCourse) => {
    setSaving(true)
    setError(null)
    try {
      await saveCourse(c)
      setFormCourse(null)
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : '保存失败')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteCourse(id)
      setCourses((prev) => prev.filter((x) => x.id !== id))
      setDeleteId(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : '删除失败')
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-[#1a2b3c]">课程管理</h1>
        <button onClick={() => setFormCourse('add')} className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm font-medium">
          + 添加课程
        </button>
      </div>
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>
      )}
      {loading ? (
        <div className="py-12 text-center text-[#6b7c8d]">加载中...</div>
      ) : (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#f5f7fa] border-b border-gray-200">
              <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d]">ID</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d]">课程名称</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d]">类型</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d]">课时数</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7c8d] w-28">操作</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-[#1a2b3c]">{c.id}</td>
                <td className="px-4 py-3 text-sm text-[#1a2b3c]">{c.title}</td>
                <td className="px-4 py-3 text-sm text-[#6b7c8d]">{c.type}</td>
                <td className="px-4 py-3 text-sm text-[#1a2b3c]">{c.lessons.length}</td>
                <td className="px-4 py-3">
                  <button onClick={() => setFormCourse(c)} className="text-[#1e3a5f] text-sm mr-2 hover:underline">编辑</button>
                  <button onClick={() => setDeleteId(c.id)} className="text-red-600 text-sm hover:underline">删除</button>
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
      {formCourse && formCourse !== 'add' && <CourseForm course={formCourse} onSave={handleSave} onCancel={() => setFormCourse(null)} />}
      {formCourse === 'add' && <CourseForm course={null} onSave={handleSave} onCancel={() => setFormCourse(null)} />}
      {deleteId !== null && (
        <AdminConfirmModal
          title="确定要删除该课程吗？此操作不可恢复。"
          onConfirm={() => handleDelete(deleteId)}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  )
}
