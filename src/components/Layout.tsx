import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import BottomNav from './BottomNav'

const mainPaths = ['/', '/forum', '/classroom', '/portfolio', '/tools', '/profile']

export default function Layout() {
  const location = useLocation()
  const showBottomNav = mainPaths.includes(location.pathname)

  return (
    <div className="min-h-screen flex flex-col bg-[var(--owl-bg)] pb-16 md:pb-0">
      <Header />
      <main className="flex-1 overflow-auto max-w-7xl w-full mx-auto">
        <Outlet />
      </main>
      {showBottomNav && <BottomNav />}
    </div>
  )
}
