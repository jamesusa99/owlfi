import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Logo from '../components/Logo'
import {
  fetchNewsForApp,
  fetchCoursesForApp,
  getAnnouncementForApp,
  getMarketIndicatorsForApp,
  getHomeServicesForApp,
  getClassroomConfigForApp,
  getRoadshowConfigForApp,
} from '../lib/publicApi'

const hotTabs = ['推荐', '深度研究', '市场洞察']
const defaultServices = [
  { id: 0, label: '组合管理', icon: '📁', path: '/portfolio', sortOrder: 0 },
  { id: 0, label: '基金诊断', icon: '📊', path: '/research/diagnosis', sortOrder: 1 },
  { id: 0, label: '精选课堂', icon: '📚', path: '/classroom', sortOrder: 2 },
  { id: 0, label: '市场资讯', icon: '📰', path: '/news', sortOrder: 3 },
]

export default function Home() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState('推荐')
  const [hotArticles, setHotArticles] = useState<{ id: number; title: string; publishTime: string }[]>([])
  const [courses, setCourses] = useState<{ id: number; title: string; path: string }[]>([])
  const [announcement, setAnnouncement] = useState('')
  const [marketIndicators, setMarketIndicators] = useState<{
    bondEquitySpread: string
    spreadStatus: string
    marketTemperature: string
    tempStatus: string
    updatedAt: string
  } | null>(null)
  const [services, setServices] = useState<{ id: number; label: string; icon: string; path: string; sortOrder: number }[]>(defaultServices)
  const [classroomConfig, setClassroomConfig] = useState<{ title: string; categoryTabs: string[] }>({ title: '投顾学院', categoryTabs: ['基金经理精选', '基金比较研究', 'ETF策略研究', '绝对收益策略', '基金组合配置'] })
  const [roadshowConfig, setRoadshowConfig] = useState<{ title: string; path: string; enabled: boolean } | null>(null)

  useEffect(() => {
    let cancelled = false
    Promise.all([
      fetchNewsForApp(),
      fetchCoursesForApp(),
      getAnnouncementForApp(),
      getMarketIndicatorsForApp(),
      getHomeServicesForApp(),
      getClassroomConfigForApp(),
      getRoadshowConfigForApp(),
    ])
      .then(([news, courseList, announcementContent, indicators, homeServices, classroom, roadshow]) => {
        if (cancelled) return
        setHotArticles(news.slice(0, 5).map((n) => ({ id: n.id, title: n.title, publishTime: n.publishTime })))
        setCourses(
          courseList.slice(0, 5).map((c) => ({ id: c.id, title: c.title, path: `/classroom/course/${c.id}` }))
        )
        setAnnouncement((announcementContent || '').trim())
        setMarketIndicators(indicators)
        if (homeServices.length > 0) setServices(homeServices)
        setClassroomConfig(classroom)
        setRoadshowConfig(roadshow)
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 pb-8">
      {/* 顶部横幅 */}
      <section className="relative bg-gradient-to-r from-[#e8f4fd] via-[#d4e8f7] to-[#e0eef7] rounded-2xl p-6 mb-6 overflow-hidden">
        {/* 背景装饰线条 */}
        <div className="absolute inset-0 opacity-30">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="chartLines" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                {[0, 10, 20, 30].map((i) => (
                  <path key={i} d={`M${i} 40 L${i + 5} 30 L${i + 10} 35 L${i + 15} 25`} stroke="#1e3a5f" strokeWidth="0.5" fill="none" opacity="0.3" />
                ))}
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#chartLines)" />
          </svg>
        </div>
        <div className="relative flex justify-between items-start gap-4">
          <div className="flex items-center gap-4">
            <Logo size={56} />
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-[#1a365d] mb-1">买方策略基金池</h1>
              <p className="text-[#2c5282] text-sm">基金投研之芯，提升持基体验</p>
            </div>
          </div>
          {!isAuthenticated && (
            <button
              onClick={() => navigate('/profile')}
              className="px-5 py-2 bg-[var(--owl-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90 shrink-0"
            >
              登录
            </button>
          )}
        </div>
      </section>

      {/* 系统公告 */}
      {announcement && (
        <section className="mb-6 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="text-2xl shrink-0" aria-hidden>📢</span>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-amber-800 mb-1">系统公告</h3>
              <p className="text-sm text-[var(--owl-text)] whitespace-pre-line leading-relaxed">{announcement}</p>
            </div>
          </div>
        </section>
      )}

      {/* 服务入口网格（来自后台「首页配置」，不含「我的账户」；用户点底部「我的」进账户） */}
      <section className="bg-white rounded-2xl p-5 shadow-sm mb-6">
        <div className="grid grid-cols-5 gap-4">
          {services.map((s) => (
            <button
              key={s.id || s.path + s.label}
              onClick={() => navigate(s.path)}
              className="flex flex-col items-center gap-2 py-2 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--owl-bg)] flex items-center justify-center text-2xl">
                {s.icon}
              </div>
              <span className="text-xs text-[var(--owl-text)] text-center leading-tight">{s.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 基金好医生 + 热点 */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div
          onClick={() => navigate('/research/diagnosis')}
          className="md:col-span-2 bg-gradient-to-br from-[var(--owl-primary)] to-[#2c5282] rounded-2xl p-5 text-white cursor-pointer hover:opacity-95 transition-opacity"
        >
          <div className="flex items-center gap-3">
            <span className="text-4xl">🦉</span>
            <div>
              <h3 className="font-bold text-lg mb-1">基金好医生</h3>
              <p className="text-white/90 text-sm">分析市场脉动 剖析基金玄机</p>
            </div>
          </div>
        </div>
        <div
          onClick={() => navigate('/news/hot')}
          className="bg-red-500/10 border border-red-500/30 rounded-2xl px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-red-500/15"
        >
          <div className="flex items-center gap-2">
            <span className="text-red-600 font-bold text-sm">热点</span>
            <span className="text-sm text-[var(--owl-text)] truncate flex-1">猫头鹰ETF策略-AI风控持续提高</span>
          </div>
          <span className="text-red-600 text-sm shrink-0">更多 ›</span>
        </div>
      </section>

      {/* 市场洞察 */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div
          onClick={() => navigate('/classroom')}
          className="bg-white rounded-2xl p-5 shadow-sm cursor-pointer hover:shadow-md transition-shadow border border-gray-100"
        >
          <h3 className="font-bold text-[var(--owl-text)] mb-1">猫头鹰策略会</h3>
          <p className="text-sm text-[var(--owl-text-muted)] mb-4">怎么投？专业投研为您导航！</p>
          <div className="h-20 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center">
            <span className="text-4xl">📊</span>
          </div>
        </div>
        <div
          onClick={() => navigate('/forum')}
          className="bg-white rounded-2xl p-5 shadow-sm cursor-pointer hover:shadow-md transition-shadow border border-gray-100"
        >
          <h3 className="font-bold text-[var(--owl-text)] mb-1">猫头鹰连线</h3>
          <p className="text-sm text-[var(--owl-accent)] mb-4 bg-[var(--owl-accent)]/10 inline-block px-2 py-0.5 rounded">直播连线 市场探索</p>
          <div className="h-20 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl flex items-center justify-center">
            <span className="text-4xl">📺</span>
          </div>
        </div>
      </section>

      {/* 投顾学院（标题与分类来自后台「首页配置」） */}
      <section className="bg-white rounded-2xl p-5 shadow-sm mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-[var(--owl-text)]">{classroomConfig.title}</h3>
          <button onClick={() => navigate('/classroom')} className="text-sm text-red-500 font-medium">更多 ›</button>
        </div>
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {classroomConfig.categoryTabs.map((tab, idx) => (
            <button
              key={tab}
              onClick={() => navigate(`/classroom/category/${encodeURIComponent(tab)}`)}
              className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
                idx === 0 ? 'bg-red-500 text-white' : 'bg-gray-100 text-[var(--owl-text-muted)]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {courses.map((c) => (
            <div
              key={c.id}
              onClick={() => navigate(c.path)}
              className="p-4 bg-[var(--owl-bg)] rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <p className="font-medium text-[var(--owl-text)]">{c.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 市场指标（来自后台系统设置） */}
      <section
        onClick={() => navigate('/market/indicators')}
        className="bg-white rounded-2xl p-5 shadow-sm mb-6 cursor-pointer hover:shadow-md transition-shadow"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-[var(--owl-text)]">市场指标</h3>
          <span className="text-xs text-[var(--owl-text-muted)]">
            {marketIndicators?.updatedAt ? `更新于 ${marketIndicators.updatedAt}` : '点击查看详情'}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-[var(--owl-bg)] rounded-xl">
            <p className="text-sm text-[var(--owl-text-muted)] mb-2">股债利差</p>
            <p className="text-2xl font-bold text-[var(--owl-text)]">{marketIndicators?.bondEquitySpread ?? '4.40%'}</p>
            <p className="text-sm text-green-600 mt-1">{marketIndicators?.spreadStatus ?? '较好'}</p>
          </div>
          <div className="p-4 bg-[var(--owl-bg)] rounded-xl">
            <p className="text-sm text-[var(--owl-text-muted)] mb-2">市场温度 · 中证全指</p>
            <p className="text-2xl font-bold text-[var(--owl-text)]">{marketIndicators?.marketTemperature ?? '66.12°C'}</p>
            <p className="text-sm text-orange-500 mt-1">{marketIndicators?.tempStatus ?? '偏热'}</p>
          </div>
        </div>
      </section>

      {/* 路演日历（后台「首页配置」开启时显示） */}
      {roadshowConfig?.enabled && (
        <section
          onClick={() => navigate(roadshowConfig.path)}
          className="bg-white rounded-2xl p-5 shadow-sm mb-6 cursor-pointer hover:shadow-md transition-shadow border border-gray-100"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-[var(--owl-text)]">{roadshowConfig.title}</h3>
            <span className="text-sm text-[var(--owl-primary)]">查看 ›</span>
          </div>
        </section>
      )}

      {/* 热门关注 */}
      <section className="bg-white rounded-2xl p-5 shadow-sm mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-[var(--owl-text)]">热门关注</h3>
          <button onClick={() => navigate('/news')} className="text-sm text-red-500 font-medium">更多 ›</button>
        </div>
        <div className="flex gap-2 mb-4">
          {hotTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm ${
                activeTab === tab ? 'bg-red-500 text-white' : 'bg-gray-100 text-[var(--owl-text-muted)]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {hotArticles.length === 0 ? (
            <p className="text-sm text-[var(--owl-text-muted)]">暂无资讯</p>
          ) : (
            hotArticles.map((a) => (
              <div
                key={a.id}
                onClick={() => navigate(`/news/${a.id}`)}
                className="py-3 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50 rounded-lg px-2 -mx-2"
              >
                <p className="text-sm text-[var(--owl-text)] line-clamp-2">{a.title}</p>
                <div className="flex gap-4 mt-1 text-xs text-[var(--owl-text-muted)]">
                  <span>{a.publishTime}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 底部统计 */}
      <section className="text-center py-8">
        <p className="text-[var(--owl-text-muted)] text-sm mb-2">{'>>>>>> 猫头鹰基金研究院 <<<<<<'}</p>
        <p className="text-sm text-[var(--owl-text)] mb-6">基金投研之芯，提升持基体验</p>
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div onClick={() => navigate('/roadshow')} className="bg-white rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
            <p className="text-2xl font-bold text-[var(--owl-primary)]">1550+</p>
            <p className="text-sm text-[var(--owl-text-muted)] mt-1">累计路演</p>
            <p className="text-xs text-[var(--owl-accent)]">高频度</p>
          </div>
          <div onClick={() => navigate('/institutional')} className="bg-white rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
            <p className="text-2xl font-bold text-[var(--owl-primary)]">200+</p>
            <p className="text-sm text-[var(--owl-text-muted)] mt-1">机构客户</p>
            <p className="text-xs text-[var(--owl-accent)]">覆盖广</p>
          </div>
          <div onClick={() => navigate('/research/fund-profile')} className="bg-white rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
            <p className="text-2xl font-bold text-[var(--owl-primary)]">1.5W+</p>
            <p className="text-sm text-[var(--owl-text-muted)] mt-1">特色标签</p>
            <p className="text-xs text-[var(--owl-accent)]">专业化</p>
          </div>
        </div>
      </section>
    </div>
  )
}
