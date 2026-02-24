import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import type { AdminRoadshowEvent, RoadshowStatus, RoadshowMaterial } from '../lib/adminDb'
import {
  fetchRoadshowEvents,
  saveRoadshowEvent,
  deleteRoadshowEvent,
  computeRoadshowDisplayStatus,
  roadshowEventsConflict,
  createCourseFromRoadshowEvent,
} from '../lib/adminDb'
import { getErrorMessage } from './utils'

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

const defaultEvent = (): AdminRoadshowEvent => ({
  id: 0,
  title: '',
  startTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
  durationMinutes: 60,
  status: '预热中',
  reservationEnabled: true,
  reservationBaseCount: 0,
  reservationRealCount: 0,
  materials: [],
})

export default function AdminRoadshow() {
  const [events, setEvents] = useState<AdminRoadshowEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState<string | null>(null)
  const [editing, setEditing] = useState<AdminRoadshowEvent | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<AdminRoadshowEvent>(defaultEvent())
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
  const [calYear, setCalYear] = useState(() => new Date().getFullYear())
  const [calMonth, setCalMonth] = useState(() => new Date().getMonth() + 1)
  const [h5ConfigStr, setH5ConfigStr] = useState('{}')
  const navigate = useNavigate()

  const conflictMap = useMemo(() => {
    const map: Record<number, boolean> = {}
    events.forEach((a, i) => {
      events.forEach((b, j) => {
        if (i < j && roadshowEventsConflict(a, b)) {
          map[a.id] = true
          map[b.id] = true
        }
      })
    })
    return map
  }, [events])

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const list = await fetchRoadshowEvents()
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

  const openEdit = (ev: AdminRoadshowEvent) => {
    setForm({ ...ev, materials: ev.materials?.length ? [...ev.materials] : [] })
    setEditing(ev)
    setH5ConfigStr(typeof ev.h5Config === 'object' && ev.h5Config !== null ? JSON.stringify(ev.h5Config, null, 2) : '{}')
    setShowForm(true)
  }
  const openNew = () => {
    setForm(defaultEvent())
    setH5ConfigStr('{}')
    setEditing(null)
    setShowForm(true)
  }
  const closeForm = () => {
    setShowForm(false)
    setEditing(null)
  }
  const handleSaveEvent = async () => {
    if (!form.title.trim()) {
      setError('请填写活动标题')
      return
    }
    let h5: Record<string, unknown> = {}
    try {
      if (h5ConfigStr.trim()) h5 = JSON.parse(h5ConfigStr) as Record<string, unknown>
    } catch {
      setError('H5 配置需为合法 JSON')
      return
    }
    setSaving('event')
    setError(null)
    try {
      await saveRoadshowEvent({ ...form, h5Config: Object.keys(h5).length ? h5 : undefined })
      closeForm()
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

  const handleConvertToCourse = async (ev: AdminRoadshowEvent) => {
    setSaving('event')
    setError(null)
    try {
      const courseId = await createCourseFromRoadshowEvent(ev)
      if (courseId) {
        setError(null)
        if (window.confirm('已转为学院课程，是否前往课程管理编辑？')) {
          navigate('/admin/courses')
        }
      }
    } catch (e) {
      setError(getErrorMessage(e, '转为课程失败'))
    } finally {
      setSaving(null)
    }
  }

  if (loading) {
    return <div className="p-6 text-[#6b7c8d]">加载中...</div>
  }

  const firstDay = useMemo(() => new Date(calYear, calMonth - 1, 1).getDay(), [calYear, calMonth])
  const daysInMonth = useMemo(() => new Date(calYear, calMonth, 0).getDate(), [calYear, calMonth])
  const eventsByDay = useMemo(() => {
    const map: Record<string, AdminRoadshowEvent[]> = {}
    events.forEach((ev) => {
      const [datePart] = ev.startTime.split(' ')
      if (datePart) {
        if (!map[datePart]) map[datePart] = []
        map[datePart].push(ev)
      }
    })
    return map
  }, [events])

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-[#1a2b3c] mb-6">路演日历管理</h1>
      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={openNew}
          className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm"
        >
          + 新增场次
        </button>
        <button
          onClick={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-[#6b7c8d]"
        >
          {viewMode === 'list' ? '日历视图' : '列表视图'}
        </button>
      </div>

      {viewMode === 'list' && (
        <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-medium text-[#1a2b3c] mb-2">路演场次</h3>
          <p className="text-xs text-[#6b7c8d] mb-4">前端展示状态将根据系统时间自动切换（预热中→直播中→回放中/已结束）。同一天时段重叠会标为冲突。</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-[#6b7c8d]">
                  <th className="pb-2 pr-4">标题</th>
                  <th className="pb-2 pr-4">开始时间</th>
                  <th className="pb-2 pr-4">时长</th>
                  <th className="pb-2 pr-4">自动状态</th>
                  <th className="pb-2 pr-4">预约</th>
                  <th className="pb-2 pr-4">冲突</th>
                  <th className="pb-2"></th>
                </tr>
              </thead>
              <tbody>
                {events.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-[#6b7c8d]">
                      暂无场次，点击「新增场次」添加。
                    </td>
                  </tr>
                ) : (
                  events.map((ev) => (
                    <tr key={ev.id} className="border-b border-gray-100">
                      <td className="py-2 pr-4 font-medium">{ev.title || '—'}</td>
                      <td className="py-2 pr-4">{ev.startTime || '—'}</td>
                      <td className="py-2 pr-4">{ev.durationMinutes}分钟</td>
                      <td className="py-2 pr-4">{computeRoadshowDisplayStatus(ev)}</td>
                      <td className="py-2 pr-4">{ev.reservationEnabled ? `底数${ev.reservationBaseCount}+真实${ev.reservationRealCount}` : '否'}</td>
                      <td className="py-2 pr-4">{conflictMap[ev.id] ? <span className="text-amber-600">有</span> : '—'}</td>
                      <td className="py-2">
                        <button onClick={() => openEdit(ev)} className="text-[#1e3a5f] mr-2">编辑</button>
                        <button onClick={() => handleConvertToCourse(ev)} disabled={!!saving} className="text-[#1e3a5f] mr-2">转为课程</button>
                        <button onClick={() => handleDeleteEvent(ev.id)} className="text-red-600">删除</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {viewMode === 'calendar' && (
        <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-medium text-[#1a2b3c] mb-2">日历看板</h3>
          <p className="text-xs text-[#6b7c8d] mb-4">查看每月排期，同一天时段重叠会标为冲突。</p>
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => calMonth === 1 ? (setCalMonth(12), setCalYear((y) => y - 1)) : setCalMonth((m) => m - 1)} className="p-2 rounded-lg border text-sm">上一月</button>
            <span className="font-medium">{calYear}年{calMonth}月</span>
            <button onClick={() => calMonth === 12 ? (setCalMonth(1), setCalYear((y) => y + 1)) : setCalMonth((m) => m + 1)} className="p-2 rounded-lg border text-sm">下一月</button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-sm">
            {WEEKDAYS.map((w) => (
              <div key={w} className="py-1 text-center text-[#6b7c8d] font-medium">{w}</div>
            ))}
            {Array.from({ length: firstDay }, (_, i) => <div key={`e-${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const d = i + 1
              const dateStr = `${calYear}-${String(calMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`
              const dayEvents = eventsByDay[dateStr] ?? []
              const hasConflict = dayEvents.length >= 2 && dayEvents.some((a, i) => dayEvents.some((b, j) => i < j && roadshowEventsConflict(a, b)))
              return (
                <div
                  key={dateStr}
                  className={`min-h-[60px] p-1 border rounded ${hasConflict ? 'border-amber-500 bg-amber-50' : 'border-gray-100'}`}
                >
                  <span className="text-[#1a2b3c] font-medium">{d}</span>
                  {dayEvents.map((ev) => (
                    <div key={ev.id} className="mt-0.5 text-xs truncate text-[var(--owl-primary)] cursor-pointer hover:underline" onClick={() => openEdit(ev)} title={ev.title}>
                      {ev.startTime.split(' ')[1]?.slice(0, 5)} {ev.title}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* 新增/编辑场次 */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-xl my-8 max-h-[90vh] overflow-y-auto">
            <h4 className="font-medium text-[#1a2b3c] mb-4">{editing ? '编辑场次' : '新增场次'}</h4>

            <div className="space-y-4">
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

              <div className="border-t pt-3">
                <h5 className="text-sm font-medium text-[#1a2b3c] mb-2">时间 / 状态</h5>
                <p className="text-xs text-[#6b7c8d] mb-2">前端展示状态将根据系统时间自动切换；此处可手动覆盖用于后台展示。</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-[#6b7c8d] mb-1">开始时间 *</label>
                    <input
                      type="datetime-local"
                      value={form.startTime.replace(' ', 'T').slice(0, 16)}
                      onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value.replace('T', ' ') }))}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#6b7c8d] mb-1">预计时长（分钟）</label>
                    <input
                      type="number"
                      min={1}
                      value={form.durationMinutes}
                      onChange={(e) => setForm((f) => ({ ...f, durationMinutes: Number(e.target.value) || 60 }))}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                </div>
                <div className="mt-2">
                  <label className="block text-xs text-[#6b7c8d] mb-1">状态（手动）</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as RoadshowStatus }))}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  >
                    {(['预热中', '直播中', '回放中', '已结束'] as const).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="border-t pt-3">
                <h5 className="text-sm font-medium text-[#1a2b3c] mb-2">多媒介入口</h5>
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs text-[#6b7c8d] mb-1">第三方跳转（视频号/小鹅通/Zoom 等）</label>
                    <input
                      type="url"
                      value={form.externalUrl ?? ''}
                      onChange={(e) => setForm((f) => ({ ...f, externalUrl: e.target.value.trim() || null }))}
                      className="w-full px-3 py-2 border rounded-lg font-mono text-sm"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#6b7c8d] mb-1">内嵌 H5 直播插件配置（JSON）</label>
                    <textarea
                      value={h5ConfigStr}
                      onChange={(e) => setH5ConfigStr(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg font-mono text-xs min-h-[60px]"
                      placeholder='{"embedUrl": "..."}'
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#6b7c8d] mb-1">回放链接</label>
                    <input
                      type="url"
                      value={form.replayUrl ?? ''}
                      onChange={(e) => setForm((f) => ({ ...f, replayUrl: e.target.value.trim() || null }))}
                      className="w-full px-3 py-2 border rounded-lg font-mono text-sm"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-3">
                <h5 className="text-sm font-medium text-[#1a2b3c] mb-2">预约管理</h5>
                <p className="text-xs text-[#6b7c8d] mb-2">预约人数显示 = 底数 + 真实人数，可增加氛围。模版消息提醒需对接公众号后配置。</p>
                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={form.reservationEnabled}
                    onChange={(e) => setForm((f) => ({ ...f, reservationEnabled: e.target.checked }))}
                  />
                  <span className="text-sm">开启一键预约</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-[#6b7c8d] mb-1">预约底数</label>
                    <input
                      type="number"
                      min={0}
                      value={form.reservationBaseCount}
                      onChange={(e) => setForm((f) => ({ ...f, reservationBaseCount: Number(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#6b7c8d] mb-1">真实人数</label>
                    <input
                      type="number"
                      min={0}
                      value={form.reservationRealCount}
                      onChange={(e) => setForm((f) => ({ ...f, reservationRealCount: Number(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-3">
                <h5 className="text-sm font-medium text-[#1a2b3c] mb-2">路演资料关联</h5>
                <p className="text-xs text-[#6b7c8d] mb-2">关联基金、研报等，方便用户看播时查阅。</p>
                <div className="space-y-2">
                  {(form.materials ?? []).map((m, idx) => (
                    <div key={idx} className="flex gap-2 items-start p-2 bg-gray-50 rounded-lg">
                      <select
                        value={m.type}
                        onChange={(e) => {
                          const next = [...(form.materials ?? [])]
                          next[idx] = { ...next[idx], type: e.target.value as 'fund' | 'report' }
                          setForm((f) => ({ ...f, materials: next }))
                        }}
                        className="w-20 px-2 py-1 border rounded text-sm"
                      >
                        <option value="fund">基金</option>
                        <option value="report">研报</option>
                      </select>
                      <input
                        value={m.name}
                        onChange={(e) => {
                          const next = [...(form.materials ?? [])]
                          next[idx] = { ...next[idx], name: e.target.value }
                          setForm((f) => ({ ...f, materials: next }))
                        }}
                        className="flex-1 px-2 py-1 border rounded text-sm"
                        placeholder="名称"
                      />
                      <input
                        value={m.code ?? ''}
                        onChange={(e) => {
                          const next = [...(form.materials ?? [])]
                          next[idx] = { ...next[idx], code: e.target.value.trim() || undefined }
                          setForm((f) => ({ ...f, materials: next }))
                        }}
                        className="w-20 px-2 py-1 border rounded text-sm"
                        placeholder="代码"
                      />
                      <input
                        value={m.url ?? ''}
                        onChange={(e) => {
                          const next = [...(form.materials ?? [])]
                          next[idx] = { ...next[idx], url: e.target.value.trim() || undefined }
                          setForm((f) => ({ ...f, materials: next }))
                        }}
                        className="flex-1 px-2 py-1 border rounded text-sm font-mono"
                        placeholder="链接"
                      />
                      <button type="button" onClick={() => setForm((f) => ({ ...f, materials: (f.materials ?? []).filter((_, i) => i !== idx) }))} className="text-red-600 text-sm">删</button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, materials: [...(f.materials ?? []), { type: 'report', name: '' }] }))}
                    className="text-sm text-[#1e3a5f]"
                  >
                    + 添加资料
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button onClick={handleSaveEvent} disabled={saving === 'event'} className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm">
                {saving === 'event' ? '保存中...' : '保存'}
              </button>
              <button onClick={closeForm} className="px-4 py-2 border rounded-lg text-sm">取消</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
