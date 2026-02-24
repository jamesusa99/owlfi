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
