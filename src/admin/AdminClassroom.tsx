import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { HomeClassroomConfig } from '../lib/adminDb'
import { fetchClassroomConfig, saveClassroomConfig } from '../lib/adminDb'
import { getErrorMessage } from './utils'

export default function AdminClassroom() {
  const [classroom, setClassroom] = useState<HomeClassroomConfig>({ title: '投顾学院', categoryTabs: [] })
  const [classroomTabsStr, setClassroomTabsStr] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (classroom.categoryTabs.length) setClassroomTabsStr(classroom.categoryTabs.join('\n'))
  }, [classroom.categoryTabs])

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const c = await fetchClassroomConfig()
      setClassroom(c)
    } catch (e) {
      setError(getErrorMessage(e, '加载失败'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      const tabs = classroomTabsStr.split(/[,，\n]/).map((s) => s.trim()).filter(Boolean)
      await saveClassroomConfig({ title: classroom.title, categoryTabs: tabs })
      setClassroom((prev) => ({ ...prev, categoryTabs: tabs }))
    } catch (e) {
      setError(getErrorMessage(e, '保存失败'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-6 text-[#6b7c8d]">加载中...</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-[#1a2b3c] mb-6">投顾学院管理</h1>
      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

      <div className="flex flex-wrap gap-4 mb-6">
        <Link to="/admin/courses" className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm hover:bg-[#2a4a6f]">
          📚 课程管理
        </Link>
      </div>

      <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-medium text-[#1a2b3c] mb-2">投顾学院区块配置</h3>
        <p className="text-xs text-[#6b7c8d] mb-4">首页「投顾学院」标题及分类标签，每行一个或逗号分隔。</p>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-[#6b7c8d] mb-1">区块标题</label>
            <input
              type="text"
              value={classroom.title}
              onChange={(e) => setClassroom((c) => ({ ...c, title: e.target.value }))}
              className="w-full max-w-xs px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm text-[#6b7c8d] mb-1">分类标签（每行一个或逗号分隔）</label>
            <textarea
              value={classroomTabsStr}
              onChange={(e) => setClassroomTabsStr(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg min-h-[100px]"
              placeholder="基金经理精选&#10;基金比较研究&#10;ETF策略研究"
            />
          </div>
          <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm">
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </section>
    </div>
  )
}
