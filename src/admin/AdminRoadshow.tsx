import { useState, useEffect } from 'react'
import type { HomeRoadshowConfig } from '../lib/adminDb'
import { fetchRoadshowConfig, saveRoadshowConfig } from '../lib/adminDb'
import { getErrorMessage } from './utils'

export default function AdminRoadshow() {
  const [roadshow, setRoadshow] = useState<HomeRoadshowConfig>({ title: '路演日历', path: '/roadshow', enabled: true })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const r = await fetchRoadshowConfig()
      setRoadshow(r)
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
      await saveRoadshowConfig(roadshow)
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
      <h1 className="text-xl font-bold text-[#1a2b3c] mb-6">路演日历管理</h1>
      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

      <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-medium text-[#1a2b3c] mb-2">路演日历区块配置</h3>
        <p className="text-xs text-[#6b7c8d] mb-4">路演日历区块的标题与链接，关闭后首页不显示该区块。</p>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-[#6b7c8d] mb-1">标题</label>
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
            <span className="text-sm">在首页显示路演日历区块</span>
          </label>
          <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm">
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </section>
    </div>
  )
}
