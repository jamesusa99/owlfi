import type { Course, Lesson } from '../data/courses'
import { courses as defaultCourses } from '../data/courses'

export interface AdminCourse extends Course {}

export interface AdminNews {
  id: number
  title: string
  summary: string
  status: '已发布' | '草稿'
  publishTime: string
}

export interface AdminOrder {
  id: string
  user: string
  type: '申购' | '赎回'
  amount: number
  status: '已完成' | '处理中' | '已取消'
  time: string
}

export interface AdminForumPost {
  id: number
  title: string
  author: string
  content: string
  replies: number
  status: '正常' | '置顶' | '已删除'
  publishTime: string
}

// Courses
const COURSES_KEY = 'owlfi_admin_courses'
export function getAdminCourses(): AdminCourse[] {
  try {
    const stored = localStorage.getItem(COURSES_KEY)
    if (stored) return JSON.parse(stored)
  } catch {}
  return defaultCourses.map((c) => ({ ...c, lessons: c.lessons.map((l) => ({ ...l })) }))
}
export function saveAdminCourses(data: AdminCourse[]) {
  localStorage.setItem(COURSES_KEY, JSON.stringify(data))
}
export function nextCourseId(list: AdminCourse[]): number {
  return Math.max(0, ...list.map((c) => c.id)) + 1
}
export function nextLessonId(lessons: Lesson[]): number {
  return Math.max(0, ...lessons.map((l) => l.id)) + 1
}

// News
const NEWS_KEY = 'owlfi_admin_news'
const defaultNews: AdminNews[] = [
  { id: 1, title: 'A股市场震荡整理，关注结构性机会', summary: '近期市场波动加大...', status: '已发布', publishTime: '2026-02-23' },
  { id: 2, title: '央行维持利率不变，流动性充裕', summary: '央行发布最新货币政策...', status: '已发布', publishTime: '2026-02-22' },
  { id: 3, title: '基金行业监管新规即将落地', summary: '证监会相关负责人表示...', status: '草稿', publishTime: '2026-02-21' },
]
export function getAdminNews(): AdminNews[] {
  try {
    const stored = localStorage.getItem(NEWS_KEY)
    if (stored) return JSON.parse(stored)
  } catch {}
  return defaultNews
}
export function saveAdminNews(data: AdminNews[]) {
  localStorage.setItem(NEWS_KEY, JSON.stringify(data))
}

// Orders
const ORDERS_KEY = 'owlfi_admin_orders'
const defaultOrders: AdminOrder[] = [
  { id: 'O202602230001', user: '138****1234', type: '申购', amount: 5000, status: '已完成', time: '2026-02-23 10:30' },
  { id: 'O202602230002', user: '139****5678', type: '赎回', amount: 3000, status: '处理中', time: '2026-02-23 11:15' },
  { id: 'O202602220003', user: '137****9012', type: '申购', amount: 10000, status: '已完成', time: '2026-02-22 14:20' },
]
export function getAdminOrders(): AdminOrder[] {
  try {
    const stored = localStorage.getItem(ORDERS_KEY)
    if (stored) return JSON.parse(stored)
  } catch {}
  return defaultOrders
}
export function saveAdminOrders(data: AdminOrder[]) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(data))
}
export function generateOrderId(): string {
  return 'O' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + String(Date.now()).slice(-4)
}

// Forum
const FORUM_KEY = 'owlfi_admin_forum'
const defaultForum: AdminForumPost[] = [
  { id: 1, title: '关于定投策略的讨论', author: '用户****1234', content: '欢迎大家讨论...', replies: 12, status: '正常', publishTime: '2026-02-23' },
  { id: 2, title: '基金选择心得分享', author: '用户****5678', content: '分享一下我的经验...', replies: 8, status: '正常', publishTime: '2026-02-22' },
  { id: 3, title: '市场波动下的应对策略', author: '用户****9012', content: '当前市场...', replies: 25, status: '置顶', publishTime: '2026-02-21' },
]
export function getAdminForum(): AdminForumPost[] {
  try {
    const stored = localStorage.getItem(FORUM_KEY)
    if (stored) return JSON.parse(stored)
  } catch {}
  return defaultForum
}
export function saveAdminForum(data: AdminForumPost[]) {
  localStorage.setItem(FORUM_KEY, JSON.stringify(data))
}
