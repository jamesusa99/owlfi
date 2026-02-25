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

export type CourseDifficulty = '初级' | '中级' | '高级'
export type CourseVisibility = '全部' | '试听' | '会员' | '白名单'

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
  instructorId?: number | null
  coverUrl?: string | null
  knowledgeDomain?: string
  certificationDimension?: string
  seriesId?: number | null
  difficulty?: CourseDifficulty
  pdfUrl?: string | null
  visibility?: CourseVisibility
}

export interface AdminInstructor {
  id: number
  name: string
  avatarUrl?: string | null
  title: string
  bio: string
  sortOrder: number
}

export interface AdminCourseSeries {
  id: number
  title: string
  coverUrl?: string | null
  desc: string
  sortOrder: number
}

export type RoadshowStatus = '预热中' | '直播中' | '回放中' | '已结束'

/** 路演资料项：基金或研报 */
export interface RoadshowMaterial {
  type: 'fund' | 'report'
  name: string
  code?: string
  url?: string
}

export interface AdminRoadshowEvent {
  id: number
  title: string
  topic?: string
  content?: string
  summary?: string
  speaker?: string
  posterUrl?: string | null
  location?: string
  startTime: string
  durationMinutes: number
  status: RoadshowStatus
  externalUrl?: string | null
  h5Config?: Record<string, unknown>
  reservationEnabled: boolean
  reservationBaseCount: number
  reservationRealCount: number
  replayUrl?: string | null
  materials?: RoadshowMaterial[]
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
    instructorId: r.instructor_id != null ? Number(r.instructor_id) : null,
    coverUrl: r.cover_url != null ? String(r.cover_url) : null,
    knowledgeDomain: String(r.knowledge_domain ?? ''),
    certificationDimension: String(r.certification_dimension ?? ''),
    seriesId: r.series_id != null ? Number(r.series_id) : null,
    difficulty: (r.difficulty as AdminCourse['difficulty']) || '初级',
    pdfUrl: r.pdf_url != null ? String(r.pdf_url) : null,
    visibility: (r.visibility as AdminCourse['visibility']) || '全部',
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
    instructor_id: course.instructorId ?? null,
    cover_url: course.coverUrl ?? null,
    knowledge_domain: course.knowledgeDomain ?? '',
    certification_dimension: course.certificationDimension ?? '',
    series_id: course.seriesId ?? null,
    difficulty: course.difficulty ?? '初级',
    pdf_url: course.pdfUrl ?? null,
    visibility: course.visibility ?? '全部',
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

// ---------- 讲师库 ----------
function instructorFromRow(r: Record<string, unknown>): AdminInstructor {
  return {
    id: Number(r.id),
    name: String(r.name ?? ''),
    avatarUrl: r.avatar_url != null ? String(r.avatar_url) : null,
    title: String(r.title ?? ''),
    bio: String(r.bio ?? ''),
    sortOrder: Number(r.sort_order ?? 0),
  }
}

export async function fetchInstructors(): Promise<AdminInstructor[]> {
  const { data, error } = await supabase.from('instructors').select('*').order('sort_order', { ascending: true })
  if (error) throw error
  return (data ?? []).map(instructorFromRow)
}

export async function saveInstructor(inst: AdminInstructor): Promise<void> {
  const row = {
    name: inst.name ?? '',
    avatar_url: inst.avatarUrl ?? null,
    title: inst.title ?? '',
    bio: inst.bio ?? '',
    sort_order: inst.sortOrder ?? 0,
  }
  if (inst.id && inst.id > 0) {
    const { error } = await supabase.from('instructors').update(row).eq('id', inst.id)
    if (error) throw error
  } else {
    const { error } = await supabase.from('instructors').insert(row)
    if (error) throw error
  }
}

export async function deleteInstructor(id: number): Promise<void> {
  const { error } = await supabase.from('instructors').delete().eq('id', id)
  if (error) throw error
}

// ---------- 系列课 ----------
function courseSeriesFromRow(r: Record<string, unknown>): AdminCourseSeries {
  return {
    id: Number(r.id),
    title: String(r.title ?? ''),
    coverUrl: r.cover_url != null ? String(r.cover_url) : null,
    desc: String(r.desc ?? ''),
    sortOrder: Number(r.sort_order ?? 0),
  }
}

export async function fetchCourseSeries(): Promise<AdminCourseSeries[]> {
  const { data, error } = await supabase.from('course_series').select('*').order('sort_order', { ascending: true })
  if (error) throw error
  return (data ?? []).map(courseSeriesFromRow)
}

export async function saveCourseSeries(series: AdminCourseSeries): Promise<void> {
  const row = {
    title: series.title ?? '',
    cover_url: series.coverUrl ?? null,
    desc: series.desc ?? '',
    sort_order: series.sortOrder ?? 0,
  }
  if (series.id && series.id > 0) {
    const { error } = await supabase.from('course_series').update(row).eq('id', series.id)
    if (error) throw error
  } else {
    const { error } = await supabase.from('course_series').insert(row)
    if (error) throw error
  }
}

export async function deleteCourseSeries(id: number): Promise<void> {
  const { error } = await supabase.from('course_series').delete().eq('id', id)
  if (error) throw error
}

// ---------- 学院分类配置（知识领域、认证体系） ----------
export interface AcademyConfig {
  knowledgeDomains: string[]
  certificationDimensions: string[]
}

export async function fetchAcademyConfig(): Promise<AcademyConfig> {
  const { data, error } = await supabase.from('academy_config').select('*').eq('id', 1).single()
  if (error || !data) {
    return { knowledgeDomains: [], certificationDimensions: [] }
  }
  const kd = data.knowledge_domains
  const cd = data.certification_dimensions
  return {
    knowledgeDomains: Array.isArray(kd) ? kd.map(String) : [],
    certificationDimensions: Array.isArray(cd) ? cd.map(String) : [],
  }
}

export async function saveAcademyConfig(config: AcademyConfig): Promise<void> {
  const { error } = await supabase
    .from('academy_config')
    .upsert(
      {
        id: 1,
        knowledge_domains: config.knowledgeDomains ?? [],
        certification_dimensions: config.certificationDimensions ?? [],
      },
      { onConflict: 'id' }
    )
  if (error) throw error
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

function toOrderTime(s: string | undefined): string {
  if (!s || typeof s !== 'string') return new Date().toISOString().slice(0, 19).replace('T', ' ')
  const normalized = s.trim().replace(' ', 'T')
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(normalized)) {
    return normalized.slice(0, 19).replace('T', ' ')
  }
  return new Date().toISOString().slice(0, 19).replace('T', ' ')
}

export async function saveOrder(order: AdminOrder): Promise<void> {
  const orderTime = toOrderTime(order.time)
  const row = {
    id: (order.id || '').trim() || generateOrderId(),
    user_display: order.user ?? '',
    type: order.type ?? '申购',
    amount: Number(order.amount) || 0,
    status: order.status ?? '处理中',
    order_time: orderTime.replace(' ', 'T') + (orderTime.length <= 16 ? ':00' : ''),
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

// ---------- 系统公告 ----------
export async function fetchAnnouncement(): Promise<string> {
  const { data, error } = await supabase.from('system_announcement').select('content').eq('id', 1).single()
  if (error) return ''
  return String(data?.content ?? '')
}

export async function saveAnnouncement(content: string): Promise<void> {
  const { error } = await supabase.from('system_announcement').upsert({ id: 1, content: content ?? '' }, { onConflict: 'id' })
  if (error) throw error
}

// ---------- 市场指标 ----------
export interface MarketIndicatorsRow {
  bondEquitySpread: string
  spreadStatus: string
  marketTemperature: string
  tempStatus: string
  updatedAt: string
}

export async function fetchMarketIndicators(): Promise<MarketIndicatorsRow> {
  const { data, error } = await supabase.from('market_indicators').select('*').eq('id', 1).single()
  if (error || !data) {
    return {
      bondEquitySpread: '4.40%',
      spreadStatus: '较好',
      marketTemperature: '66.12°C',
      tempStatus: '偏热',
      updatedAt: '',
    }
  }
  return {
    bondEquitySpread: String(data.bond_equity_spread ?? '4.40%'),
    spreadStatus: String(data.spread_status ?? '较好'),
    marketTemperature: String(data.market_temperature ?? '66.12°C'),
    tempStatus: String(data.temp_status ?? '偏热'),
    updatedAt: data.updated_at ? new Date(data.updated_at).toISOString().slice(0, 10) : '',
  }
}

export async function saveMarketIndicators(row: MarketIndicatorsRow): Promise<void> {
  const { error } = await supabase
    .from('market_indicators')
    .upsert(
      {
        id: 1,
        bond_equity_spread: row.bondEquitySpread ?? '4.40%',
        spread_status: row.spreadStatus ?? '较好',
        market_temperature: row.marketTemperature ?? '66.12°C',
        temp_status: row.tempStatus ?? '偏热',
      },
      { onConflict: 'id' }
    )
  if (error) throw error
}

// ---------- 首页配置 ----------
export interface HomeServiceRow {
  id: number
  label: string
  icon: string
  path: string
  sortOrder: number
}

export async function fetchHomeServices(): Promise<HomeServiceRow[]> {
  const { data, error } = await supabase.from('home_services').select('*').order('sort_order', { ascending: true })
  if (error) return []
  return (data ?? []).map((r) => ({
    id: Number(r.id),
    label: String(r.label ?? ''),
    icon: String(r.icon ?? '📌'),
    path: String(r.path ?? '#'),
    sortOrder: Number(r.sort_order ?? 0),
  }))
}

export async function saveHomeService(row: HomeServiceRow): Promise<HomeServiceRow> {
  const payload = {
    label: row.label,
    icon: row.icon,
    path: row.path,
    sort_order: row.sortOrder,
  }
  if (row.id && row.id > 0) {
    const { data, error } = await supabase.from('home_services').update(payload).eq('id', row.id).select('*').single()
    if (error) throw error
    return { id: data.id, label: data.label, icon: data.icon, path: data.path, sortOrder: data.sort_order }
  } else {
    const { data, error } = await supabase.from('home_services').insert(payload).select('*').single()
    if (error) throw error
    return { id: data.id, label: data.label, icon: data.icon, path: data.path, sortOrder: data.sort_order }
  }
}

export async function deleteHomeService(id: number): Promise<void> {
  const { error } = await supabase.from('home_services').delete().eq('id', id)
  if (error) throw error
}

export interface HomeClassroomConfig {
  title: string
  categoryTabs: string[]
}

export async function fetchClassroomConfig(): Promise<HomeClassroomConfig> {
  const { data, error } = await supabase.from('home_classroom_config').select('*').eq('id', 1).single()
  if (error || !data) return { title: '投顾学院', categoryTabs: ['基金经理精选', '基金比较研究', 'ETF策略研究', '绝对收益策略', '基金组合配置'] }
  const tabs = data.category_tabs
  return {
    title: String(data.title ?? '投顾学院'),
    categoryTabs: Array.isArray(tabs) ? tabs.map(String) : [],
  }
}

export async function saveClassroomConfig(config: HomeClassroomConfig): Promise<void> {
  const { error } = await supabase
    .from('home_classroom_config')
    .upsert({ id: 1, title: config.title ?? '投顾学院', category_tabs: config.categoryTabs ?? [] }, { onConflict: 'id' })
  if (error) throw error
}

export interface HomeRoadshowConfig {
  title: string
  path: string
  enabled: boolean
}

export async function fetchRoadshowConfig(): Promise<HomeRoadshowConfig> {
  const { data, error } = await supabase.from('home_roadshow_config').select('*').eq('id', 1).single()
  if (error || !data) return { title: '路演日历', path: '/roadshow', enabled: true }
  return {
    title: String(data.title ?? '路演日历'),
    path: String(data.path ?? '/roadshow'),
    enabled: Boolean(data.enabled),
  }
}

export async function saveRoadshowConfig(config: HomeRoadshowConfig): Promise<void> {
  const { error } = await supabase
    .from('home_roadshow_config')
    .upsert({ id: 1, title: config.title ?? '路演日历', path: config.path ?? '/roadshow', enabled: config.enabled !== false }, { onConflict: 'id' })
  if (error) throw error
}

// ---------- 路演场次 (roadshow_events) ----------
function roadshowEventFromRow(r: Record<string, unknown>): AdminRoadshowEvent {
  const t = r.start_time
  const startStr = typeof t === 'string' ? t.slice(0, 19).replace('T', ' ') : t instanceof Date ? t.toISOString().slice(0, 19).replace('T', ' ') : ''
  return {
    id: Number(r.id),
    title: String(r.title ?? ''),
    topic: String(r.topic ?? ''),
    content: String(r.content ?? ''),
    summary: String(r.summary ?? ''),
    speaker: String(r.speaker ?? ''),
    posterUrl: r.poster_url != null ? String(r.poster_url) : null,
    location: String(r.location ?? ''),
    startTime: startStr,
    durationMinutes: Number(r.duration_minutes ?? 60),
    status: (r.status as RoadshowStatus) || '预热中',
    externalUrl: r.external_url != null ? String(r.external_url) : null,
    h5Config: (r.h5_config as Record<string, unknown>) ?? undefined,
    reservationEnabled: Boolean(r.reservation_enabled),
    reservationBaseCount: Number(r.reservation_base_count ?? 0),
    reservationRealCount: Number(r.reservation_real_count ?? 0),
    replayUrl: r.replay_url != null ? String(r.replay_url) : null,
    materials: Array.isArray(r.materials)
      ? (r.materials as RoadshowMaterial[]).map((m) => ({
          type: (m?.type === 'fund' || m?.type === 'report' ? m.type : 'report') as 'fund' | 'report',
          name: String(m?.name ?? ''),
          code: m?.code != null ? String(m.code) : undefined,
          url: m?.url != null ? String(m.url) : undefined,
        }))
      : [],
  }
}

export async function fetchRoadshowEvents(): Promise<AdminRoadshowEvent[]> {
  try {
    const { data, error } = await supabase.from('roadshow_events').select('*').order('start_time', { ascending: false })
    if (error) throw error
    return (data ?? []).map(roadshowEventFromRow)
  } catch {
    return []
  }
}

export async function saveRoadshowEvent(ev: AdminRoadshowEvent): Promise<void> {
  const startIso = ev.startTime.trim().replace(' ', 'T').slice(0, 19)
  const row = {
    title: ev.title,
    topic: ev.topic ?? '',
    content: ev.content ?? '',
    summary: ev.summary ?? '',
    speaker: ev.speaker ?? '',
    poster_url: ev.posterUrl ?? null,
    location: ev.location ?? '',
    start_time: startIso + (startIso.length <= 16 ? ':00' : ''),
    duration_minutes: ev.durationMinutes,
    status: ev.status,
    external_url: ev.externalUrl ?? null,
    h5_config: ev.h5Config ?? {},
    reservation_enabled: ev.reservationEnabled,
    reservation_base_count: ev.reservationBaseCount,
    reservation_real_count: ev.reservationRealCount,
    replay_url: ev.replayUrl ?? null,
    materials: ev.materials ?? [],
  }
  if (ev.id && ev.id > 0) {
    const { error } = await supabase.from('roadshow_events').update(row).eq('id', ev.id)
    if (error) throw error
  } else {
    const { error } = await supabase.from('roadshow_events').insert(row)
    if (error) throw error
  }
}

export async function deleteRoadshowEvent(id: number): Promise<void> {
  const { error } = await supabase.from('roadshow_events').delete().eq('id', id)
  if (error) throw error
}

/** 根据系统时间计算展示状态：未开始→预热中，进行中→直播中，已结束且有回放→回放中，否则已结束 */
export function computeRoadshowDisplayStatus(ev: {
  startTime: string
  durationMinutes: number
  replayUrl?: string | null
}): RoadshowStatus {
  const start = parseRoadshowStartTime(ev.startTime)
  if (!start) return '预热中'
  const end = new Date(start.getTime() + ev.durationMinutes * 60 * 1000)
  const now = new Date()
  if (now < start) return '预热中'
  if (now <= end) return '直播中'
  return ev.replayUrl ? '回放中' : '已结束'
}

function parseRoadshowStartTime(s: string): Date | null {
  if (!s || typeof s !== 'string') return null
  const normalized = s.trim().replace(' ', 'T').slice(0, 19)
  const d = new Date(normalized)
  return isNaN(d.getTime()) ? null : d
}

/** 检测两场是否时间冲突（同一天且时间段重叠） */
export function roadshowEventsConflict(
  a: { startTime: string; durationMinutes: number },
  b: { startTime: string; durationMinutes: number }
): boolean {
  const startA = parseRoadshowStartTime(a.startTime)
  const startB = parseRoadshowStartTime(b.startTime)
  if (!startA || !startB) return false
  const dateStr = (d: Date) => d.toISOString().slice(0, 10)
  if (dateStr(startA) !== dateStr(startB)) return false
  const endA = startA.getTime() + a.durationMinutes * 60 * 1000
  const endB = startB.getTime() + b.durationMinutes * 60 * 1000
  return startA.getTime() < endB && endA > startB.getTime()
}

/** 将路演转为投顾学院课程（标题、回放/外链作为视频素材） */
export async function createCourseFromRoadshowEvent(ev: AdminRoadshowEvent): Promise<number> {
  const videoUrl = ev.replayUrl || ev.externalUrl || ''
  const newCourse: AdminCourse = {
    id: 0,
    title: ev.title,
    type: '视频',
    duration: `${ev.durationMinutes}分钟`,
    tag: '入门',
    thumbnail: '📖',
    desc: `由路演「${ev.title}」转为课程。`,
    lessons: [{ id: 1, title: '回放', content: '', videoBvid: undefined }],
    visibility: '全部',
  }
  if (videoUrl) {
    try {
      const bvMatch = videoUrl.match(/(?:bv|BV)([A-Za-z0-9]+)/i)
      if (bvMatch) newCourse.lessons[0].videoBvid = (bvMatch[0].startsWith('bv') ? 'BV' : '') + bvMatch[1]
    } catch {
      // 非 B 站链接时仅保留 desc 中的说明，课程可后续编辑补充视频
    }
  }
  await saveCourse(newCourse)
  const list = await fetchCourses()
  const created = list
    .filter((c) => c.title === ev.title && c.desc?.includes('由路演'))
    .sort((a, b) => b.id - a.id)[0]
  return created?.id ?? 0
}

// ---------- H5 抓取数据 (h5_scraped_data) ----------
export interface H5ScrapedRow {
  id: number
  category: string
  subCategory: string
  title: string
  content: string
  url?: string
  metadata: Record<string, unknown>
  sourcePage: string
  scrapedAt: string
}

export async function fetchH5ScrapedData(category?: string): Promise<H5ScrapedRow[]> {
  let q = supabase.from('h5_scraped_data').select('*').order('scraped_at', { ascending: false })
  if (category) q = q.eq('category', category)
  const { data, error } = await q
  if (error) return []
  return (data ?? []).map((r) => ({
    id: Number(r.id),
    category: String(r.category ?? ''),
    subCategory: String(r.sub_category ?? ''),
    title: String(r.title ?? ''),
    content: String(r.content ?? ''),
    url: r.url ? String(r.url) : undefined,
    metadata: (r.metadata as Record<string, unknown>) ?? {},
    sourcePage: String(r.source_page ?? ''),
    scrapedAt: r.scraped_at ? new Date(r.scraped_at).toISOString() : '',
  }))
}
