/**
 * 前端展示用 API：从 Supabase 读取课程、资讯、论坛（只读）
 * 与后台 adminDb 共用同一批表，保证数据一致
 */
import {
  fetchCourses,
  fetchNews,
  fetchForumPosts,
  fetchAnnouncement,
  fetchMarketIndicators,
  fetchHomeServices,
  fetchClassroomConfig,
  fetchRoadshowConfig,
  fetchRoadshowEvents,
  computeRoadshowDisplayStatus,
  fetchInstructors,
  fetchCourseSeries,
  fetchAcademyConfig,
  type AdminCourse,
  type AdminLesson,
} from './adminDb'

// 前端可直接使用 AdminCourse / AdminLesson，形状与 data/courses 的 Course/Lesson 一致
export type Course = AdminCourse
export type Lesson = AdminLesson

export async function fetchCoursesForApp(): Promise<Course[]> {
  return fetchCourses()
}

export async function getCourseForApp(id: number): Promise<Course | null> {
  const courses = await fetchCourses()
  return courses.find((c) => c.id === id) ?? null
}

export interface NewsItem {
  id: number
  title: string
  summary: string
  publishTime: string
}

/** 仅返回已发布的资讯 */
export async function fetchNewsForApp(): Promise<NewsItem[]> {
  const list = await fetchNews()
  return list
    .filter((n) => n.status === '已发布')
    .map((n) => ({
      id: n.id,
      title: n.title,
      summary: n.summary,
      publishTime: n.publishTime,
    }))
}

/** 单条资讯（详情页用，content 用 summary） */
export async function getNewsItemForApp(id: number): Promise<(NewsItem & { content: string }) | null> {
  const list = await fetchNewsForApp()
  const item = list.find((n) => n.id === id) ?? null
  return item ? { ...item, content: item.summary } : null
}

export interface ForumPostItem {
  id: number
  title: string
  author: string
  content: string
  replies: number
  publishTime: string
}

/** 仅返回正常、置顶的帖子（不返回已删除） */
export async function fetchForumPostsForApp(): Promise<ForumPostItem[]> {
  const list = await fetchForumPosts()
  return list
    .filter((p) => p.status !== '已删除')
    .map((p) => ({
      id: p.id,
      title: p.title,
      author: p.author,
      content: p.content,
      replies: p.replies,
      publishTime: p.publishTime,
    }))
}

/** 单条帖子（详情页用） */
export async function getForumPostForApp(id: number): Promise<ForumPostItem | null> {
  const list = await fetchForumPostsForApp()
  return list.find((p) => p.id === id) ?? null
}

/** 系统公告（首页展示，后台在「系统设置」编辑） */
export async function getAnnouncementForApp(): Promise<string> {
  return fetchAnnouncement()
}

/** 市场指标（首页展示，后台在「系统设置」编辑） */
export interface MarketIndicatorsForApp {
  bondEquitySpread: string
  spreadStatus: string
  marketTemperature: string
  tempStatus: string
  updatedAt: string
}

export async function getMarketIndicatorsForApp(): Promise<MarketIndicatorsForApp> {
  return fetchMarketIndicators()
}

/** 首页入口（组合管理、深度调研等，后台可配置） */
export interface HomeServiceForApp {
  id: number
  label: string
  icon: string
  path: string
  sortOrder: number
}

export async function getHomeServicesForApp(): Promise<HomeServiceForApp[]> {
  return fetchHomeServices()
}

/** 投顾学院页面配置（轮播、分类等） */
export async function getClassroomConfigForApp(): Promise<{
  title: string
  categoryTabs: string[]
  heroSeriesId?: number | null
  heroTitle?: string
}> {
  return fetchClassroomConfig()
}

/** 讲师列表（用于课程卡片/详情/专家侧边栏） */
export async function getInstructorsForApp(): Promise<{ id: number; name: string; title: string; avatarUrl?: string | null; bio?: string }[]> {
  const list = await fetchInstructors()
  return list.map((i) => ({ id: i.id, name: i.name, title: i.title, avatarUrl: i.avatarUrl, bio: i.bio }))
}

/** 系列课列表（用于课程归属/Hero 轮播） */
export async function getCourseSeriesForApp(): Promise<{ id: number; title: string; coverUrl?: string | null; desc?: string }[]> {
  const list = await fetchCourseSeries()
  return list.map((s) => ({ id: s.id, title: s.title, coverUrl: s.coverUrl, desc: s.desc }))
}

/** 学院分类配置：知识领域、认证体系选项（用于筛选/标签） */
export async function getAcademyConfigForApp(): Promise<{ knowledgeDomains: string[]; certificationDimensions: string[] }> {
  return fetchAcademyConfig()
}

/** 首页路演日历区块配置 */
export async function getRoadshowConfigForApp(): Promise<{ title: string; path: string; enabled: boolean }> {
  return fetchRoadshowConfig()
}

/** 路演场次列表（日历页用）；status 为根据系统时间自动计算：预热中/直播中/回放中/已结束 */
export interface RoadshowEventForApp {
  id: number
  title: string
  topic?: string
  summary?: string
  content?: string
  speaker?: string
  posterUrl?: string | null
  location?: string
  startTime: string
  date: string
  time: string
  durationMinutes: number
  status: string
  reservationEnabled: boolean
  reservationBaseCount: number
  reservationRealCount: number
  replayUrl?: string | null
  externalUrl?: string | null
  materials?: { type: string; name: string; code?: string; url?: string }[]
}

export async function getRoadshowEventsForApp(): Promise<RoadshowEventForApp[]> {
  const list = await fetchRoadshowEvents()
  return list.map((e) => {
    const [date = '', time = ''] = e.startTime.split(' ')
    const status = computeRoadshowDisplayStatus(e)
    return {
      id: e.id,
      title: e.title,
      topic: e.topic,
      summary: e.summary,
      content: e.content,
      speaker: e.speaker,
      posterUrl: e.posterUrl,
      location: e.location,
      startTime: e.startTime,
      date: date.slice(0, 10),
      time: time.slice(0, 5),
      durationMinutes: e.durationMinutes,
      status,
      reservationEnabled: e.reservationEnabled,
      reservationBaseCount: e.reservationBaseCount,
      reservationRealCount: e.reservationRealCount,
      replayUrl: e.replayUrl,
      externalUrl: e.externalUrl,
      materials: e.materials,
    }
  })
}

/** 单场路演（详情页用） */
export async function getRoadshowEventForApp(id: number): Promise<RoadshowEventForApp | null> {
  const list = await getRoadshowEventsForApp()
  return list.find((e) => e.id === id) ?? null
}
