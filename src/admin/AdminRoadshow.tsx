import { useState, useEffect } from 'react'
import type { HomeRoadshowConfig, AdminRoadshowEvent, RoadshowStatus } from '../lib/adminDb'
import {
  fetchRoadshowConfig,
  saveRoadshowConfig,
  fetchRoadshowEvents,
  saveRoadshowEvent,
  deleteRoadshowEvent,
} from '../lib/adminDb'
import { getErrorMessage } from './utils'

const defaultEvent = (): AdminRoadshowEvent => ({
  id: 0,
  title: '',
  startTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
  durationMinutes: 60,
  status: '预热中',
  reservationEnabled: true,
  reservationBaseCount: 0,
  reservationRealCount: 0,
})

export default function AdminRoadshow() {
  const [config, setConfig] = useState<HomeRoadshowConfig>({ title: '路演日历', path: '/roadshow', enabled: true })
  const [events, setEvents] = useState<AdminRoadshowEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState<string | null>(null)
  const [editing, setEditing] = useState<AdminRoadshowEvent | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<AdminRoadshowEvent>(defaultEvent())

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const [r, list] = await Promise.all([fetchRoadshowConfig(), fetchRoadshowEvents()])
      setConfig(r)
      setEvents(list)
    } catch (e) {
      setError(getErrorMessage(e, '加载失败'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleSaveConfig = async () => {
    setSaving('config')
    setError(null)
    try {
      await saveRoadshowConfig(config)
    } catch (e) {
      setError(getErrorMessage(e, '保存失败'))
    } finally {
      setSaving(null)
    }
  }

  const openNew = () => {
    setForm(defaultEvent())
    setEditing(null)
    setShowForm(true)
  }
  const openEdit = (ev: AdminRoadshowEvent) => {
    setForm({ ...ev })
    setEditing(ev)
    setShowForm(true)
  }
  const handleSaveEvent = async () => {
    if (!form.title.trim()) {
      setError('请填写活动标题')
      return
    }
    setSaving('event')
    setError(null)
    try {
      await saveRoadshowEvent(form)
      setShowForm(false)
      await load()
    } catch (e) {
      setError(getErrorMessage(e, '保存失败'))
    } finally {
      setSaving(null)
    }
  }
  const handleDeleteEvent = async (id: number) => {
    if (!confirm('确定删除该场次？')) return
    setError(null)
    try {
      await deleteRoadshowEvent(id)
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
      <h1 className="text-xl font-bold text-[#1a2b3c] mb-6">路演日历管理</h1>
      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

      {/* 一、首页区块配置：控制首页是否显示路演入口及标题、跳转路径 */}
      <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <h3 className="font-medium text-[#1a2b3c] mb-2">首页区块配置</h3>
        <p className="text-xs text-[#6b7c8d] mb-4">配置首页「路演日历」入口：标题、点击后跳转路径；关闭后首页不显示该入口。</p>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-[#6b7c8d] mb-1">入口标题</label>
            <input
              type="text"
              value={config.title}
              onChange={(e) => setConfig((r) => ({ ...r, title: e.target.value }))}
              className="w-full max-w-xs px-3 py-2 border rounded-lg"
              placeholder="路演日历"
            />
          </div>
          <div>
            <label className="block text-sm text-[#6b7c8d] mb-1">跳转路径</label>
            <input
              type="text"
              value={config.path}
              onChange={(e) => setConfig((r) => ({ ...r, path: e.target.value }))}
              className="w-full max-w-xs px-3 py-2 border rounded-lg font-mono"
              placeholder="/roadshow"
            />
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={config.enabled} onChange={(e) => setConfig((r) => ({ ...r, enabled: e.target.checked }))} />
            <span className="text-sm">在首页显示路演日历入口</span>
          </label>
          <button onClick={handleSaveConfig} disabled={saving === 'config'} className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm">
            {saving === 'config' ? '保存中...' : '保存'}
          </button>
        </div>
      </section>

      {/* 二、路演场次管理：列表即前端「路演日历」页展示的活动列表 */}
      <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-medium text-[#1a2b3c] mb-2">路演场次</h3>
        <p className="text-xs text-[#6b7c8d] mb-4">此处场次列表即前端「路演日历」页展示的活动；可增删改，前端实时同步。</p>
        <div className="mb-4">
          <button onClick={openNew} className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm">
            + 新增场次
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-[#6b7c8d]">
                <th className="pb-2 pr-4">标题</th>
                <th className="pb-2 pr-4">开始时间</th>
                <th className="pb-2 pr-4">时长(分)</th>
                <th className="pb-2 pr-4">状态</th>
                <th className="pb-2 pr-4">预约</th>
                <th className="pb-2"></th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-[#6b7c8d]">
                    暂无场次，点击「新增场次」添加；添加后前端路演日历页将显示。
                  </td>
                </tr>
              ) : (
                events.map((ev) => (
                  <tr key={ev.id} className="border-b border-gray-100">
                    <td className="py-2 pr-4 font-medium">{ev.title || '—'}</td>
                    <td className="py-2 pr-4">{ev.startTime || '—'}</td>
                    <td className="py-2 pr-4">{ev.durationMinutes}</td>
                    <td className="py-2 pr-4">{ev.status}</td>
                    <td className="py-2 pr-4">{ev.reservationEnabled ? `是(底数${ev.reservationBaseCount})` : '否'}</td>
                    <td className="py-2">
                      <button onClick={() => openEdit(ev)} className="text-[#1e3a5f] mr-2">编辑</button>
                      <button onClick={() => handleDeleteEvent(ev.id)} className="text-red-600">删除</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* 新增/编辑场次 */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
            <h4 className="font-medium text-[#1a2b3c] mb-4">{editing ? '编辑场次' : '新增场次'}</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-[#6b7c8d] mb-1">活动标题 *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="如：猫头鹰策略会-2月专场"
                />
              </div>
              <div>
                <label className="block text-sm text-[#6b7c8d] mb-1">开始时间 *</label>
                <input
                  type="datetime-local"
                  value={form.startTime.replace(' ', 'T').slice(0, 16)}
                  onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value.replace('T', ' ') }))}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-[#6b7c8d] mb-1">时长（分钟）</label>
                <input
                  type="number"
                  min={1}
                  value={form.durationMinutes}
                  onChange={(e) => setForm((f) => ({ ...f, durationMinutes: Number(e.target.value) || 60 }))}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-[#6b7c8d] mb-1">状态</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as RoadshowStatus }))}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  {(['预热中', '直播中', '回放中', '已结束'] as const).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.reservationEnabled}
                  onChange={(e) => setForm((f) => ({ ...f, reservationEnabled: e.target.checked }))}
                />
                <span className="text-sm">开启预约</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm text-[#6b7c8d] mb-1">预约底数</label>
                  <input
                    type="number"
                    min={0}
                    value={form.reservationBaseCount}
                    onChange={(e) => setForm((f) => ({ ...f, reservationBaseCount: Number(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#6b7c8d] mb-1">实际人数</label>
                  <input
                    type="number"
                    min={0}
                    value={form.reservationRealCount}
                    onChange={(e) => setForm((f) => ({ ...f, reservationRealCount: Number(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#6b7c8d] mb-1">回放链接</label>
                <input
                  type="url"
                  value={form.replayUrl ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, replayUrl: e.target.value.trim() || null }))}
                  className="w-full px-3 py-2 border rounded-lg font-mono text-sm"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm text-[#6b7c8d] mb-1">外部/直播链接</label>
                <input
                  type="url"
                  value={form.externalUrl ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, externalUrl: e.target.value.trim() || null }))}
                  className="w-full px-3 py-2 border rounded-lg font-mono text-sm"
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={handleSaveEvent} disabled={saving === 'event'} className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm">
                {saving === 'event' ? '保存中...' : '保存'}
              </button>
              <button onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg text-sm">取消</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
