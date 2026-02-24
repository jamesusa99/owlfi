import { useState, useEffect } from 'react'
import type { HomeServiceRow } from '../lib/adminDb'
import { fetchHomeServices, saveHomeService, deleteHomeService } from '../lib/adminDb'
import { getErrorMessage } from './utils'

const defaultService: HomeServiceRow = { id: 0, label: '', icon: '📌', path: '#', sortOrder: 0 }

export default function AdminHomeConfig() {
  const [services, setServices] = useState<HomeServiceRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState<string | null>(null)
  const [editingService, setEditingService] = useState<HomeServiceRow | null>(null)
  const [newService, setNewService] = useState<HomeServiceRow | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const s = await fetchHomeServices()
      setServices(s)
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
      <p className="text-sm text-[#6b7c8d] mt-4">投顾学院、路演日历的区块配置请前往侧栏「投顾学院」「路演日历」管理。</p>
    </div>
  )
}
