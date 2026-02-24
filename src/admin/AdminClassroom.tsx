import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { HomeClassroomConfig, AcademyConfig } from '../lib/adminDb'
import {
  fetchClassroomConfig,
  saveClassroomConfig,
  fetchAcademyConfig,
  saveAcademyConfig,
} from '../lib/adminDb'
import { getErrorMessage } from './utils'

export default function AdminClassroom() {
  const [classroom, setClassroom] = useState<HomeClassroomConfig>({ title: '投顾学院', categoryTabs: [] })
  const [classroomTabsStr, setClassroomTabsStr] = useState('')
  const [academy, setAcademy] = useState<AcademyConfig>({ knowledgeDomains: [], certificationDimensions: [] })
  const [knowledgeStr, setKnowledgeStr] = useState('')
  const [certificationStr, setCertificationStr] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState<string | null>(null)

  useEffect(() => {
    if (classroom.categoryTabs.length) setClassroomTabsStr(classroom.categoryTabs.join('\n'))
  }, [classroom.categoryTabs])
  useEffect(() => {
    setKnowledgeStr(academy.knowledgeDomains.join('\n'))
  }, [academy.knowledgeDomains])
  useEffect(() => {
    setCertificationStr(academy.certificationDimensions.join('\n'))
  }, [academy.certificationDimensions])

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const [c, a] = await Promise.all([fetchClassroomConfig(), fetchAcademyConfig()])
      setClassroom(c)
      setAcademy(a)
    } catch (e) {
      setError(getErrorMessage(e, '加载失败'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleSaveClassroom = async () => {
    setSaving('classroom')
    setError(null)
    try {
      const tabs = classroomTabsStr.split(/[,，\n]/).map((s) => s.trim()).filter(Boolean)
      await saveClassroomConfig({ title: classroom.title, categoryTabs: tabs })
      setClassroom((prev) => ({ ...prev, categoryTabs: tabs }))
    } catch (e) {
      setError(getErrorMessage(e, '保存失败'))
    } finally {
      setSaving(null)
    }
  }

  const handleSaveAcademy = async () => {
    setSaving('academy')
    setError(null)
    try {
      const knowledgeDomains = knowledgeStr.split(/[,，\n]/).map((s) => s.trim()).filter(Boolean)
      const certificationDimensions = certificationStr.split(/[,，\n]/).map((s) => s.trim()).filter(Boolean)
      await saveAcademyConfig({ knowledgeDomains, certificationDimensions })
      setAcademy({ knowledgeDomains, certificationDimensions })
    } catch (e) {
      setError(getErrorMessage(e, '保存失败'))
    } finally {
      setSaving(null)
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
        <Link to="/admin/instructors" className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm hover:bg-[#2a4a6f]">
          👤 讲师库
        </Link>
        <Link to="/admin/series" className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm hover:bg-[#2a4a6f]">
          📂 系列课
        </Link>
        <Link to="/admin/courses" className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm hover:bg-[#2a4a6f]">
          📚 课程管理
        </Link>
      </div>

      {/* 首页区块：标题与分类标签 */}
      <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <h3 className="font-medium text-[#1a2b3c] mb-2">首页区块配置</h3>
        <p className="text-xs text-[#6b7c8d] mb-4">首页「投顾学院」标题及分类标签（每行一个或逗号分隔），用于首页展示。</p>
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
            <label className="block text-sm text-[#6b7c8d] mb-1">分类标签</label>
            <textarea
              value={classroomTabsStr}
              onChange={(e) => setClassroomTabsStr(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg min-h-[80px]"
              placeholder="基金经理精选&#10;基金比较研究"
            />
          </div>
          <button onClick={handleSaveClassroom} disabled={saving === 'classroom'} className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm">
            {saving === 'classroom' ? '保存中...' : '保存'}
          </button>
        </div>
      </section>

      {/* 分类管理：知识领域、认证体系（课程关联用） */}
      <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-medium text-[#1a2b3c] mb-2">分类管理</h3>
        <p className="text-xs text-[#6b7c8d] mb-4">维度一「知识领域」、维度二「认证体系」为课程可选标签，在课程管理中为每门课选择。此处维护可选值列表，每行一个或逗号分隔。</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[#6b7c8d] mb-1">知识领域（如：资产配置、定投实战、客户经营、宏观研判）</label>
            <textarea
              value={knowledgeStr}
              onChange={(e) => setKnowledgeStr(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg min-h-[80px]"
              placeholder="资产配置&#10;定投实战&#10;客户经营&#10;宏观研判"
            />
          </div>
          <div>
            <label className="block text-sm text-[#6b7c8d] mb-1">认证体系（如：初级投顾必修、资深投顾进阶）</label>
            <textarea
              value={certificationStr}
              onChange={(e) => setCertificationStr(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg min-h-[60px]"
              placeholder="初级投顾必修&#10;资深投顾进阶"
            />
          </div>
          <button onClick={handleSaveAcademy} disabled={saving === 'academy'} className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm">
            {saving === 'academy' ? '保存中...' : '保存'}
          </button>
        </div>
      </section>
    </div>
  )
}
