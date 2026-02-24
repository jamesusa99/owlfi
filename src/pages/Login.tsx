import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Logo from '../components/Logo'

export default function Login() {
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [error, setError] = useState('')

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string })?.from || '/'

  const handleSendCode = () => {
    if (phone.length !== 11 || !/^1\d{10}$/.test(phone)) {
      setError('请输入正确的11位手机号')
      return
    }
    setError('')
    setCountdown(60)
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer)
          return 0
        }
        return c - 1
      })
    }, 1000)
  }

  const handleLogin = async () => {
    if (!phone || !code) {
      setError('请填写手机号和验证码')
      return
    }
    setError('')
    const success = await login(phone, code)
    if (success) {
      navigate(from, { replace: true })
    } else {
      setError('验证码错误，请重试')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a]">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Logo size={80} showText />
        </div>
        <h1 className="text-xl font-bold text-white text-center mb-2">欢迎回来</h1>
        <p className="text-gray-400 text-sm text-center mb-8">登录猫头鹰基金研究院</p>

        <div className="space-y-4">
          <div>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
              placeholder="请输入手机号"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[var(--owl-accent)]"
            />
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="验证码"
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[var(--owl-accent)]"
            />
            <button
              onClick={handleSendCode}
              disabled={countdown > 0}
              className="px-4 py-3 bg-[var(--owl-accent)] text-[#0f172a] font-medium rounded-xl disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {countdown > 0 ? `${countdown}s` : '获取验证码'}
            </button>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            onClick={handleLogin}
            className="w-full py-3 bg-[var(--owl-accent)] text-[#0f172a] font-bold rounded-xl hover:opacity-90 transition-opacity"
          >
            登录
          </button>
        </div>

        <p className="text-gray-500 text-xs text-center mt-6">
          登录即表示同意
          <button onClick={() => navigate('/profile/help/user-agreement')} className="text-[var(--owl-accent)] mx-1">用户协议</button>
          和
          <button onClick={() => navigate('/profile/help/privacy-policy')} className="text-[var(--owl-accent)] mx-1">隐私政策</button>
        </p>
      </div>
    </div>
  )
}
