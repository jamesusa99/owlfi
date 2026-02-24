import { useNavigate } from 'react-router-dom'

export default function ProfilePointsMall() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#1a1d21] text-white px-4 py-6">
      <h2 className="text-lg font-bold mb-4">积分商城</h2>
      <p className="text-gray-400 text-sm mb-6">使用积分兑换好礼</p>
      <div className="bg-[#252830] rounded-2xl p-6 text-center">
        <p className="text-4xl mb-2">0</p>
        <p className="text-gray-400 text-sm mb-4">当前积分</p>
        <button onClick={() => navigate('/profile')} className="text-[#d4a84b] text-sm">
          返回我的
        </button>
      </div>
    </div>
  )
}
