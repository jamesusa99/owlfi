import { useState, useEffect } from 'react'
import { fetchAnnouncement, saveAnnouncement, fetchMarketIndicators, saveMarketIndicators, type MarketIndicatorsRow } from '../lib/adminDb'
import { getErrorMessage } from './utils'

const defaultIndicators: MarketIndicatorsRow = {
  bondEquitySpread: '4.40%',
  spreadStatus: '较好',
  marketTemperature: '66.12°C',
  tempStatus: '偏热',
  updatedAt: '',
}

export default function AdminSettings() {
  const [announcement, setAnnouncement] = useState('')
  const [indicators, setIndicators] = useState<MarketIndicatorsRow>(defaultIndicators)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savingIndicators, setSavingIndicators] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [successIndicators, setSuccessIndicators] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    Promise.all([fetchAnnouncement(), fetchMarketIndicators()])
      .then(([content, ind]) => {
        if (!cancelled) {
          setAnnouncement(content)
          setIndicators(ind)
        }
      })
      .catch((e) => {
        if (!cancelled) setError(getErrorMessage(e, '加载失败'))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const handleSaveAnnouncement = async () => {
    setSaving(true)
    setError(null)
    setSuccess(false)
    try {
      await saveAnnouncement(announcement)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
    } catch (e) {
      setError(getErrorMessage(e, '保存失败'))
    } finally {
      setSaving(false)
    }
  }

  const handleSaveIndicators = async () => {
    setSavingIndicators(true)
    setError(null)
    setSuccessIndicators(false)
    try {
      await saveMarketIndicators(indicators)
      setSuccessIndicators(true)
      setTimeout(() => setSuccessIndicators(false), 2000)
    } catch (e) {
      setError(getErrorMessage(e, '保存失败'))
    } finally {
      setSavingIndicators(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-[#1a2b3c] mb-6">系统设置</h1>
      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
      <div className="space-y-6 max-w-2xl">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-medium text-[#1a2b3c] mb-2">系统公告</h3>
          <p className="text-xs text-[#6b7c8d] mb-3">内容将显示在首页顶部区域，留空则不显示公告栏。</p>
          {loading ? (
            <p className="text-[#6b7c8d]">加载中...</p>
          ) : (
            <>
              <textarea
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                placeholder="输入系统公告内容，支持多行..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg min-h-[100px] focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
              />
              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={handleSaveAnnouncement}
                  disabled={saving}
                  className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm disabled:opacity-50"
                >
                  {saving ? '保存中...' : '保存'}
                </button>
                {success && <span className="text-green-600 text-sm">已保存</span>}
              </div>
            </>
          )}
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-medium text-[#1a2b3c] mb-2">市场指标</h3>
          <p className="text-xs text-[#6b7c8d] mb-4">以下内容将显示在首页「市场指标」区域，点击可进入详情页。</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4 py-2">
              <span className="text-[#6b7c8d] shrink-0">股债利差</span>
              <input
                type="text"
                value={indicators.bondEquitySpread}
                onChange={(e) => setIndicators((i) => ({ ...i, bondEquitySpread: e.target.value }))}
                className="w-24 px-2 py-1 border rounded text-right"
                placeholder="4.40%"
              />
              <input
                type="text"
                value={indicators.spreadStatus}
                onChange={(e) => setIndicators((i) => ({ ...i, spreadStatus: e.target.value }))}
                className="w-20 px-2 py-1 border rounded text-right text-sm"
                placeholder="较好"
              />
            </div>
            <div className="flex items-center justify-between gap-4 py-2">
              <span className="text-[#6b7c8d] shrink-0">市场温度</span>
              <input
                type="text"
                value={indicators.marketTemperature}
                onChange={(e) => setIndicators((i) => ({ ...i, marketTemperature: e.target.value }))}
                className="w-24 px-2 py-1 border rounded text-right"
                placeholder="66.12°C"
              />
              <input
                type="text"
                value={indicators.tempStatus}
                onChange={(e) => setIndicators((i) => ({ ...i, tempStatus: e.target.value }))}
                className="w-20 px-2 py-1 border rounded text-right text-sm"
                placeholder="偏热"
              />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={handleSaveIndicators}
              disabled={savingIndicators}
              className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm disabled:opacity-50"
            >
              {savingIndicators ? '保存中...' : '更新'}
            </button>
            {successIndicators && <span className="text-green-600 text-sm">已保存，首页将显示最新数据</span>}
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-medium text-[#1a2b3c] mb-2">版本信息</h3>
          <p className="text-[#6b7c8d] text-sm">猫头鹰基金研究院 v1.0.0</p>
        </div>
      </div>
    </div>
  )
}
