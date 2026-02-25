#!/usr/bin/env node
/**
 * 从 https://h5app.owl-portfolio.com/ 抓取数据并写入 Supabase
 * 运行: npm run scrape:h5
 * 需先执行迁移 008_h5_scraped_data.sql
 */
import 'dotenv/config'
import { firefox } from 'playwright'
import { createClient } from '@supabase/supabase-js'

const BASE_URL = 'https://h5app.owl-portfolio.com/'
const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('请设置 .env 中的 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function insertScraped(rows) {
  if (rows.length === 0) return
  const { data, error } = await supabase.from('h5_scraped_data').insert(rows).select()
  if (error) {
    console.error('写入失败:', error.message)
    return
  }
  console.log(`写入 ${rows.length} 条`)
}

async function scrape() {
  console.log('启动浏览器...')
  const browser = await firefox.launch({ headless: true })
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
    viewport: { width: 390, height: 844 },
  })
  const page = await context.newPage()

  const allRows = []

  try {
    // 首页
    console.log('抓取首页...')
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 12000 })
    await page.waitForTimeout(2000)

    const homeText = await page.evaluate(() => {
      const body = document.body?.innerText || ''
      const title = document.title || ''
      return { body: body.slice(0, 5000), title }
    })
    if (homeText.body?.trim()) {
      allRows.push({
        category: '首页',
        sub_category: '',
        title: homeText.title || '智能投顾-综合策略管理平台',
        content: homeText.body,
        url: BASE_URL,
        metadata: {},
        source_page: 'index',
      })
    }

    // 尝试点击底部导航并抓取各模块
    const navItems = [
      { selector: 'text=微课堂', page: 'micro-class', category: '微课堂' },
      { selector: 'text=组合', page: 'portfolio', category: '组合' },
      { selector: 'text=工具', page: 'tools', category: '工具' },
      { selector: 'text=我的', page: 'mine', category: '我的' },
    ]

    for (const nav of navItems) {
      try {
        const btn = page.locator(nav.selector).first()
        if (await btn.count() > 0) {
          await btn.click()
          await page.waitForTimeout(1500)
          const text = await page.evaluate(() => document.body?.innerText || '')
          if (text.trim() && !text.includes('The connection timed out')) {
            allRows.push({
              category: nav.category,
              sub_category: '',
              title: nav.category,
              content: text.slice(0, 8000),
              url: `${BASE_URL}#/${nav.page}`,
              metadata: {},
              source_page: nav.page,
            })
          }
        }
      } catch (e) {
        console.warn(`跳过 ${nav.category}:`, e.message)
      }
    }

    // 尝试直接访问 hash 路由
    for (const nav of navItems) {
      try {
        await page.goto(`${BASE_URL}#/${nav.page}`, { waitUntil: 'domcontentloaded', timeout: 10000 })
        await page.waitForTimeout(2000)
        const text = await page.evaluate(() => document.body?.innerText || '')
        if (text.trim() && !text.includes('The connection timed out') && text.length > 100) {
          const exists = allRows.some((r) => r.source_page === nav.page && r.category === nav.category)
          if (!exists) {
            allRows.push({
              category: nav.category,
              sub_category: '',
              title: nav.category,
              content: text.slice(0, 8000),
              url: `${BASE_URL}#/${nav.page}`,
              metadata: {},
              source_page: nav.page,
            })
          }
        }
      } catch (e) {
        console.warn(`直接访问 ${nav.page} 失败:`, e.message)
      }
    }

    // 去重：同一 source_page 只保留最新一条
    const seen = new Set()
    const uniqueRows = allRows.filter((r) => {
      const key = `${r.source_page}:${r.category}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })

    console.log(`共抓取 ${uniqueRows.length} 类数据`)
    if (uniqueRows.length > 0) {
      await insertScraped(uniqueRows)
    }
  } catch (e) {
    console.error('抓取失败:', e.message)
    throw e
  } finally {
    await browser.close()
  }
}

/** 尝试将微课堂内容映射到 courses 表 */
async function syncToBusinessTables() {
  const { data: rows } = await supabase.from('h5_scraped_data').select('*').order('scraped_at', { ascending: false })
  if (!rows?.length) return

  const microClass = rows.find((r) => r.category === '微课堂' || r.source_page === 'micro-class')
  if (microClass?.content) {
    const lines = microClass.content
      .split(/[\n\r]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 2 && s.length < 100 && !/^(首页|微课堂|组合|工具|我的|加载|连接|点击|重试|智能投顾)/.test(s))
    const { data: existingCourses } = await supabase.from('courses').select('title')
    const existingTitles = new Set((existingCourses ?? []).map((c) => c.title))
    const seen = new Set()
    for (const line of lines.slice(0, 20)) {
      const title = line.slice(0, 80)
      if (seen.has(title) || existingTitles.has(title)) continue
      seen.add(title)
      const { error } = await supabase.from('courses').insert({
        title,
        type: '视频',
        duration: '',
        tag: '入门',
        thumbnail: '📖',
        desc: `来自 H5 微课堂：${line}`,
      })
      if (!error) {
        existingTitles.add(title)
        console.log('  + 课程:', title.slice(0, 40))
      }
    }
  }
}

const doSync = process.argv.includes('--sync')
scrape()
  .then(async () => {
    if (doSync) {
      console.log('\n尝试映射到业务表...')
      await syncToBusinessTables()
    }
    console.log('完成')
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
