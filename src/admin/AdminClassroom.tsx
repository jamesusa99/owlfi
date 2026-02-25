import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { HomeClassroomConfig } from '../lib/adminDb'
import {
  fetchClassroomConfig,
  saveClassroomConfig,
  fetchCourseSeries,
  fetchInstructors,
} from '../lib/adminDb'
import { getErrorMessage } from './utils'

export default function AdminClassroom() {
  const [config, setConfig] = useState<HomeClassroomConfig>({
    title: '投顾学院',
    categoryTabs: [],
    heroTitle: '年度投研课',
  })
  const [categoryTabsStr, setCategoryTabsStr] = useState('')
  const [seriesList, setSeriesList] = useState<{ id: number; title: string }[]>([])
  const [instructors, setInstructors] = useState<{ id: number; name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (config.categoryTabs.length) {
      setCategoryTabsStr(config.categoryTabs.join('\n'))
    }
  }, [config.categoryTabs])

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const [cfg, ser, inst] = await Promise.all([
        fetchClassroomConfig(),
        fetchCourseSeries(),
        fetchInstructors(),
      ])
      setConfig(cfg)
      setCategoryTabsStr(cfg.categoryTabs.join('\n'))
      setSeriesList(ser)
      setInstructors(inst)
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
      const tabs = categoryTabsStr.split(/[,，\n]/).map((s) => s.trim()).filter(Boolean)
      await saveClassroomConfig({ ...config, categoryTabs: tabs })
      setConfig((c) => ({ ...c, categoryTabs: tabs }))
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

      <p className="text-sm text-[#6b7c8d] mb-6">
        配置课程库前台展示：顶部轮播、分类查找、名师专栏等。对应前台
        <a href="/classroom" target="_blank" rel="noopener noreferrer" className="text-[#1e3a5f] ml-1">/classroom</a>
      </p>

      {/* 顶部轮播 */}
      <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <h3 className="font-medium text-[#1a2b3c] mb-4">顶部轮播</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-[#6b7c8d] mb-1">轮播标题</label>
            <input
              type="text"
              value={config.heroTitle ?? '年度投研课'}
              onChange={(e) => setConfig((c) => ({ ...c, heroTitle: e.target.value }))}
              className="w-full max-w-md px-3 py-2 border rounded-lg"
              placeholder="如：年度投研课"
            />
          </div>
          <div>
            <label className="block text-sm text-[#6b7c8d] mb-1">关联系列课（可选）</label>
            <select
              value={config.heroSeriesId ?? ''}
              onChange={(e) =>
                setConfig((c) => ({
                  ...c,
                  heroSeriesId: e.target.value ? Number(e.target.value) : null,
                }))
              }
              className="w-full max-w-md px-3 py-2 border rounded-lg"
            >
              <option value="">不指定（取第一条系列课）</option>
              {seriesList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* 分类查找 */}
      <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <h3 className="font-medium text-[#1a2b3c] mb-2">分类查找</h3>
        <p className="text-xs text-[#6b7c8d] mb-4">前台「分类查找」标签，每行一个或逗号分隔</p>
        <textarea
          value={categoryTabsStr}
          onChange={(e) => setCategoryTabsStr(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg min-h-[100px]"
          placeholder="策略&#10;基金&#10;客户经营&#10;资产配置&#10;合规"
        />
      </section>

      {/* 区块标题（首页用） */}
      <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <h3 className="font-medium text-[#1a2b3c] mb-2">区块标题</h3>
        <p className="text-xs text-[#6b7c8d] mb-4">首页投顾学院入口的标题</p>
        <input
          type="text"
          value={config.title}
          onChange={(e) => setConfig((c) => ({ ...c, title: e.target.value }))}
          className="w-full max-w-xs px-3 py-2 border rounded-lg"
        />
      </section>

      {/* 名师专栏 */}
      <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <h3 className="font-medium text-[#1a2b3c] mb-2">名师专栏</h3>
        <p className="text-xs text-[#6b7c8d] mb-4">
          展示讲师库前 4 位，
          <Link to="/admin/instructors" className="text-[#1e3a5f]">去讲师库管理</Link>
        </p>
        <div className="flex flex-wrap gap-2">
          {instructors.slice(0, 4).map((i) => (
            <span key={i.id} className="px-3 py-1 bg-gray-100 rounded-lg text-sm">
              {i.name}
            </span>
          ))}
          {instructors.length === 0 && (
            <span className="text-sm text-[#6b7c8d]">暂无讲师</span>
          )}
        </div>
      </section>

      {/* 学习排行 */}
      <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <h3 className="font-medium text-[#1a2b3c] mb-2">学习排行</h3>
        <p className="text-xs text-[#6b7c8d]">前台展示占位数据，后续对接学习记录后可展示真实排行</p>
      </section>

      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm hover:bg-[#2a4a6f] disabled:opacity-70"
        >
          {saving ? '保存中...' : '保存配置'}
        </button>
      </div>

      {/* 快捷入口 */}
      <section className="border-t border-gray-200 pt-6">
        <h3 className="font-medium text-[#1a2b3c] mb-4">内容管理</h3>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/admin/instructors"
            className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm hover:bg-[#2a4a6f]"
          >
            👤 讲师库
          </Link>
          <Link
            to="/admin/series"
            className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm hover:bg-[#2a4a6f]"
          >
            📂 系列课
          </Link>
          <Link
            to="/admin/courses"
            className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm hover:bg-[#2a4a6f]"
          >
            📚 课程管理
          </Link>
        </div>
      </section>
    </div>
  )
}
