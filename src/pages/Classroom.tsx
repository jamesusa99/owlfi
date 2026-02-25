import { useState, useEffect, useMemo } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import Logo from '../components/Logo'
import {
  fetchCoursesForApp,
  getClassroomConfigForApp,
  getInstructorsForApp,
  getCourseSeriesForApp,
  type Course,
} from '../lib/publicApi'

const CATEGORY_TABS = ['策略', '基金', '客户经营', '资产配置', '合规']
const PLACEHOLDER_LAST_COURSE = '资产配置逻辑'
const PLACEHOLDER_LAST_LESSON = 3
const LEADERBOARD = [
  { name: '张三', hours: 99 },
  { name: '李四', hours: 85 },
]

function getInstructorName(
  instructorId: number | null | undefined,
  instructors: { id: number; name: string }[]
) {
  if (instructorId == null) return ''
  const i = instructors.find((x) => x.id === instructorId)
  return i?.name ?? ''
}

export default function Classroom() {
  const navigate = useNavigate()
  const [config, setConfig] = useState<{ title: string; categoryTabs: string[] } | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [instructors, setInstructors] = useState<{ id: number; name: string; title: string; avatarUrl?: string | null; bio?: string }[]>([])
  const [seriesList, setSeriesList] = useState<{ id: number; title: string; coverUrl?: string | null; desc?: string }[]>([])
  const [selectedCat, setSelectedCat] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAllCourses, setShowAllCourses] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    Promise.all([
      fetchCoursesForApp(),
      getClassroomConfigForApp(),
      getInstructorsForApp(),
      getCourseSeriesForApp(),
    ])
      .then(([coursesData, cfg, inst, ser]) => {
        if (!cancelled) {
          setCourses(coursesData)
          setConfig(cfg)
          setInstructors(inst)
          setSeriesList(ser)
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e?.message ?? '加载失败')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const categoryTabs = config?.categoryTabs?.length ? config.categoryTabs : CATEGORY_TABS

  const filteredCourses = useMemo(() => {
    let list = courses
    if (selectedCat) {
      list = courses.filter(
        (c) =>
          c.knowledgeDomain === selectedCat ||
          c.certificationDimension === selectedCat ||
          c.tag === selectedCat
      )
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          getInstructorName(c.instructorId, instructors).toLowerCase().includes(q)
      )
    }
    return list
  }, [courses, selectedCat, searchQuery, instructors])

  const displayCourses = showAllCourses ? filteredCourses : filteredCourses.slice(0, 3)
  const heroSeries = seriesList[0]

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center text-red-600">
        {error}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* 顶部导航：LOGO + 首页 课程库 路演 证书中心 + 头像/学时 + 搜索 */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm safe-area-inset-top">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <NavLink to="/" className="flex items-center gap-2">
              <Logo size={28} />
            </NavLink>
            <nav className="hidden md:flex items-center gap-6 text-sm text-[#1a2b3c]">
              <NavLink to="/" className="hover:text-[var(--owl-primary)]">首页</NavLink>
              <NavLink to="/classroom" className="text-[var(--owl-primary)] font-medium">课程库</NavLink>
              <NavLink to="/roadshow" className="hover:text-[var(--owl-primary)]">路演</NavLink>
              <a href="#" className="hover:text-[var(--owl-primary)]">证书中心</a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-2 py-1 text-sm text-[#6b7c8d]">
              <span>⏱ 0h</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[var(--owl-primary)]/20 flex items-center justify-center text-[var(--owl-primary)] text-sm">
              ?
            </div>
            <div className="relative w-32 sm:w-40">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索"
                className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--owl-primary)]"
              />
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* 顶部轮播：年度投研课 */}
        <section className="mb-6 rounded-2xl overflow-hidden shadow-md">
          <div
            onClick={() => heroSeries && navigate('/classroom')}
            className="relative aspect-[3/1] min-h-[140px] bg-gradient-to-r from-[var(--owl-primary)] to-[#2d5a87] cursor-pointer"
          >
            {heroSeries?.coverUrl ? (
              <img src={heroSeries.coverUrl} alt="" className="w-full h-full object-cover" />
            ) : null}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/40 to-transparent">
              <h2 className="text-xl md:text-2xl font-bold text-white">
                {heroSeries?.title ?? '年度投研课'}
              </h2>
            </div>
          </div>
        </section>

        {/* 正在进行：您上次学到...  [继续学习] */}
        <section className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-amber-500 text-white text-xs rounded">正在进行</span>
            <span className="text-[#1a2b3c]">
              &gt;&gt; 您上次学到《{PLACEHOLDER_LAST_COURSE}》第{PLACEHOLDER_LAST_LESSON}节
            </span>
          </div>
          <button
            onClick={() => {
              const first = courses[0]
              if (first?.lessons?.[0]?.id) navigate(`/classroom/course/${first.id}/learn/${first.lessons[0].id}`)
              else navigate('/classroom')
            }}
            className="px-4 py-2 bg-[var(--owl-accent)] text-[#1a2b3c] font-medium rounded-lg hover:bg-[#e5b94d] transition-colors whitespace-nowrap"
          >
            继续学习
          </button>
        </section>

        {/* 分类查找 */}
        <section className="mb-6">
          <p className="text-sm text-[#6b7c8d] mb-3">分类查找：</p>
          <div className="flex flex-wrap gap-2">
            {categoryTabs.map((cat) => {
              const isSelected = selectedCat === cat
              const btnClass = isSelected
                ? 'px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-[var(--owl-primary)] text-white'
                : 'px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-white text-[#6b7c8d] border border-gray-200 hover:border-[var(--owl-primary)]'
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(isSelected ? '' : cat)}
                  className={btnClass}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </section>

        {/* 课程卡片 + 更多 */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#1a2b3c]">精选课程</h3>
            <button
              onClick={() => setShowAllCourses(!showAllCourses)}
              className="text-sm text-[var(--owl-primary)] font-medium"
            >
              {showAllCourses ? '收起' : '更多'} ›
            </button>
          </div>
          {loading ? (
            <p className="text-[#6b7c8d] py-8 text-center">加载中...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {displayCourses.map((course) => (
                <div
                  key={course.id}
                  onClick={() => navigate(`/classroom/course/${course.id}`)}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-50"
                >
                  <div className="aspect-video bg-[var(--owl-primary)]/5 flex items-center justify-center overflow-hidden">
                    {course.coverUrl ? (
                      <img src={course.coverUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl text-[var(--owl-primary)]/30">{course.thumbnail || '📖'}</span>
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="font-medium text-[#1a2b3c] line-clamp-2 mb-2">{course.title}</h4>
                    <p className="text-xs text-[#6b7c8d]">
                      讲师 {getInstructorName(course.instructorId, instructors) || '—'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="grid md:grid-cols-2 gap-6">
          <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-50">
            <h3 className="font-semibold text-[#1a2b3c] mb-4">名师专栏</h3>
            <div className="space-y-4">
              {instructors.slice(0, 4).map((inst) => {
                const nameTitle = inst.name + ' - ' + inst.title
                return (
                  <div
                    key={inst.id}
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 -mx-2 px-2 py-2 rounded-lg"
                    onClick={() => navigate('/classroom')}
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                      {inst.avatarUrl ? (
                        <img src={inst.avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg text-[var(--owl-primary)]">
                          {inst.name.slice(0, 1)}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-[#1a2b3c]">{nameTitle}</p>
                      {inst.bio ? <p className="text-xs text-[#6b7c8d] truncate max-w-[200px]">{inst.bio}</p> : null}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
          <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-50">
            <h3 className="font-semibold text-[#1a2b3c] mb-4">学习排行</h3>
            <div className="space-y-3">
              {LEADERBOARD.map((item, idx) => {
                const rankClass = idx === 0 ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600'
                return (
                  <div key={item.name} className="flex items-center gap-3">
                    <span className={'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ' + rankClass}>
                      {idx + 1}
                    </span>
                    <span className="font-medium text-[#1a2b3c]">{item.name}</span>
                    <span className="text-sm text-[#6b7c8d] ml-auto">{item.hours}h</span>
                  </div>
                )
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}