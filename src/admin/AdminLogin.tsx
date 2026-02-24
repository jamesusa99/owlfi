import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { setAdminLoggedIn } from './AdminProtectedRoute'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string })?.from || '/admin'

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!username || !password) {
      setError('请输入用户名和密码')
      return
    }
    // 演示用：admin / 123456
    if (username === 'admin' && password === '123456') {
      setAdminLoggedIn()
      navigate(from, { replace: true })
    } else {
      setError('用户名或密码错误')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1e3a5f] px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-[#1a365d]">猫头鹰基金研究院</h1>
          <p className="text-[#6b7c8d] text-sm mt-1">运维后台登录</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1a2b3c] mb-1">用户名</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1a2b3c] mb-1">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 bg-[#1e3a5f] text-white rounded-lg font-medium hover:opacity-90"
          >
            登录
          </button>
        </form>
        <p className="text-center text-xs text-[#6b7c8d] mt-6">
          演示账号: admin / 123456
        </p>
      </div>
    </div>
  )
}
