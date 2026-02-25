import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { HomeServiceRow, HomeClassroomConfig, HomeRoadshowConfig, AcademyConfig } from '../lib/adminDb'
import {
  fetchHomeServices,
  saveHomeService,
  deleteHomeService,
  fetchClassroomConfig,
  saveClassroomConfig,
  fetchRoadshowConfig,
  saveRoadshowConfig,
  fetchAcademyConfig,
  saveAcademyConfig,
} from '../lib/adminDb'
import { getErrorMessage } from './utils'

const defaultService: HomeServiceRow = { id: 0, label: '', icon: '📌', path: '#', sortOrder: 0 }

export default function AdminHomeConfig() {
  const [services, setServices] = useState<HomeServiceRow[]>([])
  const [classroom, setClassroom] = useState<HomeClassroomConfig>({ title: '投顾学院', categoryTabs: [] })
  const [classroomTabsStr, setClassroomTabsStr] = useState('')
  const [roadshow, setRoadshow] = useState<HomeRoadshowConfig>({ title: '路演日历', path: '/roadshow', enabled: true })
  const [academy, setAcademy] = useState<AcademyConfig>({ knowledgeDomains: [], certificationDimensions: [] })
  const [knowledgeStr, setKnowledgeStr] = useState('')
  const [certificationStr, setCertificationStr] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState<string | null>(null)
  const [editingService, setEditingService] = useState<HomeServiceRow | null>(null)
  const [newService, setNewService] = useState<HomeServiceRow | null>(null)

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
      const [s, c, r, a] = await Promise.all([
        fetchHomeServices(),
        fetchClassroomConfig(),
        fetchRoadshowConfig(),
        fetchAcademyConfig(),
      ])
      setServices(s)
      setClassroom(c)
      setRoadshow(r)
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

  const handleSaveService = async (row: HomeServiceRow) => {
    setSaving('service')
    setError(null)
    try {
      await saveHomeService(row)
      setEditingService(null)
      setNewService(null)
      await load()
    } catch (e) {
      setError(getErrorMessage(e, '保存失败'))
    } finally {
      setSaving(null)
    }
  }

  const handleDeleteService = async (id: number) => {
    if (!confirm('确定删除该入口？')) return
    setError(null)
    try {
      await deleteHomeService(id)
      await load()
    } catch (e) {
      setError(getErrorMessage(e, '删除失败'))
    }
  }

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

  const handleSaveRoadshow = async () => {
    setSaving('roadshow')
    setError(null)
    try {
      await saveRoadshowConfig(roadshow)
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
      <h1 className="text-xl font-bold text-[#1a2b3c] mb-6">首页配置</h1>
      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

      {/* 入口配置 */}
      <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <h3 className="font-medium text-[#1a2b3c] mb-2">首页入口</h3>
        <p className="text-xs text-[#6b7c8d] mb-4">配置首页顶部图标入口（组合管理、深度调研等）。不含「我的账户」，用户点击底部「我的」进入账户。</p>
        <div className="space-y-2">
          {services.map((s) => (
            <div key={s.id} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
              {editingService?.id === s.id ? (
                <>
                  <input
                    type="text"
                    value={editingService.icon}
                    onChange={(e) => setEditingService((x) => x && { ...x, icon: e.target.value })}
                    className="w-12 px-2 py-1 border rounded"
                    placeholder="图标"
                  />
                  <input
                    type="text"
                    value={editingService.label}
                    onChange={(e) => setEditingService((x) => x && { ...x, label: e.target.value })}
                    className="flex-1 px-2 py-1 border rounded"
                    placeholder="名称"
                  />
                  <input
                    type="text"
                    value={editingService.path}
                    onChange={(e) => setEditingService((x) => x && { ...x, path: e.target.value })}
                    className="flex-1 px-2 py-1 border rounded font-mono text-sm"
                    placeholder="路径"
                  />
                  <button onClick={() => handleSaveService(editingService)} disabled={saving === 'service'} className="px-3 py-1 bg-[#1e3a5f] text-white rounded text-sm">保存</button>
                  <button onClick={() => setEditingService(null)} className="px-3 py-1 border rounded text-sm">取消</button>
                </>
              ) : (
                <>
                  <span className="text-xl w-8">{s.icon}</span>
                  <span className="flex-1 font-medium">{s.label}</span>
                  <span className="text-sm text-[#6b7c8d] font-mono">{s.path}</span>
                  <button onClick={() => setEditingService({ ...s })} className="text-[#1e3a5f] text-sm">编辑</button>
                  <button onClick={() => handleDeleteService(s.id)} className="text-red-600 text-sm">删除</button>
                </>
              )}
            </div>
          ))}
          {newService ? (
            <div className="flex items-center gap-3 py-2">
              <input type="text" value={newService.icon} onChange={(e) => setNewService((x) => x && { ...x, icon: e.target.value })} className="w-12 px-2 py-1 border rounded" placeholder="图标" />
              <input type="text" value={newService.label} onChange={(e) => setNewService((x) => x && { ...x, label: e.target.value })} className="flex-1 px-2 py-1 border rounded" placeholder="名称" />
              <input type="text" value={newService.path} onChange={(e) => setNewService((x) => x && { ...x, path: e.target.value })} className="flex-1 px-2 py-1 border rounded font-mono text-sm" placeholder="路径" />
              <button onClick={() => newService && handleSaveService({ ...newService, sortOrder: services.length + 1 })} disabled={saving === 'service'} className="px-3 py-1 bg-[#1e3a5f] text-white rounded text-sm">添加</button>
              <button onClick={() => setNewService(null)} className="px-3 py-1 border rounded text-sm">取消</button>
            </div>
          ) : (
            <button onClick={() => setNewService({ ...defaultService, sortOrder: services.length + 1 })} className="mt-2 px-4 py-2 border border-dashed border-[#1e3a5f] text-[#1e3a5f] rounded-lg text-sm">+ 添加入口</button>
          )}
        </div>
      </section>

      {/* 投顾学院（首页展示 + 课程分类） */}
      <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <h3 className="font-medium text-[#1a2b3c] mb-2">投顾学院</h3>
        <p className="text-xs text-[#6b7c8d] mb-4">
          首页区块标题、分类标签；以及课程可选的知识领域、认证体系。课程管理入口：
          <Link to="/admin/instructors" className="text-[#1e3a5f] ml-1">讲师</Link>
          <Link to="/admin/series" className="text-[#1e3a5f] ml-2">系列课</Link>
          <Link to="/admin/courses" className="text-[#1e3a5f] ml-2">课程</Link>
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[#6b7c8d] mb-1">区块标题（首页展示）</label>
            <input
              type="text"
              value={classroom.title}
              onChange={(e) => setClassroom((c) => ({ ...c, title: e.target.value }))}
              className="w-full max-w-xs px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm text-[#6b7c8d] mb-1">首页分类标签（每行一个或逗号分隔）</label>
            <textarea
              value={classroomTabsStr}
              onChange={(e) => setClassroomTabsStr(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg min-h-[80px]"
              placeholder="基金经理精选&#10;基金比较研究"
            />
          </div>
          <button onClick={handleSaveClassroom} disabled={saving === 'classroom'} className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm">
            {saving === 'classroom' ? '保存中...' : '保存区块'}
          </button>
          <hr className="border-gray-100" />
          <div>
            <label className="block text-sm text-[#6b7c8d] mb-1">知识领域（课程关联用，如：资产配置、定投实战）</label>
            <textarea
              value={knowledgeStr}
              onChange={(e) => setKnowledgeStr(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg min-h-[80px]"
              placeholder="资产配置&#10;定投实战&#10;客户经营&#10;宏观研判"
            />
          </div>
          <div>
            <label className="block text-sm text-[#6b7c8d] mb-1">认证体系（课程关联用，如：初级投顾必修）</label>
            <textarea
              value={certificationStr}
              onChange={(e) => setCertificationStr(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg min-h-[60px]"
              placeholder="初级投顾必修&#10;资深投顾进阶"
            />
          </div>
          <button onClick={handleSaveAcademy} disabled={saving === 'academy'} className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm">
            {saving === 'academy' ? '保存中...' : '保存分类'}
          </button>
        </div>
      </section>

      {/* 路演日历区块（首页展示用） */}
      <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-medium text-[#1a2b3c] mb-2">路演日历区块</h3>
        <p className="text-xs text-[#6b7c8d] mb-4">首页路演入口的标题、跳转路径；关闭后首页不显示该入口。</p>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-[#6b7c8d] mb-1">入口标题</label>
            <input
              type="text"
              value={roadshow.title}
              onChange={(e) => setRoadshow((r) => ({ ...r, title: e.target.value }))}
              className="w-full max-w-xs px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm text-[#6b7c8d] mb-1">跳转路径</label>
            <input
              type="text"
              value={roadshow.path}
              onChange={(e) => setRoadshow((r) => ({ ...r, path: e.target.value }))}
              className="w-full max-w-xs px-3 py-2 border rounded-lg font-mono"
            />
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={roadshow.enabled} onChange={(e) => setRoadshow((r) => ({ ...r, enabled: e.target.checked }))} />
            <span className="text-sm">在首页显示路演日历入口</span>
          </label>
          <button onClick={handleSaveRoadshow} disabled={saving === 'roadshow'} className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm">
            {saving === 'roadshow' ? '保存中...' : '保存'}
          </button>
        </div>
      </section>
    </div>
  )
}
