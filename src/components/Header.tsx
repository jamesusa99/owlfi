import { useLocation, useNavigate } from 'react-router-dom'
import Logo from './Logo'

const titles: Record<string, string> = {
  '/forum': '用户论坛',
  '/forum/create': '发帖',
  '/': '猫头鹰基金研究院',
  '/classroom': '微课堂',
  '/portfolio': '我的组合',
  '/tools': '工具箱',
  '/profile': '我的',
  '/news': '市场资讯',
  '/tools/risk': '风险测评',
  '/tools/sip': '定投计算器',
  '/tools/compound': '复利计算器',
  '/tools/fund-compare': '基金比较',
  '/tools/asset-config': '资产配置建议',
  '/tools/inflation': '通胀计算器',
  '/portfolio/create': '新建组合',
  '/portfolio/follow': '选择跟投组合',
  '/profile/orders': '我的订单',
  '/profile/cards': '银行卡管理',
  '/profile/cards/add': '添加银行卡',
  '/profile/notifications': '消息通知',
  '/profile/help': '帮助中心',
  '/profile/help/faq': '常见问题',
  '/profile/help/about': '关于我们',
  '/profile/settings': '设置',
  '/profile/settings/security': '账号安全',
  '/profile/settings/notification': '通知设置',
  '/profile/settings/privacy': '隐私设置',
  '/profile/support': '在线客服',
  '/profile/feedback': '投诉建议',
  '/profile/help/user-agreement': '用户协议',
  '/profile/help/privacy-policy': '隐私政策',
  '/profile/settings/security/change-password': '修改密码',
  '/profile/settings/security/change-phone': '更换手机号',
}

const matchTitle = (path: string): string | null => {
  if (path.startsWith('/forum/post/')) return '帖子详情'
  if (path.startsWith('/fund/')) return '基金详情'
  if (path.startsWith('/portfolio/') && path.includes('/subscribe/success')) return '申购成功'
  if (path.startsWith('/portfolio/') && path.includes('/subscribe')) return '申购'
  if (path.startsWith('/portfolio/') && path.includes('/redeem/success')) return '赎回成功'
  if (path.startsWith('/portfolio/') && path.includes('/redeem')) return '赎回'
  if (path.includes('/support/chat')) return '在线客服'
  if (path.startsWith('/portfolio/') && path.includes('/rebalance/success')) return '调仓成功'
  if (path.startsWith('/portfolio/') && path.includes('/follow/success')) return '跟投成功'
  if (path.startsWith('/portfolio/') && !path.includes('/rebalance') && !path.includes('/follow')) return '组合详情'
  if (path.includes('/rebalance')) return '调仓'
  if (path.includes('/follow') && path.includes('/confirm')) return '确认跟投'
  if (path.startsWith('/classroom/course/') && path.endsWith('/learn')) return '课程学习'
  if (path.startsWith('/classroom/course/')) return '课程详情'
  if (path.startsWith('/classroom/topic/')) return '话题'
  if (path.startsWith('/news/')) return '资讯详情'
  if (path.startsWith('/profile/help/faq/')) return '问题详情'
  if (path.startsWith('/profile/orders/')) return '订单详情'
  if (path.startsWith('/profile/notifications/')) return '通知详情'
  if (path.includes('/cards/add/success')) return '添加成功'
  if (path.includes('/feedback/success')) return '提交成功'
  return null
}

export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const title = titles[location.pathname] ?? matchTitle(location.pathname) ?? '猫头鹰基金研究院'
  const mainPaths = ['/', '/classroom', '/portfolio', '/tools', '/profile']
  const isSubPage = !mainPaths.includes(location.pathname)

  return (
    <header className="sticky top-0 z-40 bg-[var(--owl-primary)] text-white shadow-lg safe-area-inset-top">
      <div className="max-w-7xl mx-auto px-4 h-12 md:h-14 flex items-center justify-center relative">
        {isSubPage && (
          <button
            onClick={() => navigate(-1)}
            className="absolute left-4 flex items-center gap-1 text-white/90 hover:text-white"
          >
            ← 返回
          </button>
        )}
        {!isSubPage && location.pathname === '/' ? (
          <div className="flex items-center gap-2">
            <Logo size={28} />
            <h1 className="text-base md:text-lg font-semibold truncate hidden sm:block">{title}</h1>
          </div>
        ) : (
          <h1 className="text-base md:text-lg font-semibold truncate">{title}</h1>
        )}
      </div>
    </header>
  )
}
