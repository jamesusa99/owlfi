import { supabase } from './supabase'

// ---------- 类型（与后台一致） ----------
export interface AdminUser {
  id: string
  phone: string
  nickname: string
  regTime: string
  orders: number
  status: '正常' | '禁用'
}

export interface AdminLesson {
  id: number
  title: string
  content: string
  videoBvid?: string
}

export interface AdminCourse {
  id: number
  title: string
  type: '视频' | '图文'
  duration: string
  tag: string
  thumbnail: string
  desc: string
  videoBvid?: string
  lessons: AdminLesson[]
}

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

// ---------- 用户 ----------
function userFromRow(r: Record<string, unknown>): AdminUser {
  return {
    id: String(r.id),
    phone: String(r.phone ?? ''),
    nickname: String(r.nickname ?? ''),
    regTime: String(r.reg_time ?? '').slice(0, 10),
    orders: Number(r.orders_count ?? 0),
    status: (r.status as AdminUser['status']) || '正常',
  }
}

export async function fetchUsers(): Promise<AdminUser[]> {
  const { data, error } = await supabase.from('admin_users').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map(userFromRow)
}

export async function saveUser(user: AdminUser): Promise<void> {
  const row = {
    id: user.id,
    phone: user.phone,
    nickname: user.nickname,
    reg_time: user.regTime,
    orders_count: user.orders,
    status: user.status,
  }
  const { error } = await supabase.from('admin_users').upsert(row, { onConflict: 'id' })
  if (error) throw error
}

export async function deleteUser(id: string): Promise<void> {
  const { error } = await supabase.from('admin_users').delete().eq('id', id)
  if (error) throw error
}

export function generateUserId(): string {
  return 'U' + Date.now().toString(36).toUpperCase()
}

// ---------- 课程 + 课时 ----------
function lessonFromRow(r: Record<string, unknown>): AdminLesson {
  return {
    id: Number(r.id),
    title: String(r.title ?? ''),
    content: String(r.content ?? ''),
    videoBvid: r.video_bvid ? String(r.video_bvid) : undefined,
  }
}

function courseFromRow(r: Record<string, unknown>, lessons: AdminLesson[]): AdminCourse {
  return {
    id: Number(r.id),
    title: String(r.title ?? ''),
    type: (r.type as AdminCourse['type']) || '视频',
    duration: String(r.duration ?? ''),
    tag: String(r.tag ?? '入门'),
    thumbnail: String(r.thumbnail ?? '📖'),
    desc: String(r.desc ?? ''),
    videoBvid: r.video_bvid ? String(r.video_bvid) : undefined,
    lessons,
  }
}

export async function fetchCourses(): Promise<AdminCourse[]> {
  const { data: coursesData, error: e1 } = await supabase.from('courses').select('*').order('id', { ascending: true })
  if (e1) throw e1
  if (!coursesData?.length) return []

  const ids = coursesData.map((c) => c.id)
  const { data: lessonsData, error: e2 } = await supabase.from('lessons').select('*').in('course_id', ids).order('sort_order', { ascending: true })
  if (e2) throw e2

  const byCourse: Record<number, AdminLesson[]> = {}
  for (const l of lessonsData ?? []) {
    const cid = l.course_id as number
    if (!byCourse[cid]) byCourse[cid] = []
    byCourse[cid].push(lessonFromRow(l))
  }

  return coursesData.map((c) => courseFromRow(c, byCourse[c.id] ?? []))
}

export async function saveCourse(course: AdminCourse): Promise<void> {
  const isNew = !course.id || course.id === 0
  const courseRow: Record<string, unknown> = {
    title: course.title,
    type: course.type,
    duration: course.duration,
    tag: course.tag,
    thumbnail: course.thumbnail,
    desc: course.desc,
    video_bvid: course.videoBvid || null,
  }
  if (!isNew) courseRow.id = course.id

  let courseId: number
  if (isNew) {
    const { data, error } = await supabase.from('courses').insert(courseRow).select('id').single()
    if (error) throw error
    courseId = data.id
  } else {
    courseId = course.id
    const { error } = await supabase.from('courses').update(courseRow).eq('id', courseId)
    if (error) throw error
  }

  await supabase.from('lessons').delete().eq('course_id', courseId)

  if (course.lessons?.length) {
    const rows = course.lessons.map((l, i) => ({
      course_id: courseId,
      sort_order: i,
      title: l.title,
      content: l.content,
      video_bvid: l.videoBvid || null,
    }))
    const { error: e2 } = await supabase.from('lessons').insert(rows)
    if (e2) throw e2
  }
}

export async function deleteCourse(id: number): Promise<void> {
  const { error } = await supabase.from('courses').delete().eq('id', id)
  if (error) throw error
}

export function nextLessonId(lessons: AdminLesson[]): number {
  return Math.max(0, ...lessons.map((l) => l.id)) + 1
}

// ---------- 资讯 ----------
function newsFromRow(r: Record<string, unknown>): AdminNews {
  return {
    id: Number(r.id),
    title: String(r.title ?? ''),
    summary: String(r.summary ?? ''),
    status: (r.status as AdminNews['status']) || '草稿',
    publishTime: String(r.publish_time ?? '').slice(0, 10),
  }
}

export async function fetchNews(): Promise<AdminNews[]> {
  const { data, error } = await supabase.from('news').select('*').order('id', { ascending: false })
  if (error) throw error
  return (data ?? []).map(newsFromRow)
}

function toDateString(s: string | undefined): string {
  if (s && /^\d{4}-\d{2}-\d{2}$/.test(s)) return s
  return new Date().toISOString().slice(0, 10)
}

export async function saveNewsItem(item: AdminNews): Promise<AdminNews> {
  const row = {
    title: item.title ?? '',
    summary: item.summary ?? '',
    status: item.status ?? '草稿',
    publish_time: toDateString(item.publishTime),
  }
  if (item.id && item.id > 0) {
    const { data, error } = await supabase.from('news').update(row).eq('id', item.id).select('*').single()
    if (error) throw error
    return newsFromRow(data)
  } else {
    const { data, error } = await supabase.from('news').insert(row).select('*').single()
    if (error) throw error
    return newsFromRow(data)
  }
}

export async function deleteNews(id: number): Promise<void> {
  const { error } = await supabase.from('news').delete().eq('id', id)
  if (error) throw error
}

// ---------- 订单 ----------
function orderFromRow(r: Record<string, unknown>): AdminOrder {
  const t = r.order_time
  const timeStr = typeof t === 'string' ? t.slice(0, 16).replace('T', ' ') : ''
  return {
    id: String(r.id),
    user: String(r.user_display ?? ''),
    type: (r.type as AdminOrder['type']) || '申购',
    amount: Number(r.amount ?? 0),
    status: (r.status as AdminOrder['status']) || '处理中',
    time: timeStr,
  }
}

export async function fetchOrders(): Promise<AdminOrder[]> {
  const { data, error } = await supabase.from('orders').select('*').order('order_time', { ascending: false })
  if (error) throw error
  return (data ?? []).map(orderFromRow)
}

export async function saveOrder(order: AdminOrder): Promise<void> {
  const row = {
    id: order.id,
    user_display: order.user,
    type: order.type,
    amount: order.amount,
    status: order.status,
    order_time: order.time.replace(' ', 'T') + (order.time.length <= 16 ? ':00' : ''),
  }
  const { error } = await supabase.from('orders').upsert(row, { onConflict: 'id' })
  if (error) throw error
}

export async function deleteOrder(id: string): Promise<void> {
  const { error } = await supabase.from('orders').delete().eq('id', id)
  if (error) throw error
}

export function generateOrderId(): string {
  return 'O' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + String(Date.now()).slice(-4)
}

// ---------- 论坛 ----------
function forumPostFromRow(r: Record<string, unknown>): AdminForumPost {
  return {
    id: Number(r.id),
    title: String(r.title ?? ''),
    author: String(r.author ?? ''),
    content: String(r.content ?? ''),
    replies: Number(r.replies_count ?? 0),
    status: (r.status as AdminForumPost['status']) || '正常',
    publishTime: String(r.publish_time ?? '').slice(0, 10),
  }
}

export async function fetchForumPosts(): Promise<AdminForumPost[]> {
  const { data, error } = await supabase.from('forum_posts').select('*').order('id', { ascending: false })
  if (error) throw error
  return (data ?? []).map(forumPostFromRow)
}

export async function saveForumPost(post: AdminForumPost): Promise<AdminForumPost> {
  const row = {
    title: post.title,
    author: post.author,
    content: post.content,
    replies_count: post.replies,
    status: post.status,
    publish_time: post.publishTime,
  }
  if (post.id && post.id > 0) {
    const { data, error } = await supabase.from('forum_posts').update(row).eq('id', post.id).select('*').single()
    if (error) throw error
    return forumPostFromRow(data)
  } else {
    const { data, error } = await supabase.from('forum_posts').insert(row).select('*').single()
    if (error) throw error
    return forumPostFromRow(data)
  }
}

export async function deleteForumPost(id: number): Promise<void> {
  const { error } = await supabase.from('forum_posts').delete().eq('id', id)
  if (error) throw error
}
